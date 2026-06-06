<script setup lang="ts">
    import {Flame, Zap, Box} from "@lucide/vue";
    import {fetchSkin} from "@/functions/api";
    import {format} from "date-fns";
    import {useSkinStore} from "@/stores/useSkinStore";
    import {useSchemaStore} from "@/stores/useSchemaStore";
    import {SkinChunk} from "common/models";
    import SkinResult from "@/pages/editor/SkinResult.vue";

    const {skins, removeSkin, createSkin} = useSkinStore();
    const {variables} = useSchemaStore();

    async function newSkin() {
        try {
            const entries = Object.entries(variables.value);
            const response = await fetchSkin(entries);

            if(!response.ok) {
                console.error(response.statusText);
                return;
            }

            const chunks: SkinChunk[] = await response.json();

            createSkin(`skin-${format(Date.now(), 'yyMMdd-HHmmss')}`, chunks);
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
                <button class="btn text-xs btn-success btn-outline justify-between" @click="newSkin">
                    <span>Create skin</span>
                    <flame/>
                </button>
            </div>
        </div>

        <div>
            <h3 class="sidebar-divider">
                <box/>
                <span>Skins</span>
            </h3>
            <div class="grid gap-2">
                <template v-if="skins.length">
                    <skin-result
                        v-for="(skin, i) in skins"
                        :skin="skin"
                        @clear="removeSkin(i)"
                    />
                </template>

                <div v-else class="opacity-60 text-sm text-center">
                    Your skins will show up here
                </div>
            </div>
        </div>
    </div>
</template>