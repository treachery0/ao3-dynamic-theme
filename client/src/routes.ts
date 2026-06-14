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
        path: '/:pathName(.*)',
        component: () => import("@/components/layout/NotFound.vue")
    }
];

export const router = createRouter({
    history: createWebHashHistory(__URL_BASE__),
    routes: routes
});