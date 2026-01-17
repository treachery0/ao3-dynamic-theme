<script setup lang="ts">
    import { StyleSheetInfo } from "ao3-tg-shared";
    import StyleSheetDisplay from "@/components/StyleSheetDisplay.vue";

    const {stylesheets} = defineProps<{
        stylesheets: StyleSheetInfo[]
    }>();
</script>

<template>
    <div>
        <div>Generated site skin</div>
        <div class="grid gap-6">
            <style-sheet-display
                v-for="stylesheet in stylesheets"
                :stylesheet="stylesheet"
            />
        </div>
    </div>
</template>