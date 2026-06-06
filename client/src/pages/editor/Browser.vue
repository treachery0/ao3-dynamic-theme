<script setup lang="ts">
    import {fetchPages} from "@/functions/api";
    import {ICache, useCache} from "@/composables/useCache";
    import {IHistory} from "@/composables/useHistory";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import BrowserBody from "@/pages/editor/BrowserBody.vue";
    import BrowserToolbar from "@/pages/editor/BrowserToolbar.vue";
    import AsyncBoundary from "@/components/ui/AsyncBoundary.vue";

    const {history, stylesheets = [], cacheSize} = defineProps<{
        history: IHistory
        stylesheets?: CSSStyleSheet[]
        cacheSize?: number
    }>();

    const options = defineModel<BrowserOptions>({
        required: true
    });

    const cache: ICache<string, string> | undefined = createCache();

    async function getHtml(): Promise<string> {
        const url: string = history.location.value;

        if(!cache) {
            return fetchHtml(url);
        }

        return cache.getAsync(url, () => fetchHtml(url));
    }

    async function fetchHtml(url: string): Promise<string> {
        const response = await fetchPages(url);

        if(!response.ok) {
            throw new Error(`Failed to fetch page (${response.status} ${response.statusText})`);
        }

        return response.text();
    }

    function createCache(): ICache<string, string> | undefined {
        if(!cacheSize || cacheSize <= 0) {
            return;
        }

        return useCache<string, string>(
            new Map<string, string>(),
            {maxItems: 16}
        );
    }

    function onNavigate(href: string): void {
        const url = new URL(href);

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
    <div class="@container h-full flex flex-col bg-base-100 border-2 border-base-content/30">
        <browser-toolbar
            v-model="options"
            :history="history"
            class="py-1 border-base-content/30 border-b-2"
        />

        <div class="grow overflow-auto">
            <async-boundary :transitionKey="history.location.value">
                <browser-body
                    :get-html="getHtml"
                    :stylesheets="stylesheets"
                    @navigate="onNavigate"
                    :style="options"
                />
            </async-boundary>
        </div>
    </div>
</template>