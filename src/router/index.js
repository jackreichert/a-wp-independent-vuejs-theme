import {createRouter, createWebHistory} from 'vue-router'

import Index from "../components/routes/Index.vue";

export const routes = [
    {path: "/", component: Index, props: {text: "Blogroll"}},
    {path: "/page/:pageNum?", component: Index, props: {text: "Blogroll"}},
    {path: "/:year(\\d+)/:month(\\d+)/:day(\\d+)?/:slug", component: Index, props: {text: "Single"}},
    {path: "/category/:category", component: Index, props: {text: "Categories"}},
    {path: "/category/:category/page/:pageNum", component: Index, props: {text: "Categories"}},
    {path: "/tag/:tag", component: Index, props: {text: "Tags"}},
    {path: "/tag/:tag/page/:pageNum", component: Index, props: {text: "Tags"}},
    {path: "/:slug", component: Index, props: {text: "Page"}},
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
})

export const menus = {
    primary: [
        {title: "Home", path: "/"},
        {title: "About Jack", path: "/about-jack"},
        {title: "What Others Are Saying", path: "/what-others-are-saying"},
        {title: "Contact Jack", path: "/contact"}
    ]
}

