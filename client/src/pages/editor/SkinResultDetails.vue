<script setup lang="ts">
    import { X } from "@lucide/vue";
    import { GeneratedSkin } from "@/models/GeneratedSkin";
    import SkinResultChunk from "@/pages/editor/SkinResultChunk.vue";

    const {skin, close} = defineProps<{
        skin: GeneratedSkin
        close: () => void
    }>();
</script>

<template>
    <div class="absolute z-50 inset-0 bg-base-300/90 flex items-center justify-center" @click="close">
        <div class="w-full m-8 p-4 border bg-base-100 rounded-lg" @click.stop>
            <div class="flex items-center gap-4">
                <div class="me-auto underline">{{ skin.name }}</div>
                <button class="btn btn-success">Load skin</button>
                <button class="btn btn-error btn-ghost btn-square" @click="close">
                    <x class="size-6"/>
                </button>
            </div>

            <div>
                <div class="underline">Stylesheets</div>
                <div class="grid px-1.5 py-3">
                    <skin-result-chunk
                        v-for="(stylesheet, i) in skin.chunks"
                        :stylesheet="stylesheet"
                        :class="{'mt-2.5 pt-1.5 border-t border-base-content/50': i !== 0}"
                    />
                </div>
            </div>
        </div>
    </div>
</template>