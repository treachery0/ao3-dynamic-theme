<script setup lang="ts">
    import AppFooter from "@/components/AppFooter.vue";
    import AppHeader from "@/components/AppHeader.vue";
    import AppBody from "@/components/AppBody.vue";
</script>

<template>
    <main class="flex flex-col h-full">
        <app-header/>
        <div class="grow relative overflow-auto">
            <router-view v-slot="{Component, route}">
                <app-body
                    v-if="Component"
                    :component="Component"
                    :route-key="route.fullPath"
                />
            </router-view>
        </div>
        <app-footer/>
    </main>
</template>