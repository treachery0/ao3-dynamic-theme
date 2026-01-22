<script setup lang="ts">
    import { CssVariableInfo } from "shared/models";

    const {variables} = defineProps<{
        variables: CssVariableInfo[]
    }>();

    const variableValues = defineModel<string[]>({
        required: true
    });
</script>

<template>
    <div class="grid grid-cols-2 gap-x-4 gap-y-1">
        <fieldset v-for="(v, i) in variables" class="fieldset">
            <legend class="fieldset-legend">{{ v.description }}</legend>
            <span class="flex items-center">
                <template v-if="v.type === 'color'">
                    <span class="rounded -mt-1.5 w-full overflow-clip h-6 border">
                        <input
                            type="color"
                            v-model="variableValues[i]"
                            class="w-[calc(100%+1rem)] -m-2 h-10"
                        />
                    </span>
                </template>
                <template v-else>
                    <input
                        :type="v.type"
                        v-model="variableValues[i]"
                        class="input input-xs -mt-1.5"
                    />
                    <span v-if="v.unit" class="ps-1 w-10 -mt-1.5">{{ v.unit }}</span>
                </template>
            </span>
        </fieldset>
    </div>
</template>