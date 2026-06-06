<script setup lang="ts">
    import AsyncBoundary from "@/components/ui/AsyncBoundary.vue";

    defineProps<{
        component: string | object
        routeKey: string
    }>();
</script>

<template>
    <async-boundary :transition-key="routeKey">
        <component :is="component"/>
    </async-boundary>
</template>