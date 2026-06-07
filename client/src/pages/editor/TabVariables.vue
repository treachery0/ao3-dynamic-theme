<script setup lang="ts">
    import {PaintBucket, RotateCcw, Ruler, SquareRoundCorner, Zap} from "@lucide/vue";
    import {useSchemaStore} from "@/stores/useSchemaStore";
    import SettingsColorGroup from "@/pages/editor/SettingsColorGroup.vue";
    import SettingsNumber from "@/pages/editor/SettingsNumber.vue";

    const {schema, variables, getDefaultVariables} = useSchemaStore();

    function resetVariables(): void {
        variables.value = getDefaultVariables(schema.value);
    }
</script>

<template>
    <div class="grid gap-8">
        <div>
            <h3 class="sidebar-divider">
                <paint-bucket/>
                <span>Change colors</span>
            </h3>
            <div class="grid grid-cols-4 gap-2 text-neutral-content/80">
                <settings-color-group
                    v-for="group in schema.colors"
                    :group="group"
                />
            </div>
        </div>

        <div>
            <h3 class="sidebar-divider">
                <square-round-corner/>
                <span>Radius</span>
            </h3>
            <div class="grid gap-4 text-neutral-content/80">
                <settings-number
                    v-for="value in schema.radius"
                    :value="value"
                />
            </div>
        </div>

        <div>
            <h3 class="sidebar-divider">
                <ruler/>
                <span>Sizes</span>
            </h3>
            <div class="grid gap-4 text-neutral-content/80">
                <settings-number
                    v-for="value in schema.sizes"
                    :value="value"
                />
            </div>
        </div>

        <div>
            <h3 class="sidebar-divider">
                <zap/>
                <span>Actions</span>
            </h3>
            <div class="grid gap-2">
                <button class="btn text-xs btn-error btn-outline justify-between" @click="resetVariables">
                    <span>Reset all variables</span>
                    <rotate-ccw/>
                </button>
            </div>
        </div>
    </div>
</template>