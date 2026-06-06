<script setup lang="ts">
    import ErrorBoundary from "@/components/ui/ErrorBoundary.vue";
    import ErrorPanel from "@/components/ui/ErrorPanel.vue";
    import LoadingPanel from "@/components/ui/LoadingPanel.vue";

    defineProps<{
        transitionKey: string
    }>();
</script>

<template>
    <transition mode="out-in" name="fade">
        <div :key="transitionKey">
            <error-boundary>
                <suspense timeout="0">
                    <slot/>
                    <template #fallback>
                        <loading-panel/>
                    </template>
                </suspense>
                <template #error="{error, clearError}">
                    <error-panel :error="error" :clear-error="clearError"/>
                </template>
            </error-boundary>
        </div>
    </transition>
</template>