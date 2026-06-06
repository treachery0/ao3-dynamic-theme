<script setup lang="ts">
    import {ref} from "vue";
    import {ISimulatedDocument, useSimulatedDocument} from "@/composables/useSimulatedDocument";
    import ShadowDomRenderer from "@/components/ui/ShadowDomRenderer.vue";

    const {stylesheets, getHtml} = defineProps<{
        stylesheets: CSSStyleSheet[]
        getHtml: () => Promise<string>
    }>();

    const emits = defineEmits<{
        (e: 'navigate', url: string): void
    }>();

    const {documentRoot, documentStyle} = await createDocument();

    async function createDocument(): Promise<ISimulatedDocument> {
        const html = await getHtml();
        const htmlRef = ref(html);

        const {documentRoot, documentStyle} = useSimulatedDocument(htmlRef);
        documentRoot.value.addEventListener('click', onClickEvent);

        return {documentRoot, documentStyle};
    }

    function onClickEvent(e: Event): void {
        e.preventDefault();

        if(!(e.target instanceof Element)) {
            return;
        }

        const link = e.target.closest('a');

        if(!(link instanceof HTMLAnchorElement) || !link.href) {
            return;
        }

        emits('navigate', link.href);
    }
</script>

<template>
    <shadow-dom-renderer
        :root-node="documentRoot"
        :style-sheets="[documentStyle, ...stylesheets]"
        class="dom-container"
    />
</template>

<style scoped>
    .dom-container {
        contain: layout style;
        content-visibility: auto;
    }
</style>