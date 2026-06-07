<script setup lang="ts">
    import {ArrowLeft, ArrowRight, House, RotateCw} from "@lucide/vue";
    import {IHistory} from "@/composables/useHistory";

    const {history} = defineProps<{
        history: IHistory
    }>();
</script>

<template>
    <div class="flex items-center gap-1.5">
        <arrow-left
            class="btn btn-ghost p-1.25"
            :class="{'btn-disabled': !history.canBack.value}"
            title="Go back one page"
            @click="history.back()"
        />

        <arrow-right
            class="btn btn-ghost p-1.25"
            :class="{'btn-disabled': !history.canForward.value}"
            title="Go forward one page"
            @click="history.forward()"
        />

        <rotate-cw
            class="btn btn-ghost p-1.25"
            title="Reload current page"
            @click="history.reload()"
        />

        <house
            class="btn btn-ghost p-1.25"
            title="Go to home page"
            @click="history.push('/')"
        />
    </div>
</template>