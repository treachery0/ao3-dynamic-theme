<script setup lang="ts">
    import { computed, useTemplateRef } from "vue";

    const {origin} = defineProps<{
        origin: string
    }>();

    const pathname = defineModel<string>({
        required: true
    });

    const inputElement = useTemplateRef('url-input');

    const displayUrl = computed(() => {
        return new URL(pathname.value, origin).href;
    })

    function onKeyDown(e: KeyboardEvent): void {
        if(e.key === 'Enter') {
            inputElement.value?.blur();
        }
    }

    function updateUrl() {
        const value = inputElement.value?.value;

        if(!value) {
            return;
        }

        const newUrl = new URL(value);

        if(newUrl.pathname === pathname.value) {
            if (newUrl.origin !== origin && inputElement.value) {
                inputElement.value.value = displayUrl.value;
            }

            return;
        }

        pathname.value = newUrl.pathname;
    }
</script>

<template>
    <input
        ref="url-input"
        type="text"
        :value="displayUrl"
        @focusout="updateUrl"
        @keydown="onKeyDown"
    />
</template>