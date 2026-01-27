export function setupNavigation(root: ShadowRoot, onNavigate: (url: string) => void): void {
    root.querySelector('.__body_placeholder__')?.addEventListener('click', e => {
        e.preventDefault();

        if(!(e.target instanceof Element)) {
            return;
        }

        const link = e.target.closest('a');

        if(!(link instanceof HTMLAnchorElement) || !link.href) {
            return;
        }

        const url = new URL(link.href);

        onNavigate(url.pathname);
    });
}

export async function applyCss(shadowRoot: ShadowRoot, stylesheets: string[]) {
    shadowRoot.adoptedStyleSheets.splice(0);

    await addStyleSheet(shadowRoot, getDefaultShadowDomStyles());

    for(const stylesheet of stylesheets) {
        await addStyleSheet(shadowRoot, stylesheet);
    }
}

async function styleSheetFromString(css: string): Promise<CSSStyleSheet> {
    const sheet = new CSSStyleSheet();
    return sheet.replace(css);
}

async function addStyleSheet(shadowRoot: ShadowRoot, css: string) {
    const sheet = await styleSheetFromString(css);

    shadowRoot.adoptedStyleSheets.push(sheet);
}

function getDefaultShadowDomStyles(): string {
    return `
        :host {
            all: initial;
            display: block;
        }
    
        .__html_placeholder__ {
            height: 100%;
        }
    
        .__body_placeholder__ {
            height: 100%;
            overflow: auto;
        }
    `;
}