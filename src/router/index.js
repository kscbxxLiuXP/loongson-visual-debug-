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
import OnlineDebugEntrance from "@/views/Debug/OnlineDebugEntrance";
import TraceManage from "@/views/Trace/TraceManage";
import DataAnalysis from "@/views/DataAnalysis/DataAnalysis";
import DataAnalysisList from "@/views/DataAnalysis/DataAnalysisList";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: "/",
            name: 'main',
            redirect: '/login',
            meta:{
                title:"登录"
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta:{
                title:"登录"
            }
        },
        {
            path: '/search',
            name: 'search',
            component: SearchScroll,
            meta:{
                title:"搜索"
            }
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
                    meta:{
                        title:"主页"
                    }
                },
                {
                    path: '/history',
                    name: 'Upload',
                    component: History,
                    meta:{
                        title:"日志管理"
                    }
                },
                {
                    path: '/debug/online',
                    name: 'OnlineDebugEntrance',
                    component: OnlineDebugEntrance,
                    meta:{
                        title:"在线调试"
                    }
                },
                {
                    path: '/debug/online/:id',
                    name: 'OnlineDebug',
                    component: OnlineDebug,
                    props: true,
                    meta:{
                        title:"在线调试"
                    }
                }, {
                    path: '/dataAnalysis',
                    name: 'DataAnalysisList',
                    component: DataAnalysisList,
                    meta:{
                        title:"日志数据分析"
                    }
                },
                {
                    path: '/dataAnalysis/:id',
                    name: 'DataAnalysis',
                    component: DataAnalysis,
                    props: true,
                    meta:{
                        title:"日志数据分析"
                    }
                },
                {
                    path: '/debug/offline',
                    name: 'OfflineDebug',
                    component: OfflineDebug,
                    meta:{
                        title:"离线调试"
                    }
                },

                {
                    path: '/antv',
                    name: 'AntvTest',
                    component: AntvTest,
                    meta:{
                        title:"Antv"
                    }
                },
                {
                    path: '/debug/:id',
                    component: Debug,
                    meta:{
                        title:"离线调试"
                    },
                    props: true,

                },
                {
                    path: '/trace',
                    name: 'TraceManage',
                    component: TraceManage,
                    meta:{
                        title:"在线调试管理"
                    }
                },

            ]
        },
    ]
})


//路由拦截
router.beforeEach((to, from, next) => {
    const token = window.localStorage.getItem("token")
    document.title = to.meta.title+"-调试系统"
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