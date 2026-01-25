<script setup lang="ts">
    import { ColorGroup, ColorVar, Theme } from "shared/models";
    import { PaintBucket } from "lucide-vue-next";

    const {theme} = defineProps<{
        theme: Theme
    }>();

    const variableValues = defineModel<{ [key: string]: string }>({
        required: true
    });

    function groupStyle(group: ColorGroup) {
        return {
            gridColumn: `span ${group.items.length} / span ${group.items.length}`
        };
    }

    function groupInnerStyle(group: ColorGroup) {
        return {
            gridTemplateColumns: `repeat(${group.items.length}, minmax(0, 1fr))`
        };
    }

    function colorText(color: ColorVar): string {
        if(color.isContent) {
            return 'A';
        }

        return color.label ?? '';
    }

    function getColorCellStyle(group: ColorGroup, color: ColorVar) {
        const bgKey = color.isContent ? group.items.find(c => !c.isContent)?.key : color.key;
        const fgKey = group.items.find(c => c.isContent)?.key;

        return {
            backgroundColor: bgKey ? variableValues.value[bgKey] : undefined,
            color: fgKey ? variableValues.value[fgKey] : undefined,
            fontSize: color.isContent ? '18px' : '12px'
        }
    }
</script>

<template>
    <div>
        <div>
            <h3 class="flex items-center gap-2 mb-6">
                <paint-bucket :size="16"/>
                <span class="text-sm">Change colors</span>
                <span class="border-b grow ms-2"/>
            </h3>
            <div class="grid grid-cols-4 gap-4">
                <div v-for="group in theme.colors" class="grid" :style="groupStyle(group)">
                    <div class="grid gap-4" :style="groupInnerStyle(group)">
                        <label
                            v-for="color in group.items"
                            class="h-10 grow rounded-lg border border-neutral-content/30 font-bold flex justify-center items-center relative"
                            :style="getColorCellStyle(group, color)"
                        >
                            <span>{{colorText(color)}}</span>
                            <input
                                type="color"
                                class="invisible absolute left-full top-0"
                                v-model="variableValues[color.key]"
                            />
                        </label>
                    </div>
                    <span class="text-xs ms-0.5 text-neutral-content">{{ group.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>