<script setup lang="ts">
    import { onMounted, ref, watch } from "vue";
    import { House } from "lucide-vue-next";
    import { fetchPages } from "@/functions/api.ts";
    import { getAvailableUrls } from "ao3-tg-shared";
    import { PageResponse } from "ao3-tg-shared";
    import PageContent from "@/components/PageContent.vue";
    import PageUrl from "@/components/PageUrl.vue";

    const {stylesheets, baseUrl} = defineProps<{
        stylesheets: string[]
        baseUrl: string
    }>();

    const url = defineModel<string>({
        required: true
    });

    const html = ref<string>();
    const errorMessage = ref<string>();

    onMounted(async () => {
        await fetchPage(url.value);
    });

    watch(url, async value => {
        await fetchPage(value);
    });

    async function fetchPage(urlPathname: string) {
        const response = await fetchPages(urlPathname);

        if(!response.ok) {
            html.value = undefined;
            errorMessage.value = `${response.status} ${response.statusText}`;
            return;
        }

        const data: PageResponse = await response.json();

        html.value = data.page.html;
    }

    function navigateTo(newUrl: string) {
        url.value = newUrl;
    }
</script>

<template>
    <div class="mockup-browser rounded-none">
        <div class="mockup-browser-toolbar">
            <div class="flex gap-2 mx-auto items-center">
                <button class="btn btn-ghost p-0 h-auto" @click="navigateTo('/')">
                    <house :size="18"/>
                </button>
                <page-url :base="baseUrl" v-model="url" class="input outline-0 m-0 w-72"/>
            </div>
        </div>

        <page-content
            v-if="html"
            :html="html"
            :stylesheets="stylesheets"
            @navigate="navigateTo"
        />

        <div v-else class="flex flex-col gap-8 items-center p-8">
            <div class="text-error text-2xl">{{ errorMessage }}</div>

            <!-- TODO: remove once implemented -->
            <div class="grid gap-1">
                <div class="text-error font-bold">Navigation is not yet implemented. Available pages:</div>
                <ul class="list-disc w-32 ps-8 mt-4">
                    <li v-for="u in getAvailableUrls()">
                        <a class="link" @click="url = u">{{ u }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>