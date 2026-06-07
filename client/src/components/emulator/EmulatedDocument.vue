<script setup lang="ts">
    import {computed, toRef} from "vue";
    import {useSimulatedDocument} from "@/composables/useSimulatedDocument";
    import ShadowDomRenderer from "@/components/emulator/ShadowDomRenderer.vue";

    const {html, stylesheets} = defineProps<{
        html: string
        stylesheets: CSSStyleSheet[]
    }>();

    const emits = defineEmits<{
        (e: 'navigate', url: URL): void
    }>();

    const {documentRoot, documentStyle} = createDocument();

    function createDocument() {
        const htmlRef = toRef(() => html);
        const {documentRoot, documentStyle} = useSimulatedDocument(htmlRef);
        documentRoot.value.addEventListener('click', onEmbeddedPageClick);

        const style = computed<CSSStyleSheet[]>(() => [
            documentStyle.value,
            ...stylesheets
        ]);

        return {
            documentRoot,
            documentStyle: style
        };
    }

    function onEmbeddedPageClick(e: Event): void {
        e.preventDefault();

        if(!(e.target instanceof Element)) {
            return;
        }

        const link = e.target.closest('a');

        if(!(link instanceof HTMLAnchorElement) || !link.href) {
            return;
        }

        const url = new URL(link.href);

        emits('navigate', url);
    }
</script>

<template>
    <shadow-dom-renderer
        :root-node="documentRoot"
        :style-sheets="documentStyle"
        class="dom-container"
    />
</template>

<style scoped>
    .dom-container {
        contain: layout style;
        content-visibility: auto;
    }
</style>