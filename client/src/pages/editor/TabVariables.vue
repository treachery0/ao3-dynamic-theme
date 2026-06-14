<script setup lang="ts">
    import {PaintBucket, RotateCcw, Ruler, SquareRoundCorner, Zap} from "@lucide/vue";
    import {useTemplateStore} from "@/stores/useTemplateStore";
    import SettingsColorGroup from "@/pages/editor/SettingsColorGroup.vue";
    import SettingsNumber from "@/pages/editor/SettingsNumber.vue";

    const {template, variables, getDefaultVariables} = useTemplateStore();

    function resetVariables(): void {
        variables.value = getDefaultVariables(template.value);
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
                    v-for="group in template.colors"
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
                    v-for="value in template.radius"
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
                    v-for="value in template.sizes"
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