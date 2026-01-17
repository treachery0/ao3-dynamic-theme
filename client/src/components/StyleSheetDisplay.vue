<script setup lang="ts">
    import { StyleSheetInfo, StyleSheetImportance } from "ao3-tg-shared";

    const {stylesheet} = defineProps<{
        stylesheet: StyleSheetInfo
    }>();

    function getImportanceClass(importance: StyleSheetImportance): string {
        if(importance === 'required'){
            return 'badge-error';
        }

        if(importance === 'recommended'){
            return 'badge-warning';
        }

        return 'opacity-50';
    }

    async function copyContents() {
        await navigator.clipboard.writeText(stylesheet.contents);
    }
</script>

<template>
    <div>
        <div class="flex items-center px-1 gap-1 font-bold">
            <span class="me-auto text-sm">{{ stylesheet.name }}</span>
            <div class="badge badge-xs badge-outline" :class="getImportanceClass(stylesheet.importance)">{{stylesheet.importance}}</div>
            <div class="badge badge-info badge-xs badge-outline ">@media {{stylesheet.media}}</div>
            <div class="badge badge-info badge-xs badge-outline">{{(stylesheet.contents.length / 1024).toFixed(1)}} KB</div>
        </div>
        <div class="text-xs relative">
            <div class="max-h-40 border rounded opacity-70 overflow-auto p-1">{{ stylesheet.contents }}</div>
            <button class="absolute top-2 right-3 btn btn-sm btn-primary" @click="copyContents">Copy</button>
        </div>
    </div>
</template>

<style scoped>
    .info-card {

    }
</style>