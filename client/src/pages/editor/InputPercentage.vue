<script setup lang="ts">
    import {Plus, Minus} from "@lucide/vue";

    const model = defineModel<number>({
        required: true
    });

    const {min = 0, max = 1, step = 0.05} = defineProps<{
        min?: number
        max?: number
        step?: number
    }>();

    function onWheel(event: WheelEvent) {
        stepValue(event.deltaY > 0 ? -1 : 1);
    }

    function stepValue(sign: number) {
        const value = model.value + sign * step;

        model.value = Math.min(Math.max(value, min), max);
    }
</script>

<template>
    <span class="flex items-center">
        <minus @click="stepValue(-1)" class="btn btn-square btn-sm border-2 border-base-content/30"/>
        <span @wheel="onWheel" class="px-3 py-0.5 w-16 text-center font-mono">
            {{Math.round(model * 100)}}%
        </span>
        <plus @click="stepValue(1)" class="btn btn-square btn-sm border-2 border-base-content/30"/>
    </span>
</template>