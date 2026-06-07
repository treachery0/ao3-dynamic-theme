<script setup lang="ts">
    import { computed } from "vue";
    import JSZip from "jszip";
    import { FolderDown, Trash2 } from "@lucide/vue";
    import { downloadFile, getFileSizeWithUnit } from "@/functions/file-utils";
    import { GeneratedSkin } from "@/models/GeneratedSkin";

    const {skin} = defineProps<{
        skin: GeneratedSkin
    }>();

    const emits = defineEmits<{
        (e: 'delete'): void
    }>();

    const totalSize = computed<string>(() => {
        const totalBytes = skin.chunks.reduce((sum, sheet) => sum + sheet.content.length, 0);
        const {size, unit} = getFileSizeWithUnit(totalBytes);

        return `${size.toFixed(0)} ${unit}`;
    })

    async function downloadTheme(): Promise<void> {
        const zip = new JSZip();

        for(const stylesheet of skin.chunks) {
            zip.file(stylesheet.filename, stylesheet.content);
        }

        const blob = await zip.generateAsync({type: 'blob'});

        downloadFile(blob, `${skin.name}.zip`);
    }

    function deleteTheme(): void {
        emits('delete');
    }
</script>

<template>
    <div class="p-1.5 border-2 border-base-content/30 bg-base-100">
        <div class="shrink min-w-0 truncate font-medium text-xs mb-1" :title="skin.name">
            {{ skin.name }}
        </div>

        <div class="flex items-center gap-1.5">
            <div class="text-xs me-auto">
                {{ totalSize }}
            </div>
            <button class="btn btn-success py-0.5 h-auto" @click.stop="downloadTheme">
                <folder-down/>
            </button>
            <button class="btn btn-error py-0.5 h-auto" @click.stop="deleteTheme">
                <trash2/>
            </button>
        </div>
    </div>
</template>