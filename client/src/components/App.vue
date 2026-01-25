<script setup lang="ts">
    import AppFooter from "@/components/AppFooter.vue";
    import AppHeader from "@/components/AppHeader.vue";
    import LoadingIndicator from "@/components/LoadingIndicator.vue";
    import ErrorBoundary from "@/components/ErrorBoundary.vue";
    import ErrorPanel from "@/components/ErrorPanel.vue";
</script>

<template>
    <main class="flex flex-col h-full">
        <app-header/>
        <div class="grow relative overflow-auto">
            <router-view v-slot="{Component, route}">
                <error-boundary :key="route.fullPath">
                    <template v-if="Component">
                        <transition mode="out-in" name="fade">
                            <suspense timeout="0">
                                <component :is="Component"/>
                                <template #fallback>
                                    <loading-indicator/>
                                </template>
                            </suspense>
                        </transition>
                    </template>
                    <template #error="{error, clearError}">
                        <error-panel :error="error" :clear-error="clearError"/>
                    </template>
                </error-boundary>
            </router-view>
        </div>
        <app-footer/>
    </main>
</template>