<script setup lang="ts">
    import {IHistory} from "@/composables/useHistory";
    import {BrowserOptions} from "@/models/BrowserOptions";
    import ToolbarNavigation from "@/pages/editor/ToolbarNavigation.vue";
    import ToolbarAddress from "@/pages/editor/ToolbarAddress.vue";
    import ToolbarOptions from "@/pages/editor/ToolbarOptions.vue";

    const {history} = defineProps<{
        history: IHistory
    }>();

    const options = defineModel<BrowserOptions>({
        required: true
    });
</script>

<template>
    <div class="relative flex gap-x-4 gap-y-1 items-center px-2 py-1 flex-wrap @lg:flex-nowrap">
        <toolbar-navigation
            :history
            class="order-1"
        />

        <toolbar-address
            :history
            class="grow -order-1 @lg:order-2 w-full @lg:w-auto"
        />

        <toolbar-options
            v-model="options"
            class="order-3 ms-auto @lg:ms-0"
        />
    </div>
</template>