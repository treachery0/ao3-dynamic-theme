<script setup lang="ts">
    import {Blocks} from "@lucide/vue";
    import {useTemplateStore} from "@/stores/useTemplateStore";

    const {template} = useTemplateStore();
</script>

<template>
    <div class="grid gap-8">
        <div>
            <h3 class="sidebar-divider">
                <blocks/>
                <span>Templates</span>
            </h3>
            <div class="border-2 border-base-content/30 p-2 flex items-center justify-between">
                <div>{{template.name}}</div>
                <div class="text-sm opacity-70">{{template.colors.length}} colors</div>
            </div>
        </div>
        <div class="opacity-60 text-sm">
            As of now, you cannot change this.
        </div>
    </div>
</template>