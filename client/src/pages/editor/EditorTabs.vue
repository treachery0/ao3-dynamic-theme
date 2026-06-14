<script setup lang="ts">
    import {Component as VueComponent, onBeforeMount} from "vue";
    import {Blocks, Eye, Hammer, LucideSquareFunction} from "@lucide/vue";
    import {useStorageRef} from "@/composables/useStorageRef";
    import {EditorTab} from "@/models/EditorTab";
    import TabTemplates from "@/pages/editor/TabTemplates.vue";
    import TabResults from "@/pages/editor/TabResults.vue";
    import TabVariables from "@/pages/editor/TabVariables.vue";

    const currentTab = defineModel<VueComponent | undefined>({
        required: true
    });

    const tabIndex = useStorageRef<number>('sb-active-tab', () => 0);

    const tabs: EditorTab[] = [
        {
            label: 'Preview',
            icon: Eye,
            component: undefined
        },
        {
            label: 'Variables',
            icon: LucideSquareFunction,
            component: TabVariables
        },
        {
            label: 'Templates',
            icon: Blocks,
            component: TabTemplates
        },
        {
            label: 'Results',
            icon: Hammer,
            component: TabResults
        }
    ];

    onBeforeMount(() => {
        setTab(tabIndex.value);
    });

    function setTab(index: number): void {
        tabIndex.value = index;
        currentTab.value = tabs[index]?.component;
    }
</script>

<template>
    <div class="flex">
        <button
            v-for="(tab, i) in tabs"
            :key="i"
            :class="[{'btn-primary': tabIndex === i}]"
            class="btn h-auto p-1.5 border-0 bg-base flex-col md:flex-row grow gap-0.5 md:gap-1.5"
            @click="setTab(i)"
        >
            <component v-if="tab.icon" :is="tab.icon"/>
            <span>{{tab.label}}</span>
        </button>
    </div>
</template>