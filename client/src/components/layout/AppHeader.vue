<template>
    <header class="flex items-center bg-base-100">
        <router-link to="/" class="btn btn-xl btn-ghost gap-4 text-lg text-primary">
            <img src="/icon.svg" alt="icon" class="size-7"/>
            <h1 class="hidden sm:block">AO3 skin builder</h1>
        </router-link>

        <nav class="flex items-center ms-auto">
            <router-link to="/" active-class="text-primary" class="btn btn-xl text-sm btn-ghost">Home</router-link>
            <router-link to="/editor" active-class="text-primary" class="btn btn-xl text-sm btn-ghost">Editor</router-link>
        </nav>
    </header>
</template>