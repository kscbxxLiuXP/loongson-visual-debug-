<template>
    <div class="login-wrapper">
        <div style="display: flex;align-items: center">
            <div>
                <img :src="loongson"/>
            </div>
            <div style="font-size: 80px;margin-left: 30px">
                <i class="fa fa-code"></i>
            </div>

        </div>
        <div style="font-size: 20px">
            二进制翻译反汇编器(LATX)调试系统
        </div>
        <div style="margin-top: 40px ;width: 300px">
            <div>
                用户名:
            </div>
            <el-input @keyup.enter.native="login" v-model="username"/>
        </div>
        <div style="margin-top: 15px;width: 300px">
            <div>
                密码:
            </div>
            <el-input @keyup.enter.native="login" v-model="password" show-password/>
        </div>
        <el-button @click="login" type="primary" style="margin-top: 30px">登录</el-button>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "Login",
    data() {
        return {
            loongson: require('@/assets/loongson.png'),
            username: '',
            password: '',

        }
    },
    methods: {
        login() {
            if (this.username.trim() === '') {
                this.$message.error("请输入用户名！")
                return
            }
            if (this.password.trim() === '') {
                this.$message.error("请输入密码！")
                return
            }
            this.$axios.post(basic_url + '/user/login', {
                username: this.username,
                password: this.password
            }).then(e => {
                var type = e.data.result === 3 ? 'success' : 'error'
                this.$message({
                    type: type,
                    message: e.data.message
                })
                if (type === 'success') {
                    localStorage.setItem("token", this.username)
                    this.$router.push("/home")
                }

            })

        }
    }
}
</script>

<style scoped>
.login-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>