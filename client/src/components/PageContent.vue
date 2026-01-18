<script setup lang="ts">
    import { onMounted, ref, useTemplateRef, watch } from "vue";

    const {html = '', stylesheets = []} = defineProps<{
        html?: string
        stylesheets?: string[]
    }>();

    const emits = defineEmits<{
        (e: 'navigate', url: string): void
    }>();

    const containerEl = useTemplateRef('container');
    const shadowRoot = ref<ShadowRoot>();

    onMounted(async () => {
        if(containerEl.value) {
            shadowRoot.value = containerEl.value.attachShadow({mode: 'open'});
        }

        setHtml();
        await setCss();
    })

    watch(() => stylesheets, setCss, {immediate: true});
    watch(() => html, setHtml, {immediate: true});

    async function setCss() {
        if(!shadowRoot.value) {
            return;
        }

        shadowRoot.value.adoptedStyleSheets.splice(0);

        await addStyleSheet(`
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
        `);

        for(const stylesheet of stylesheets) {
            await addStyleSheet(stylesheet);
        }
    }

    function setHtml() {
        if(!shadowRoot.value) {
            return;
        }

        shadowRoot.value.innerHTML = `
            <div class="__html_placeholder__">
                <div class="__body_placeholder__">
                    ${html}
                </div>
            </div>
        `;

        setupNavigation();
    }

    function setupNavigation() {
        shadowRoot.value?.querySelector('.__body_placeholder__')?.addEventListener('click', e => {
            e.preventDefault();

            if(!(e.target instanceof Element)) {
                return;
            }

            const link = e.target.closest('a');

            if(!(link instanceof HTMLAnchorElement) || !link.href) {
                return;
            }

            const url = new URL(link.href);

            emits('navigate', url.pathname);
        });
    }

    async function addStyleSheet(css: string) {
        if(!shadowRoot.value) {
            return;
        }

        const sheet = new CSSStyleSheet();
        await sheet.replace(css);

        shadowRoot.value.adoptedStyleSheets.push(sheet);
    }
</script>

<template>
    <div ref="container"/>
</template>