import path from "path";
import { promises as fs } from "fs";
import { JSDOM } from "jsdom";
import previewConfig from "../../preview.config.js";

const metaKey = 'created-at';
const metaSelector = `meta[name="${metaKey}"]`;

function getCachePath(url) {
    const directory = previewConfig.caching.directory;
    const name = `${encodeURIComponent(url)}.html`;

    return path.join(directory, name);
}

function hasExpired(dom) {
    const metaElement = dom.window.document.querySelector(metaSelector);

    const expirationDate = metaElement ? Number(metaElement.content) : 0;
    const currentDate = Date.now();
    const age = currentDate - expirationDate;

    return age > previewConfig.caching.duration;
}

async function addExpiration(dom) {
    const doc = dom.window.document;
    let expirationEl = doc.querySelector(metaSelector);
    const expirationDate = String(Date.now());

    if(expirationEl) {
        expirationEl.content = expirationDate;
        return;
    }

    expirationEl = doc.createElement('meta');
    expirationEl.name = metaKey;
    expirationEl.content = String(Date.now());

    doc.head.appendChild(expirationEl);
}

async function readFile(url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);
    const fileEncoding = 'utf-8';

    return await fs.readFile(filePath, fileEncoding);
}

async function writeFile(html, url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);
    const fileEncoding = 'utf-8';

    await fs.writeFile(filePath, html, fileEncoding);
}

async function deleteFile(url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);

    await fs.rm(filePath);
}

export async function writeCache(dom, url) {
    await addExpiration(dom);
    await writeFile(dom.serialize(), url);
}

export async function readCache(url) {
    const html = await readFile(url);

    if(!html) {
        return;
    }

    const dom = new JSDOM(html, {url});

    if(hasExpired(dom)) {
        await deleteFile(url);
        return;
    }

    await addExpiration(dom);

    return dom;
}