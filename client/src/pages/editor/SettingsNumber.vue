<script setup lang="ts">
    import { NumberVariable } from "common/models";
    import { useSchemaStore } from "@/stores/useSchemaStore";

    const {value} = defineProps<{
        value: NumberVariable
    }>();

    const {variables} = useSchemaStore();
</script>

<template>
    <div class="text-xs">
        <div class="flex justify-between mb-1 px-0.5">
            <span>{{ value.description }}</span>
            <span>{{ variables[value.key] }}{{ value.unit }}</span>
        </div>
        <input
            type="range"
            class="range range-xs"
            :min="value.min"
            :max="value.max"
            :step="value.step"
            v-model="variables[value.key]"
        />
    </div>
</template>