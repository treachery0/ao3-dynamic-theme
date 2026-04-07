<script setup lang="ts">
    import { ref } from "vue";

    const isOpen = ref<boolean>(false);

    function toggleMenu() {
        isOpen.value = !isOpen.value;
    }

    function closeMenu(event: FocusEvent) {
        if(event.currentTarget instanceof Node && event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
            return;
        }

        isOpen.value = false;
    }
</script>

<template>
    <div tabindex="0" class="relative z-10" @blur="closeMenu">
        <div class="btn btn-ghost p-1" @click="toggleMenu">
            <slot name="icon"/>
        </div>

        <div v-if="isOpen" class="absolute top-full right-0 border border-base-content/30 rounded bg-base-100">
            <slot/>
        </div>
    </div>
</template>