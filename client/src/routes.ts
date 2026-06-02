import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import("@/pages/home/Home.vue")
    },
    {
        path: '/editor',
        component: () => import("@/pages/editor/Editor.vue")
    },
    {
        path: '/skins',
        component: () => import("@/pages/skins/Skins.vue")
    },
    {
        path: '/:pathName(.*)',
        component: () => import("@/components/NotFound.vue")
    }
];

export const router = createRouter({
    history: createWebHashHistory(__URL_BASE__),
    routes: routes
})