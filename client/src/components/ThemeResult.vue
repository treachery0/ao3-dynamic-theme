<script setup lang="ts">
    import { StyleSheetAsset } from "shared/models";
    import ThemeResultFragment from "@/components/ThemeResultFragment.vue";

    const {stylesheets} = defineProps<{
        stylesheets: StyleSheetAsset[]
    }>();
</script>

<template>
    <div>
        <div class="text-lg mb-2 underline">Generated site skin</div>
        <div class="grid grid-cols-1 gap-4">
            <theme-result-fragment
                v-for="stylesheet in stylesheets"
                :stylesheet="stylesheet"
            />
        </div>
    </div>
</template>