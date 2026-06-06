<script setup lang="ts">
    import {computed, useTemplateRef} from "vue";
    import {House} from "@lucide/vue";
    import {getHostUrl} from "common/functions";
    import {IHistory} from "@/composables/useHistory";

    const {history} = defineProps<{
        history: IHistory
    }>();

    const inputElement = useTemplateRef('url-input');

    const displayUrl = computed<string>(() => {
        return getHostUrl() + history.location.value;
    });

    function onKeyDown(e: KeyboardEvent): void {
        if(e.key === 'Enter') {
            inputElement.value?.blur();
        }
    }

    function onFocusOut() {
        if(!inputElement.value) {
            return;
        }

        try {
            const url = new URL(inputElement.value.value);
            const path = url.pathname + url.search + url.hash;

            history.push(path);
        }
        catch {
            inputElement.value.value = displayUrl.value;
        }
    }
</script>

<template>
    <div class="flex items-center justify-center gap-1.5 grow">
        <house
            class="btn btn-ghost p-1.25"
            title="Go to home page"
            @click="history.push('/')"
        />

        <input
            type="text"
            class="input input-sm bg-base-200 outline-0"
            ref="url-input"
            :value="displayUrl"
            @focusout="onFocusOut"
            @keydown="onKeyDown"
        />
    </div>
</template>