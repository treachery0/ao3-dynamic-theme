<script setup lang="ts">
    import { ref } from "vue";
    import { fetchPages } from "@/functions/api.ts";
    import { HtmlAsset } from "shared/models";
    import PageContent from "@/components/PageContent.vue";

    const {url, stylesheets} = defineProps<{
        url: string,
        stylesheets: string[]
    }>()

    const emits = defineEmits<{
        (e: 'navigate', url: string): void
    }>();

    const html = ref<string>();
    const errorMessage = ref<string>();
    const controller = new AbortController();
    const inProgress = ref(false);

    await updatePage(url);

    async function updatePage(urlPathname: string) {
        if(inProgress.value) {
            controller.abort();
        }

        inProgress.value = true;

        try {
            const response = await fetchPages(urlPathname, controller);

            if(!response.ok) {
                html.value = undefined;
                errorMessage.value = `${response.status} ${response.statusText}`;
                inProgress.value = false;
                return;
            }

            const data: HtmlAsset = await response.json();

            html.value = data.content;
        }
        catch(e: any) {
            if(e.name !== 'AbortError') {
                console.error(e);
            }
        }

        inProgress.value = false;
    }

    function navigateTo(newUrl: string) {
        emits('navigate', newUrl);
    }
</script>

<template>
    <page-content
        v-if="html"
        :html="html"
        :stylesheets="stylesheets"
        @navigate="navigateTo"
    />
    <div v-else class="flex flex-col gap-8 items-center p-8">
        <div class="text-error text-2xl">{{ errorMessage }}</div>
    </div>
</template>