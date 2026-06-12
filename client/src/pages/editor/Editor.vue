<script setup lang="ts">
    import {computed} from "vue";
    import {LucideSquareFunction, Hammer, Blocks, Eye} from "@lucide/vue";
    import {fetchAssets, fetchPages} from "@/functions/api";
    import {createMediaQueryWrapped} from "common/functions";
    import {useStorageRef} from "@/composables/useStorageRef";
    import {useVariableStylesheet} from "@/composables/useVariableStylesheet";
    import {initializeSchemaStore} from "@/stores/useSchemaStore";
    import {SkinChunk} from "common/models";
    import {EditorTab} from "@/models/EditorTab";
    import TabVariables from "@/pages/editor/TabVariables.vue";
    import Browser from "@/pages/editor/Browser.vue";
    import TabResults from "@/pages/editor/TabResults.vue";
    import TabTemplates from "@/pages/editor/TabTemplates.vue";

    const {schema, variables} = initializeSchemaStore();

    const templateStyles = await getStylesheets();
    const variableStyles = useVariableStylesheet(schema, variables);
    const stylesheets = computed<CSSStyleSheet[]>(() => [variableStyles.value, ...templateStyles]);

    const activeTabIndex = useStorageRef<number>('sb-active-tab', () => 0);
    const activeTabComponent = computed(() => tabs[activeTabIndex.value]?.component);

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

    const tabs: EditorTab[] = [
        {
            label: 'Preview',
            icon: Eye,
            component: undefined
        },
        {
            label: 'Variables',
            icon: LucideSquareFunction,
            component: TabVariables
        },
        {
            label: 'Templates',
            icon: Blocks,
            component: TabTemplates
        },
        {
            label: 'Results',
            icon: Hammer,
            component: TabResults
        }
    ];
</script>

<template>
    <div class="absolute inset-0 flex flex-col-reverse md:flex-col md:m-2.5 md:gap-2.5 overflow-hidden">
        <div class="flex border-t md:border-2 border-base-content/30 z-10">
            <button
                v-for="(tab, i) in tabs"
                :key="i"
                :class="[tab.classes, {'btn-primary': activeTabIndex === i}]"
                class="btn h-auto p-1.5 border-0 bg-base flex-col md:flex-row grow gap-0.5 md:gap-1.5"
                @click="activeTabIndex = i"
            >
                <component v-if="tab.icon" :is="tab.icon"/>
                <span>{{tab.label}}</span>
            </button>
        </div>

        <div class="grow flex gap-2.5 min-h-0 relative">
            <browser
                :get-html="getHtml"
                :stylesheets="stylesheets"
                class="grow border-t-2 md:border-2 border-base-content/30 md:flex"
                :class="{'hidden': activeTabComponent}"
            />

            <div class="w-full md:w-64 p-4 md:p-0 overflow-y-auto" v-if="activeTabComponent">
                <div class="mx-auto max-w-80">
                    <component :is="activeTabComponent"/>
                </div>
            </div>
        </div>
    </div>
</template>