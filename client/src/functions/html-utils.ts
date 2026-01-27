export function processHtml(html: string): HTMLElement {
    const document = parseDocument(html);

    cleanDocument(document);

    return wrapDocument(document);
}

function parseDocument(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
}

function cleanDocument(document: Document): void {
    document.querySelectorAll('meta, title, script, style, link').forEach(el => {
        el.remove();
    });

    document.querySelectorAll('img[src^="/images"]').forEach(el => {
        const element = el as HTMLImageElement;
        const url = new URL(element.src);

        element.src = `${__URL_BASE__}${url.pathname}`;
    });
}

function wrapDocument(document: Document): HTMLElement {
    const htmlWrapper = document.createElement('div');
    htmlWrapper.className = '__html_placeholder__';

    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = '__body_placeholder__';

    htmlWrapper.appendChild(bodyWrapper);

    while(document.body.firstChild) {
        bodyWrapper.appendChild(document.body.firstChild);
    }

    return htmlWrapper;
}