<script setup lang="ts">
    import {IHistory} from "@/composables/useHistory";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import ToolbarNavigation from "@/pages/editor/ToolbarNavigation.vue";
    import ToolbarOptions from "@/pages/editor/ToolbarOptions.vue";
    import ToolbarAddress from "@/pages/editor/ToolbarAddress.vue";

    const {history} = defineProps<{
        history: IHistory
    }>();

    const options = defineModel<BrowserOptions>({
        required: true
    });
</script>

<template>
    <div class="flex gap-4 items-center px-2 relative">
        <toolbar-navigation :history/>
        <toolbar-address :history/>
        <toolbar-options v-model="options"/>
    </div>
</template>