<template>

    <div class="index">
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu
                    style="height: 100%"
                    :default-active="$route.path"
                    router
                    class="el-menu-vertical-demo"
                    overflow-y: scroll
                >
                    <el-menu-item index="/dashboard">
                        <i class="fa fa-home"></i>
                        <span slot="title">
                                主页
                        </span>
                    </el-menu-item>
                    <el-menu-item index="/history">
                        <i class="fa fa-history"></i>
                        <span slot="title">
                                历史调试信息
                        </span>
                    </el-menu-item>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">调试</span>
                        </template>
                        <el-menu-item index="/debug/online">
                            <i class="fa fa-code"></i>
                            <span slot="title">
                                在线调试
                            </span>
                        </el-menu-item>
                        <el-menu-item index="/debug/offline">
                            <i class="fa fa-bug"></i>
                            <span slot="title">
                                离线调试
                            </span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>

            <el-container>
                <el-header style="text-align: right;border-bottom: #B3C0D1 1px solid">
                    <el-dropdown>
                        <div class="header-user">
                            <el-avatar> {{ avatar }}</el-avatar>
                            <div style="font-size: 18px;margin-left: 10px">
                                {{ loginUsername }}
                            </div>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </el-header>
                <el-main style="padding: 0;margin: 0">
                    <router-view :key="key" style="height: 100%"/>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Home",
    methods: {
        logout() {
            this.$message.success("注销成功！")

            window.localStorage.removeItem('token')
            this.$router.push('/login')
        }
    },
    mounted() {

    },
    computed: {
        key() {
            return this.$route.path + Date.now()
        },
        loginUsername: function () {
            return localStorage.getItem('token')
        },
        avatar: function () {

            return localStorage.getItem('token')[0].toUpperCase()
        },
    }

}
</script>

<style>
.el-header {
    background-color: #ffffff;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.index {
    padding: 0px;
    margin: 0px;
    height: 100%;
}

.el-container {
    height: 100%;
}

.header-user {
    padding: 0 10px;
    cursor: pointer;
    height: 58px;
    line-height: 58px;
    transition: all 500ms;
    display: flex;
    align-items: center;
}

.header-user:hover {
    background-color: #f9f9f9;

}

</style>