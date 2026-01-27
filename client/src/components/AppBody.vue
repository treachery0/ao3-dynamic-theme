<script setup lang="ts">
    import ErrorBoundary from "@/components/ErrorBoundary.vue";
    import ErrorPanel from "@/components/ErrorPanel.vue";
    import LoadingIndicator from "@/components/LoadingIndicator.vue";

    defineProps<{
        component: any
        routeKey: string
    }>();
</script>

<template>
    <transition mode="out-in" name="fade" appear>
        <div class="h-full" :key="routeKey">
            <error-boundary>
                <suspense timeout="0">
                    <component :is="component"/>
                    <template #fallback>
                        <loading-indicator/>
                    </template>
                </suspense>
                <template #error="{error, clearError}">
                    <error-panel :error="error" :clear-error="clearError"/>
                </template>
            </error-boundary>
        </div>
    </transition>
</template>