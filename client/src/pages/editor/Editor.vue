<script setup lang="ts">
    import {computed, Component as VueComponent, shallowRef} from "vue";
    import {fetchAssets, fetchPages} from "@/functions/api";
    import {getDefaultSkinTemplate} from "@/functions/theme";
    import {createMediaQueryWrapped} from "common/functions/css-utils";
    import {useVariableStylesheet} from "@/composables/useVariableStylesheet";
    import {initializeTemplateStore} from "@/stores/useTemplateStore";
    import {SkinChunk} from "common/models/SkinChunk";
    import Browser from "@/pages/editor/Browser.vue";
    import EditorTabs from "@/pages/editor/EditorTabs.vue";

    const {template, variables} = initializeTemplateStore(getDefaultSkinTemplate);
    const variableStyles = useVariableStylesheet(template, variables);

    const templateStyles = await getStylesheets();
    const stylesheets = computed<CSSStyleSheet[]>(() => [variableStyles.value, ...templateStyles]);

    const currentTab = shallowRef<VueComponent>();

    async function getStylesheets(): Promise<CSSStyleSheet[]> {
        const response = await fetchAssets();

        if(!response.ok) {
            throw new Error(`Couldn't fetch assets from server. Is the server online?`);
        }

        const chunks: SkinChunk[] = await response.json();

        return chunks.map(c => createMediaQueryWrapped(c.media, c.content));
    }

    async function getHtml(url: string): Promise<string> {
        const response = await fetchPages(url);

        if(!response.ok) {
            throw new Error(`Failed to fetch page (${response.status} ${response.statusText})`);
        }

        return response.text();
    }
</script>

<template>
    <div class="absolute inset-0 flex flex-col-reverse md:flex-col md:m-2.5 md:gap-2.5 overflow-hidden">
        <editor-tabs
            v-model="currentTab"
            class="border-t md:border-2 border-base-content/30 z-10"
        />

        <div class="grow flex gap-2.5 min-h-0 relative">
            <browser
                :get-html="getHtml"
                :stylesheets="stylesheets"
                class="grow border-t-2 md:border-2 border-base-content/30 md:flex"
                :class="{'hidden': currentTab}"
            />

            <div class="w-full md:w-64 p-4 md:p-0 overflow-y-auto" v-if="currentTab">
                <div class="mx-auto max-w-80">
                    <component :is="currentTab"/>
                </div>
            </div>
        </div>
    </div>
</template>