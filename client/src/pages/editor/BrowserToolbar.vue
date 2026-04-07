<script setup lang="ts">
    import { computed, useTemplateRef } from "vue";
    import { House, ArrowLeft, ArrowRight, RotateCw, Menu, FileCode, ZoomIn } from "@lucide/vue";
    import { getHostUrl } from "common/functions";
    import { useSkinStore } from "@/stores/useSkinStore";
    import { IHistory } from "@/composables/useHistory";
    import { BrowserOptions } from "@/models/BrowserOptions";
    import DropdownMenu from "@/components/ui/DropdownMenu.vue";
    import SkinResult from "@/pages/editor/SkinResult.vue";
    import InputPercentage from "@/pages/editor/InputPercentage.vue";

    const {skins, removeSkin} = useSkinStore();

    const {history} = defineProps<{
        history: IHistory
    }>();

    const options = defineModel<BrowserOptions>({
        required: true
    });

    const inputElement = useTemplateRef('url-input');

    const displayUrl = computed<string>(() => {
        return getHostUrl() + history.location.value;
    });

    function onKeyDown(e: KeyboardEvent): void {
        if(e.key === 'Enter') {
            inputElement.value?.blur();
        }
    }

    function onFocusOut() {
        if(!inputElement.value) {
            return;
        }

        try {
            const url = new URL(inputElement.value.value);
            const path = url.pathname + url.search + url.hash;

            history.push(path);
        }
        catch {
            inputElement.value.value = displayUrl.value;
        }
    }

    function screenshotPage() {
        alert('Not implemented')
    }
</script>

<template>
    <div class="flex gap-4 items-center justify-between px-2 relative">
        <!-- left side -->
        <div class="flex items-center gap-2">
            <arrow-left
                class="btn btn-ghost p-1"
                :class="{'btn-disabled': !history.canBack.value}"
                title="Go back one page"
                @click="history.back()"
            />

            <arrow-right
                class="btn btn-ghost p-1"
                :class="{'btn-disabled': !history.canForward.value}"
                title="Go forward one page"
                @click="history.forward()"
            />

            <rotate-cw
                class="btn btn-ghost p-1"
                title="Reload current page"
                @click="history.reload()"
            />
        </div>

        <!-- url bar -->
        <div class="flex items-center gap-2">
            <house
                class="btn btn-ghost p-1"
                title="Go to home page"
                @click="history.push('/')"
            />

            <input
                type="text"
                class="input input-sm bg-base-200 outline-0 w-80"
                ref="url-input"
                :value="displayUrl"
                @focusout="onFocusOut"
                @keydown="onKeyDown"
            />
        </div>

        <!-- right side -->
        <div class="flex items-center gap-2">
            <dropdown-menu>
                <template #icon>
                    <FileCode class="size-5"/>
                </template>
                <div class="grid text-sm overflow-y-auto w-80 max-h-120 p-1">
                    <template v-if="skins.length">
                        <skin-result
                            v-for="(skin, i) in skins"
                            :skin="skin"
                            @clear="removeSkin(i)"
                        />
                    </template>
                    <div v-else class="text-nowrap px-2 py-1">
                        Generated skins will show up here.
                    </div>
                </div>
            </dropdown-menu>

            <dropdown-menu>
                <template #icon>
                    <Menu class="size-5"/>
                </template>
                <div class="grid text-sm w-80 px-4 py-1 gap-2">
                    <div class="flex items-center gap-2">
                        <zoom-in/>
                        <span>Zoom</span>
                        <input-percentage
                            class="ms-auto"
                            v-model="options.zoom"
                            :min="0.3"
                            :max="3"
                            :step="0.1"
                        />
                    </div>

                    <button class="btn justify-start" @click="screenshotPage">
                        Save page as image...
                    </button>
                </div>
            </dropdown-menu>
        </div>
    </div>
</template>