<template>
    <el-main style="padding: 10px">
        <div style="display: flex;align-items: center;width: 100%;justify-content: center">
            远程调试接口：
            <div style="width: 300px">
                <el-input v-model="interfaceAddress"></el-input>
            </div>

            <el-button style="margin-left: 10px" type="primary">开始接收数据</el-button>
        </div>
        <div style="border: #B3C0D1 1px solid;margin-top: 20px;height: 500px">

        </div>

    </el-main>
</template>

<script>
export default {
    name: "OnlineDebug",
    data() {
        return {
            interfaceAddress: 'localhost:50071'
        }
    }
}
</script>

<style scoped>

</style>