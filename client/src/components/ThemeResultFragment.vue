<script setup lang="ts">
    import { CssFileResult, CssFileImportance } from "ao3-tg-shared";
    import { downloadFile } from "@/functions/downloads.ts";
    import { Download, Copy } from "lucide-vue-next";

    const {stylesheet} = defineProps<{
        stylesheet: CssFileResult
    }>();

    function getImportanceClass(importance: CssFileImportance): string {
        if(importance === 'required') {
            return 'badge-error';
        }

        if(importance === 'recommended') {
            return 'badge-warning';
        }

        return 'opacity-60';
    }

    async function copyContents() {
        await navigator.clipboard.writeText(stylesheet.css);
    }

    function downloadContents() {
        downloadFile(stylesheet.css, stylesheet.filename);
    }
</script>

<template>
    <div class="">
        <div class="flex items-center px-0.5 gap-1 font-semibold">
            <div class="text-sm me-auto">{{ stylesheet.description }}</div>
            <div class="badge badge-xs badge-outline" :class="getImportanceClass(stylesheet.importance)">{{ stylesheet.importance }}</div>
            <div class="badge badge-info badge-xs badge-outline">{{ (stylesheet.css.length / 1024).toFixed(1) }} KB</div>
        </div>
        <div class="px-0.5">
            <div class="text-[11px] opacity-80">@media {{ stylesheet.media }}</div>
        </div>
        <div class="text-xs relative">
            <div class="max-h-24 border border-base-content/60 rounded overflow-auto p-1 bg-base-200 opacity-80">{{ stylesheet.css }}</div>
            <div class="absolute top-2 right-2 flex flex-col gap-1.5">
                <button class="btn btn-xs btn-primary" @click="copyContents">
                    <copy :size="16"/>
                </button>
                <button class="btn btn-xs btn-primary" @click="downloadContents">
                    <download :size="16"/>
                </button>
            </div>
        </div>
    </div>
</template>