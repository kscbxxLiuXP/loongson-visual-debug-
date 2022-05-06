<template>
    <div class="index">



            <el-container>
                <el-header style="display: flex;justify-content: space-between;border-bottom: #B3C0D1 1px solid;height: 61px">
                    <div style="display: flex">
                        可视化调试系统
                        <div style="width: 2px;background: #cccccc;margin: 15px 15px 15px 30px;"></div>
                        <el-menu

                            :default-active="$route.path"
                            router
                            mode="horizontal"
                            style="width: fit-content;margin: 0"
                        >
                            <el-menu-item index="/dashboard">
                                <i class="faa fa fa-home"></i>
                                <span slot="title" style="margin-left: 5px">主页</span>
                            </el-menu-item>

                            <el-menu-item index="/history">
                                <i class="faa fa fa-history"></i>
                                <span slot="title">
                                日志管理
                        </span>
                            </el-menu-item>
                            <el-menu-item index="/dataAnalysis">
                                <i class="faa fa fa-bar-chart"></i>
                                <span slot="title">
                                TB数据分析
                        </span>
                            </el-menu-item>
                            <el-menu-item index="/trace">
                                <i class="faa fa fa-bolt "></i>
                                <span slot="title">
                                在线调试管理
                        </span>
                            </el-menu-item>
                            <el-submenu index="1">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span slot="title">调试</span>
                                </template>
                                <el-menu-item index="/debug/online">
                                    <i class="faa fa fa-code"></i>
                                    <span slot="title" style="margin-left: 10px">
                                在线调试
                            </span>
                                </el-menu-item>
                                <el-menu-item index="/debug/offline">
                                    <i class="faa fa fa-bug"></i>
                                    <span slot="title" style="margin-left: 10px">
                                离线调试
                            </span>
                                </el-menu-item>
                            </el-submenu>
                        </el-menu>

                    </div>
                    <div style="display: flex">

                        <el-dropdown>
                            <div class="header-user">
                                <el-avatar :size="30"> {{ avatar }}</el-avatar>
                                <div style="font-size: 18px;margin-left: 10px">
                                    {{ loginUsername }}
                                </div>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                </el-header>
                <el-main style="padding: 0;margin: 0">
                    <router-view :key="key" style="height: 100%"/>
                </el-main>
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
        collapseClick() {
            this.collapse = !this.collapse
            localStorage.setItem("collapse", this.collapse)
        },
        logout() {
            this.$message.success("注销成功！")

            window.localStorage.removeItem('token')
            this.$router.push('/login')
        }
    },
    created() {
        this.collapse = localStorage.getItem("collapse") !== 'false';
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
    height: 60px;
    line-height: 60px;
    transition: all 500ms;
    display: flex;
    align-items: center;
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