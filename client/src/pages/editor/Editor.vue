<script setup lang="ts">
    import { ref, watch } from "vue";
    import { fetchAssets } from "@/functions/api";
    import { useStorage } from "@/composables/useStorage";
    import { IHistory, useHistory } from "@/composables/useHistory";
    import { initializeSkinStore } from "@/stores/useSkinStore";
    import { initializeSchemaStore } from "@/stores/useSchemaStore";
    import { SkinChunk } from "common/models";
    import SettingsVariables from "@/pages/editor/SettingsVariables.vue";
    import BrowserToolbar from "@/pages/editor/BrowserToolbar.vue";
    import Browser from "@/pages/editor/Browser.vue";
    import { BrowserOptions } from "@/models/BrowserOptions";
    import { useStorageRef } from "@/composables/useStorageRef";

    const {} = initializeSkinStore();
    const {stylesheets} = initializeSchemaStore(await getStylesheets());
    const history = createHistory('sg-editor-url');

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

    const browserOptions = useStorageRef<BrowserOptions>('sg-editor-browser-options', () => ({
        zoom: 1
    }));
</script>

<template>
    <div class="absolute inset-0 flex">
        <div class="overflow-y-auto min-w-64 w-64 p-3 my-2">
            <settings-variables/>
        </div>

        <div class="overflow-y-auto grow">
            <div class="relative h-full flex flex-col p-2 gap-2">
                <browser-toolbar
                    v-model="browserOptions"
                    :history="history"
                />

                <div class="grow overflow-auto rounded-xl border-2 shadow shadow-base-300">
                    <browser
                        :history="history"
                        :stylesheets="stylesheets"
                        :cache-size="16"
                        :style="browserOptions"
                    />
                </div>
            </div>
        </div>
    </div>
</template>