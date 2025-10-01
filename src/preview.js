import { promises as fs } from "fs";
import puppeteer from "puppeteer";
import path from "path";
import minimist from "minimist";
import postcss from "postcss";
import { JSDOM } from "jsdom";
import postcssConfig from "../postcss.config.js";
import previewConfig from "../preview.config.js";
import { readCache, writeCache } from "./functions/cache.js";
import { startServer } from "./functions/server.js";

const argv = minimist(process.argv.slice(2));
await main(argv);

async function main(argv) {
    const pages = await fetchPages();
    console.log('✅  Fetched pages');

    const css = await compileStyleSheets();
    console.log('✅  Compiled stylesheets');

    for(const dom of pages.values()) {
        applyStyleSheets(dom, css);
    }
    console.log('✅  Applied styles to pages');

    const server = startServer(pages);
    console.log('✅  Web server started');

    if(argv.live) {
        console.log('✅  Live pages ready');

        for(const [url, _] of pages) {
            console.log(`  http://localhost:${previewConfig.port}${url}`);
        }
    }
    else {
        await saveScreenshots(pages.keys());
        console.log('✅  Created preview images');

        server.close();
        console.log('✅  Done');
    }
}

async function compileStyleSheets() {
    const results = [];
    const postCSS = await postcss(postcssConfig.plugins);

    for(const stylesheet of previewConfig.stylesheets) {
        const filePath = path.join(previewConfig.inputDir, stylesheet.path);
        const fileContents = await fs.readFile(filePath, 'utf-8');

        const result = await postCSS.process(fileContents, {
            from: filePath
        });

        results.push(`@media ${stylesheet.media}{${result.css}}`);
    }

    return results.join('');
}

async function fetchPages() {
    const pages = new Map();

    for(const page of previewConfig.pages) {
        try {
            const url = previewConfig.site + page;
            const dom = await createDom(url);

            pages.set(page, dom);

            console.log(`   Prepared "${page}"`);
        }
        catch(err) {
            console.error(`   Error processing ${page}:`, err instanceof Error ? err.message : String(err));
        }
    }

    return pages;
}

async function createDom(url) {
    let dom = await readCache(url);

    if(dom) {
        return dom;
    }

    const res = await fetch(url);

    if(!res.ok) {
        throw new Error(`Failed to fetch resource (${res.status}), ${res.statusText}`);
    }

    const html = await res.text();
    dom = new JSDOM(html, {url});

    cleanDocument(dom);
    await writeCache(dom, url);

    return dom;
}

function cleanDocument(dom) {
    const doc = dom.window.document;

    // remove scripts
    doc.querySelectorAll('script')
        .forEach(el => el.remove());

    // remove referenced stylesheets
    doc.querySelectorAll('link[rel="stylesheet"]')
        .forEach(el => el.remove());

    // remove inline styles
    doc.querySelectorAll('style')
        .forEach(el => el.remove());
}

function applyStyleSheets(dom, css) {
    const doc = dom.window.document;
    const styleEl = doc.createElement('style');
    styleEl.appendChild(doc.createTextNode(css));

    if(doc.head) {
        doc.head.appendChild(styleEl);
    }
    else {
        doc.documentElement.insertBefore(styleEl, doc.body);
    }
}

async function saveScreenshots(urls) {
    const browser = await puppeteer.launch();

    await fs.mkdir(previewConfig.outputDir, {recursive: true});

    for(const url of urls) {
        const name = url.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9.-]/gi, '-') || 'root';
        const fileName = `${name}.${previewConfig.capture.extension}`;

        await saveScreenshot(`http://localhost:${previewConfig.port}${url}`, browser, fileName);
        console.log(`   Saved ${fileName}`);
    }

    await browser.close();
}

async function saveScreenshot(url, browser, fileName) {
    const page = await browser.newPage();

    await page.setViewport({
        width: previewConfig.capture.width,
        height: previewConfig.capture.height
    });

    await page.goto(url);
    await page.waitForNetworkIdle();

    const filePath = path.join(previewConfig.outputDir, fileName);

    await page.screenshot({
        type: previewConfig.capture.extension,
        path: filePath
    });

    await page.close();
}