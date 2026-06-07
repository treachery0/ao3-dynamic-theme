<script setup lang="ts">
    import {computed} from "vue";
    import {IHistory} from "@/composables/useHistory";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import EmulatedDocument from "@/components/emulator/EmulatedDocument.vue";

    const {getHtml, stylesheets, options, history} = defineProps<{
        getHtml: () => Promise<string>
        stylesheets: CSSStyleSheet[]
        options: BrowserOptions
        history: IHistory
    }>();

    const html = await getHtml();

    const documentStyle = computed(() => ({
        zoom: options.zoom
    }));

    function onNavigate(url: URL): void {
        // only proceed for links that are relative,
        // and therefore point to a location on the embedded site
        if(url.host !== location.host) {
            return;
        }

        const path = url.pathname + url.search;

        history.push(path);
    }
</script>

<template>
    <emulated-document
        :html="html"
        :stylesheets="stylesheets"
        :style="documentStyle"
        @navigate="onNavigate"
    />
</template>