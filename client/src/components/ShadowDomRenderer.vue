<script setup lang="ts">
    import { ref, useTemplateRef, watch, onMounted } from "vue";
    import { setupNavigation, applyCss } from "@/functions/shadow-utils";

    const {html, stylesheets} = defineProps<{
        html: HTMLElement
        stylesheets: string[]
    }>();

    const emits = defineEmits<{
        (e: 'navigate', url: string): void
        (e: 'ready'): void
    }>();

    const containerEl = useTemplateRef('container');
    const shadowRoot = ref<ShadowRoot>();

    onMounted(async () => {
        if(!containerEl.value) {
            return;
        }

        shadowRoot.value = containerEl.value.attachShadow({mode: 'open'});
        shadowRoot.value.replaceChildren(html);

        setupNavigation(shadowRoot.value, url => emits('navigate', url));
        await applyCss(shadowRoot.value, stylesheets);

        emits('ready');
    });

    watch(() => stylesheets, async () => {
        if(shadowRoot.value) {
            await applyCss(shadowRoot.value, stylesheets);
        }
    });
</script>

<template>
    <div ref="container"/>
</template>