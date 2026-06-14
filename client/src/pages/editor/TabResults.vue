<script setup lang="ts">
    import {Flame, Zap, Box, Trash2} from "@lucide/vue";
    import {fetchSkin} from "@/functions/api";
    import {format} from "date-fns";
    import {useStorageRef} from "@/composables/useStorageRef";
    import {useTemplateStore} from "@/stores/useTemplateStore";
    import {SkinChunk} from "common/models/SkinChunk";
    import {TaskStatus} from "common/models/TaskStatus";
    import {GeneratedSkin} from "@/models/GeneratedSkin";
    import SkinResult from "@/pages/editor/SkinResult.vue";

    const {variables} = useTemplateStore();

    const skins = useStorageRef<GeneratedSkin[]>('sb-editor-skins', () => []);

    function deleteSkin(index: number): void {
        skins.value.splice(index, 1);
    }

    function clearSkins(): void {
        skins.value = [];
    }

    async function createSkin() {
        try {
            const entries = Object.entries(variables.value);
            const response = await fetchSkin(entries);

            if(!response.ok) {
                console.error(response.statusText);
                return;
            }

            const chunks: SkinChunk[] = await response.json();

            const skin: GeneratedSkin = {
                name: `skin-${format(Date.now(), 'yyMMdd-HHmmss')}`,
                timestamp: Date.now(),
                status: TaskStatus.Completed,
                chunks: chunks
            };

            skins.value.push(skin);
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
                <button class="btn text-xs btn-success btn-outline justify-between" @click="createSkin">
                    <span>Create skin</span>
                    <flame/>
                </button>
                <button class="btn text-xs btn-error btn-outline justify-between" @click="clearSkins">
                    <span>Delete all skins</span>
                    <trash-2/>
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
                        @delete="deleteSkin(i)"
                    />
                </template>

                <div v-else class="opacity-60 text-sm text-center">
                    Your skins will show up here
                </div>
            </div>
        </div>
    </div>
</template>