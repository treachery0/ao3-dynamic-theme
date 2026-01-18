<script setup lang="ts">
    import { computed, useTemplateRef } from "vue";

    const {base = ''} = defineProps<{
        base?: string
    }>();

    const url = defineModel<string>({
        required: true
    });

    const urlElement = useTemplateRef('url-input');

    const displayUrl = computed(() => {
        if(!base.length) {
            return url.value;
        }

        return new URL(url.value, base).href;
    })

    function onKeyDown(e: KeyboardEvent) {
        if(e.key === 'Enter') {
            updateUrl();
        }
    }

    function updateUrl() {
        const value = urlElement.value?.value;

        if(!value) {
            return;
        }

        const newUrl = new URL(value);

        if(newUrl.pathname === url.value) {
            if (newUrl.origin !== base && urlElement.value) {
                urlElement.value.value = displayUrl.value;
            }

            return;
        }

        url.value = newUrl.pathname;
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