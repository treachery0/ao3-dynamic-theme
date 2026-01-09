import path from "path";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { JSDOM } from "jsdom";
import previewConfig from "../../preview.config.js";

const metaKey = 'created-at';
const metaSelector = `meta[name="${metaKey}"]`;

function getCachePath(url) {
    const directory = previewConfig.caching.directory;

    mkdirSync(directory, {recursive: true});

    return path.join(directory, `${encodeURIComponent(url)}.html`);
}

function hasExpired(dom) {
    const metaElement = dom.window.document.querySelector(metaSelector);

    const expirationDate = metaElement ? Number(metaElement.content) : 0;
    const currentDate = Date.now();
    const age = currentDate - expirationDate;

    return age > previewConfig.caching.duration;
}

function addExpiration(dom) {
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

function readFile(url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);
    const fileEncoding = 'utf-8';

    try {
        return readFileSync(filePath, fileEncoding);
    }
    catch {
    }
}

function writeFile(html, url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);
    const fileEncoding = 'utf-8';

    writeFileSync(filePath, html, fileEncoding);
}

function deleteFile(url) {
    if(!previewConfig.caching.enabled) {
        return;
    }

    const filePath = getCachePath(url);

    rmSync(filePath);
}

export function writeCache(dom, url) {
    addExpiration(dom);
    writeFile(dom.serialize(), url);
}

export function readCache(url) {
    const html = readFile(url);

    if(!html) {
        return;
    }

    const dom = new JSDOM(html, {url});

    if(hasExpired(dom)) {
        deleteFile(url);
        return;
    }

    addExpiration(dom);

    return dom;
}