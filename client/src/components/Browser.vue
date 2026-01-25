<script setup lang="ts">
    import { House } from "lucide-vue-next";
    import { useReactiveStorage } from "@/composables/UseReactiveStorage.ts";
    import PageBody from "@/components/PageBody.vue";
    import LoadingIndicator from "@/components/LoadingIndicator.vue";
    import BrowserUrl from "@/components/BrowserUrl.vue";

    const {stylesheets, baseUrl} = defineProps<{
        stylesheets: string[]
        baseUrl: string
    }>();

    const url = useReactiveStorage<string>('tg-page-url', () => '/');

    function navigateTo(newUrl: string) {
        url.value = newUrl;
    }
</script>

<template>
    <div class="mockup-browser rounded-none relative">
        <div class="mockup-browser-toolbar">
            <div class="flex gap-2 mx-auto items-center">
                <button class="btn btn-ghost p-0 h-auto" @click="navigateTo('/')">
                    <house :size="18"/>
                </button>

                <browser-url
                    :origin="baseUrl"
                    v-model="url"
                    class="input outline-0 m-0 w-80"
                />
            </div>
        </div>

        <transition mode="out-in" name="fade">
            <suspense timeout="0">
                <page-body
                    :key="url"
                    :url="url"
                    :stylesheets="stylesheets"
                    @navigate="navigateTo"
                />
                <template #fallback>
                    <div class="my-8">
                        <loading-indicator/>
                    </div>
                </template>
            </suspense>
        </transition>
    </div>
</template>