<script setup lang="ts">
    import { ColorGroup, ColorVariable } from "common/models";
    import { useSchemaStore } from "@/stores/useSchemaStore";

    const {group} = defineProps<{
        group: ColorGroup
    }>();

    const {variables} = useSchemaStore();

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

    function getColorCellStyle(group: ColorGroup, color: ColorVariable) {
        const bgKey = color.foreground ? group.items.find(c => !c.foreground)?.key : color.key;
        const fgKey = group.items.find(c => c.foreground)?.key;

        return {
            backgroundColor: bgKey ? variables.value[bgKey] : undefined,
            color: fgKey ? variables.value[fgKey] : undefined,
            fontSize: color.foreground ? '18px' : '12px'
        }
    }

    function colorText(color: ColorVariable): string {
        if(color.foreground) {
            return 'A';
        }

        return color.label ?? '';
    }
</script>

<template>
    <div class="grid" :style="groupStyle(group)">
        <div class="grid gap-2" :style="groupInnerStyle(group)">
            <label
                v-for="color in group.items"
                class="h-10 grow font-bold flex justify-center items-center relative overflow-hidden border border-base-content"
                :style="getColorCellStyle(group, color)"
            >
                <span>{{ colorText(color) }}</span>
                <input
                    type="color"
                    class="invisible absolute left-full top-0"
                    v-model="variables[color.key]"
                />
            </label>
        </div>
        <div class="text-xs ms-0.5 text-neutral-content/80">
            {{ group.name }}
        </div>
    </div>
</template>