<script setup lang="ts">
    import {Component as Comp, computed, Ref, watch} from "vue";
    import {fetchAssets} from "@/functions/api";
    import {useStorage} from "@/composables/useStorage";
    import {useStorageRef} from "@/composables/useStorageRef";
    import {IHistory, useHistory} from "@/composables/useHistory";
    import {initializeSkinStore} from "@/stores/useSkinStore";
    import {initializeSchemaStore} from "@/stores/useSchemaStore";
    import {SkinChunk} from "common/models";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import TabVariables from "@/pages/editor/TabVariables.vue";
    import Browser from "@/pages/editor/Browser.vue";
    import {LucideSquareFunction, FileBox} from "@lucide/vue";
    import TabResults from "@/pages/editor/TabResults.vue";

    const {} = initializeSkinStore();
    const {stylesheets} = initializeSchemaStore(await getStylesheets());

    const browserHistory = createHistory('sg-url');
    const browserOptions = createOptions('sg-browser-options');
    const activeTab = useStorageRef<string | undefined>('sg-active-tab', () => undefined);

    async function getStylesheets(): Promise<SkinChunk[]> {
        const response = await fetchAssets();

        if(!response.ok) {
            throw new Error(`Couldn't fetch assets from server. Is the server online?`);
        }

        return await response.json();
    }

    function createHistory(storageKey: string): IHistory {
        const storage = useStorage<string>(localStorage, storageKey);
        const history = useHistory(storage.getItem() ?? '/');

        watch(history.location, value => {
            storage.setItem(value);
        });

        return history;
    }

    function createOptions(storageKey: string): Ref<BrowserOptions> {
        return useStorageRef<BrowserOptions>(storageKey, () => ({
            zoom: 1
        }));
    }

    const tabs: Tab[] = [
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

    const activeTabComponent = computed<Comp>(() => {
        const tab: Tab | undefined = tabs.find(x => x.id === activeTab.value);

        if(!tab) {
            return tabs[0].component;
        }

        return tab.component;
    });

    interface Tab {
        id: string
        label: string
        icon?: Comp
        component: Comp
    }
</script>

<template>
    <div class="absolute inset-0 flex p-2.5 gap-4">
        <div class="grow flex flex-col gap-2.5">
            <div class="flex border-2 border-base-content/30">
                <button
                    v-for="tab in tabs"
                    @click="activeTab = tab.id"
                    class="btn py-4.5 w-32 border-0 bg-base"
                    :class="{'btn-primary': activeTab === tab.id}"
                >
                    <component v-if="tab.icon" :is="tab.icon"/>
                    <span>{{tab.label}}</span>
                </button>
            </div>
            <div class="overflow-auto">
                <browser
                    v-model="browserOptions"
                    :history="browserHistory"
                    :stylesheets="stylesheets"
                    :cache-size="16"
                />
            </div>
        </div>

        <div class="overflow-y-auto min-w-64 w-64 pt-2.5">
            <component :is="activeTabComponent"/>
        </div>
    </div>
</template>