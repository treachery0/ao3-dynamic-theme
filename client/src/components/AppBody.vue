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
            <suspense timeout="0">
                <error-boundary>
                    <component :is="component"/>
                    <template #error="{error, clearError}">
                        <error-panel :error="error" :clear-error="clearError"/>
                    </template>
                </error-boundary>
                <template #fallback>
                    <loading-indicator/>
                </template>
            </suspense>
        </div>
    </transition>
</template>