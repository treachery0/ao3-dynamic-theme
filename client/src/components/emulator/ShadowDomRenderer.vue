<script setup lang="ts">
    import {onMounted, ref, useTemplateRef, watch} from "vue";

    const {rootNode, styleSheets} = defineProps<{
        rootNode: Node
        styleSheets: CSSStyleSheet[]
    }>();

    const containerEl = useTemplateRef('container');
    const shadowRoot = ref<ShadowRoot | null>(null);

    onMounted(onInitialize);
    watch(() => styleSheets, onStyleChange);

    function onInitialize(): void {
        if(!containerEl.value) {
            return;
        }

        shadowRoot.value = containerEl.value.attachShadow({mode: 'open'});
        shadowRoot.value.replaceChildren(rootNode);

        onStyleChange(styleSheets);
    }

    function onStyleChange(stylesheets: CSSStyleSheet[]): void {
        if(!shadowRoot.value) {
            return;
        }

        shadowRoot.value.adoptedStyleSheets = stylesheets;
    }
</script>

<template>
    <div ref="container"/>
</template>