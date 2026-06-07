<script lang="ts" setup>
    import {computed, onBeforeUnmount, onMounted, ref} from "vue";

    const mediaQuery = window.matchMedia("(max-width: 55rem)");
    const open = ref<boolean>(false);
    const buttonText = computed(() => open.value ? 'Close menu' : 'Menu');

    onMounted(() => {
        mediaQuery.addEventListener('change', closeSidebar);
    });

    onBeforeUnmount(() => {
        mediaQuery.removeEventListener('change', closeSidebar);
    });

    function closeSidebar() {
        open.value = false;
    }
</script>

<template>
    <button :class="{'open': open}" class="sidebar-button" @click="open = !open">
        {{buttonText}}
    </button>

    <aside :class="{'open': open}" class="sidebar-wrapper">
        <div class="sidebar">
            <slot/>
        </div>
    </aside>
</template>

<style scoped>
    @import "@/assets/style.css";

    .sidebar-wrapper {
        @apply z-10 inset-0 left-auto w-64 max-w-full transition-transform border-base-content/30 border-2 overflow-y-auto;

        @apply bg-base-100 md:bg-transparent;
        @apply border-2 md:border-0;
        @apply absolute md:relative;

        &:not(.open) {
            @apply translate-x-full md:translate-0;
        }
    }

    .sidebar {
        @apply p-2.5 md:p-0;
    }

    .sidebar-button {
        @apply z-20 absolute md:hidden bottom-full mb-2.5 right-0;
        @apply w-32 btn btn-outline btn-primary py-4.5 transition-[width] text-nowrap shadow-none;

        &.open {
            @apply w-64;
        }

        &:not(:hover) {
            @apply bg-base-100;
        }
    }
</style>