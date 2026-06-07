<script setup lang="ts">
    import {computed} from "vue";
    import {LucideSquareFunction, FileBox} from "@lucide/vue";
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
    import SidebarWrapper from "@/components/layout/SidebarWrapper.vue";

    const {schema, variables} = initializeSchemaStore();

    const templateStyles = await getStylesheets();
    const variableStyles = useVariableStylesheet(schema, variables);
    const stylesheets = computed<CSSStyleSheet[]>(() => [variableStyles.value, ...templateStyles]);

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
            id: 'vars',
            label: 'Variables',
            icon: LucideSquareFunction,
            component: TabVariables
        },
        {
            id: 'res',
            label: 'Results',
            icon: FileBox,
            component: TabResults
        }
    ];

    const activeTabId = useStorageRef<string>('sb-active-tab', () => tabs[0].id);

    const activeTabComponent = computed(() => {
        const tab: EditorTab | undefined = tabs.find(x => x.id === activeTabId.value);

        if(!tab) {
            return tabs[0].component;
        }

        return tab.component;
    });
</script>

<template>
    <div class="absolute inset-0 flex flex-col m-2.5 gap-2.5 overflow-hidden">
        <!-- editor toolbar -->
        <div class="flex border-2 border-base-content/30">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="[tab.classes, {'btn-secondary': activeTabId === tab.id}]"
                class="btn py-4.5 w-32 border-0 bg-base"
                @click="activeTabId = tab.id"
            >
                <component v-if="tab.icon" :is="tab.icon"/>
                <span>{{tab.label}}</span>
            </button>
        </div>

        <!-- editor body -->
        <div class="grow flex gap-2.5 min-h-0 relative flex-col md:flex-row">
            <browser
                :get-html="getHtml"
                :stylesheets="stylesheets"
                class="grow border-2 border-base-content/30"
            />

            <sidebar-wrapper>
                <component :is="activeTabComponent"/>
            </sidebar-wrapper>
        </div>
    </div>
</template>