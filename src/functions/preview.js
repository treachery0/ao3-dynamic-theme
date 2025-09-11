import { promises as fs } from "fs";
import puppeteer from "puppeteer";
import path from "path";
import minimist from "minimist";
import express from "express";
import postcss from "postcss";
import { createProxyMiddleware } from "http-proxy-middleware";
import { JSDOM } from "jsdom";
import postcssConfig from "../../postcss.config.js";
import previewConfig from "../../preview.config.js";

const argv = minimist(process.argv.slice(2));
await main(argv);

async function main(argv) {
    const css = await compileStyleSheets();
    console.log('✅  Compiled stylesheets');

    const pages = await fetchPages();
    console.log('✅  Fetched pages');

    await applyStyles(pages, css);
    console.log('✅  Applied styles to pages');

    const server = startServer(pages);
    console.log('✅  Web server started');

    if(argv.live) {
        console.log('✅  Live pages ready');

        for (const [url, _] of pages) {
            console.log(`  http://localhost:${previewConfig.port}${url}`);
        }
    }
    else {
        await createPreviews(pages.keys());
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
            const url = previewConfig.baseUrl + page;
            const html = await fetchHtml(url);
            const dom = new JSDOM(html, {url: url});

            pages.set(page, dom);

            console.log(`   Prepared "${page}"`);
        }
        catch(err) {
            console.error(`   Error processing ${page}:`, err instanceof Error ? err.message : String(err));
        }
    }

    return pages;
}

async function fetchHtml(url) {
    const res = await fetch(url, {redirect: 'follow'});

    if(!res.ok) {
        throw new Error(`   Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }

    return await res.text();
}

async function applyStyles(pages, css) {
    for(const [_, dom] of pages) {
        cleanDOM(dom);
        injectCss(dom, css);
    }
}

function cleanDOM(dom) {
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

function injectCss(dom, css) {
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

async function ensureDir(dir) {
    await fs.mkdir(dir, {recursive: true});
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

function startServer(pages) {
    const app = express();

    app.use(
        createProxyMiddleware({
            target: previewConfig.baseUrl,
            changeOrigin: true,
            selfHandleResponse: false,
            pathFilter: (path, req) => {
                return path.match('^/images') && req.method === 'GET';
            }
        }),
        (req, res) => {
            const page = pages.get(req.path);

            if(page) {
                res.setHeader('Content-Type', 'text/html')
                res.send(page.serialize());
            }
            else {
                res.status(404);
                res.send(`Page ${req.path} not found`);
            }
        }
    );

    return app.listen(previewConfig.port);
}

async function createPreviews(urls) {
    const browser = await puppeteer.launch();

    await ensureDir(previewConfig.outputDir);

    for(const url of urls) {
        const name = url.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9.-]/gi, '-') || 'home';
        const fileName = `${name}.${previewConfig.capture.extension}`;

        await saveScreenshot(`http://localhost:${previewConfig.port}${url}`, browser, fileName);
        console.log(`   Saved ${fileName}`);
    }

    await browser.close();
}