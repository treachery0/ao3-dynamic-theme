<script setup lang="ts">
    import { PaintBucket, SquareRoundCorner, Ruler, RotateCcw, Zap, Flame } from "@lucide/vue";
    import { fetchSkin } from "@/functions/api";
    import { SkinChunk } from "common/models";
    import { useSkinStore } from "@/stores/useSkinStore";
    import { useSchemaStore } from "@/stores/useSchemaStore";
    import SettingsColorGroup from "@/pages/editor/SettingsColorGroup.vue";
    import SettingsNumber from "@/pages/editor/SettingsNumber.vue";

    const {schema, variables, getDefaultVariables} = useSchemaStore();
    const {createSkin} = useSkinStore();

    function resetVariables(): void {
        variables.value = getDefaultVariables();
    }

    async function newSkin() {
        try {
            const entries = Object.entries(variables.value);
            const response = await fetchSkin(entries);

            if(!response.ok) {
                console.error(response.statusText);
                return;
            }

            const chunks: SkinChunk[] = await response.json();

            createSkin(`unnamed-skin-${new Date()}`, chunks);
        }
        catch(err) {
            console.error(err);
        }
    }
</script>

<template>
    <div class="grid gap-8">
        <div>
            <h3 class="sidebar-divider">
                <zap/>
                <span>Actions</span>
            </h3>
            <div class="grid gap-2">
                <button class="btn text-xs btn-success justify-between" @click="newSkin">
                    <span>Create skin</span>
                    <flame/>
                </button>
                <button class="btn text-xs btn-error btn-outline justify-between" @click="resetVariables">
                    <span>Reset all variables</span>
                    <rotate-ccw/>
                </button>
            </div>
        </div>

        <div>
            <h3 class="sidebar-divider">
                <paint-bucket/>
                <span>Change colors</span>
            </h3>
            <div class="grid grid-cols-4 gap-4 text-neutral-content/80">
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
    </div>
</template>

<style scoped>
    @import "tailwindcss";

    @layer components {
        .sidebar-divider {
            @apply flex items-center gap-2 mb-6 text-sm;

            &::after {
                @apply content-[""] border-b grow;
            }
        }
    }
</style>