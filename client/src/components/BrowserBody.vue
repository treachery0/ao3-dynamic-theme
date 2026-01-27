<script setup lang="ts">
    import { ref } from "vue";
    import { fetchPages } from "@/functions/api";
    import { useAbort } from "@/composables/UseAbort";
    import { HtmlAsset } from "shared/models";
    import ShadowDomRenderer from "@/components/ShadowDomRenderer.vue";
    import LoadingIndicator from "@/components/LoadingIndicator.vue";
    import { processHtml } from "@/functions/html-utils";

    const {url, stylesheets} = defineProps<{
        url: string,
        stylesheets: string[]
    }>()

    const emits = defineEmits<{
        (e: 'navigate', url: string): void
    }>();

    const html = ref<HTMLElement>();
    const ready = ref<boolean>(false);
    const {runAbortable} = useAbort();

    await runAbortable(async (controller) => {
        const response = await fetchPages(url, controller);

        if(!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data: HtmlAsset = await response.json();

        html.value = processHtml(data.content);
    });

    function onNavigate(newUrl: string) {
        emits('navigate', newUrl);
    }

    function onReady() {
        ready.value = true;
    }
</script>

<template>
    <div class="relative">
        <transition-group name="fade-group">
            <shadow-dom-renderer
                key="content"
                v-if="html"
                v-show="ready"
                :html="html"
                :stylesheets="stylesheets"
                @navigate="onNavigate"
                @ready="onReady"
            />
            <loading-indicator
                key="loading"
                v-if="!ready"
            />
        </transition-group>
    </div>
</template>