<script setup lang="ts">
    import {Ref, watch} from "vue";
    import {useStorageRef} from "@/composables/useStorageRef";
    import {useStorageItem} from "@/composables/useStorageItem";
    import {ICache, useCache} from "@/composables/useCache";
    import {IHistory, useHistory} from "@/composables/useHistory";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import BrowserToolbar from "@/pages/editor/BrowserToolbar.vue";
    import AsyncBoundary from "@/components/ui/AsyncBoundary.vue";
    import BrowserBody from "@/pages/editor/BrowserBody.vue";

    const {getHtml, stylesheets} = defineProps<{
        getHtml: (url: string) => Promise<string>
        stylesheets: CSSStyleSheet[]
    }>();

    const options = createOptions('sb-emulator-options');
    const history = createHistory('sb-emulator-url');
    const cache = createCache(16);

    async function getCachedHtml(): Promise<string> {
        const url: string = history.location.value;

        if(!cache) {
            return getHtml(url);
        }

        return cache.getAsync(url, () => getHtml(url));
    }

    function createOptions(storageKey: string): Ref<BrowserOptions> {
        return useStorageRef<BrowserOptions>(storageKey, () => ({
            zoom: 1
        }));
    }

    function createHistory(storageKey: string): IHistory {
        const storage = useStorageItem<string>(localStorage, storageKey);
        const history = useHistory(storage.getItem() ?? '/');

        watch(history.location, value => {
            storage.setItem(value);
        });

        return history;
    }

    function createCache(cacheSize: number): ICache<string, string> | undefined {
        if(!cacheSize || cacheSize <= 0) {
            return;
        }

        return useCache<string, string>(
            new Map<string, string>(),
            {maxItems: 16}
        );
    }
</script>

<template>
    <div class="@container h-full flex flex-col bg-base-100">
        <browser-toolbar
            v-model="options"
            :history="history"
            class="border-base-content/30 border-b-2"
        />

        <div class="grow overflow-auto">
            <async-boundary :transitionKey="history.location.value">
                <browser-body
                    :get-html="getCachedHtml"
                    :stylesheets="stylesheets"
                    :history="history"
                    :options="options"
                />
            </async-boundary>
        </div>
    </div>
</template>