<script setup lang="ts">
    import { format } from "date-fns";

    const appVersion = __APP_VERSION__;
    const buildDate = format(__BUILD_DATE__, "yyyy-MM-dd");
</script>

<template>
    <footer class="px-4 py-1 font-mono bg-base-100">
        <div class="flex items-center gap-x-8 text-xs flex-wrap">
            <span class="text-primary me-auto">
                v-{{appVersion}}, build-{{ buildDate }}
            </span>
            <span class="text-primary">
                <a href="https://github.com/treachxry/ao3-theme-generator" target="_blank" class="link link-primary">Source code</a>
            </span>
            <span class="text-primary">
                Made by <a href="https://github.com/treachxry" target="_blank" class="link link-primary">treachxry</a>
            </span>
        </div>
    </footer>
</template>