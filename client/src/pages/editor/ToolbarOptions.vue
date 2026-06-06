<script setup lang="ts">
    import {Menu, ZoomIn} from "@lucide/vue";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import DropdownMenu from "@/components/ui/DropdownMenu.vue";
    import InputPercentage from "@/pages/editor/InputPercentage.vue";

    const options = defineModel<BrowserOptions>({
        required: true
    });
</script>

<template>
    <div class="flex items-center gap-1.5">
        <dropdown-menu>
            <template #icon>
                <Menu class="size-4.5"/>
            </template>
            <div class="grid text-sm w-80 px-4 py-2 gap-2">
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
            </div>
        </dropdown-menu>
    </div>
</template>