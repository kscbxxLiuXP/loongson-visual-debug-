<template>
    <div class="index">
        <el-container>
            <el-aside width="auto" style="background-color: rgb(238, 241, 246)">
                <el-menu
                    :collapse-transition="true"
                    :collapse="collapse"
                    style="height: 100%"
                    :default-active="$route.path"
                    router
                    class="el-menu-vertical-demo"
                    overflow-y: scroll
                >
                    <el-menu-item index="/dashboard">
                        <i class="faa fa fa-home" ></i>
                        <span slot="title" style="margin-left: 5px">主页</span>
                    </el-menu-item>
                    <el-menu-item index="/history">
                        <i class="faa fa fa-history" ></i>
                        <span slot="title" >
                                历史调试信息
                        </span>
                    </el-menu-item>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">调试</span>
                        </template>
                        <el-menu-item index="/debug/online">
                            <i class="faa fa fa-code" ></i>
                            <span slot="title" style="margin-left: 10px">
                                在线调试
                            </span>
                        </el-menu-item>
                        <el-menu-item index="/debug/offline">
                            <i class="faa fa fa-bug" ></i>
                            <span slot="title" style="margin-left: 10px">
                                离线调试
                            </span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>

            <el-container>
                <el-header style="display: flex;justify-content: space-between;border-bottom: #B3C0D1 1px solid">
                    <div @click="collapse=!collapse" class="collapse-icon">
                        <i class="el-icon-s-fold" v-if="!collapse"/>
                        <i class="el-icon-s-unfold" v-if="collapse"/>
                        <div v-if="collapse">展开</div>
                        <div v-if="!collapse">收起</div>
                    </div>
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
    data() {
        return {
            collapse: false
        }
    },
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
.collapse-icon {
    font-size: 24px;
    cursor: pointer;
    transition: all 300ms;
    display: flex;
    align-items: center;

}

.collapse-icon div {
    margin-left: 5px;
    font-size: 16px;
}

.collapse-icon:hover {
    color: #20a7ff;
}

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

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.header-user:hover {
    background-color: #f9f9f9;

}

.faa {
    font-size: 18px;
    width: 24px;
    text-align: center;
}

</style>