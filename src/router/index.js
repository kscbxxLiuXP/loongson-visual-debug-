import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Login from "@/views/Login";
import History from "@/views/History/History";

import Dashboard from "@/views/Dashboard/Dashboard";
import OnlineDebug from "@/views/Debug/OnlineDebug";
import OfflineDebug from "@/views/Debug/OfflineDebug";
import {Message} from "element-ui";
import Debug from "@/views/Debug/Debug";
import SearchScroll from "@/views/SearchScroll";
import AntvTest from "@/components/Trace/AntvTest";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: "/",
            name: 'main',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/search',
            name: 'search',
            component: SearchScroll,
        },

        {
            path: '/home',
            name: 'home',
            redirect: '/dashboard',
            component: Home,
            children: [
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    component: Dashboard,
                },
                {
                    path: '/history',
                    name: 'Upload',
                    component: History,
                },
                {
                    path: '/debug/online',
                    name: 'OnlineDebug',
                    component: OnlineDebug,
                },
                {
                    path: '/debug/offline',
                    name: 'OfflineDebug',
                    component: OfflineDebug,
                },

                {
                    path: '/antv',
                    name: 'AntvTest',
                    component: AntvTest,
                },
                {
                    path: '/debug/:id',
                    component: Debug,
                    meta: 'debug',
                    props: true,
                },

            ]
        },
    ]
})


//路由拦截
router.beforeEach((to, from, next) => {
    const token = window.localStorage.getItem("token")
    if (to.path === '/login') {
        if (!token)
            return next();
        else {
            return next('/home')
        }
    }
    if (!token) {
        Message.error("请先登录")
        return next('/login')
    }
    next()
})
export default router;