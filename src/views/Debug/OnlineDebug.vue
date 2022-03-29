<template>
    <el-main style="padding: 10px">
        <div style="display: flex;align-items: center;width: 100%;justify-content: center">
            远程调试接口：
            <div style="width: 300px">
                <el-input v-model="interfaceAddress"></el-input>
            </div>
            <div style="width: 300px">
                <el-input v-model="breakPointAddress"></el-input>
            </div>

            <el-button style="margin-left: 10px" type="primary" @click="connectDebugBackend">连接调试后台</el-button>
            <el-button style="margin-left: 10px" type="primary" @click="setBreakPointAddress">设置断点</el-button>
            <el-button style="margin-left: 10px" type="primary">下一步</el-button>
            <el-button style="margin-left: 10px" type="primary">运行到下一个断点</el-button>
            <el-button style="margin-left: 10px" type="primary">运行到结束</el-button>


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
            interfaceAddress: 'localhost:50071',
            breakPointAddress: '',
            websocket:null,
        }
    },
    methods: {
        //websocket
        /**
         * 创建websocket
         */
        initWebSocket() {

            console.log("创建WebSocket")
            this.websock = new WebSocket("ws://127.0.0.1:8000/websocket/ydsj")
            this.websock.onmessage = this.websocketonmessage
            this.websock.onerror = this.websocketonerror
            this.websock.onopen = this.websocketonopen
            this.websock.onclose = this.websocketclose

        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            let data = {
                code: 0,
                msg: '这是client：初次连接'
            }
            this.websocketsend(data)
        },
        websocketonerror() {
            console.log('WebSocket连接失败')
        },
        // 数据接收
        websocketonmessage(e) {
            console.log('数据接收' + e.data)
        },
        // 数据发送
        websocketsend(Data) {
            this.websock.send(Data)
        },
        // 关闭
        websocketclose(e) {
            console.log('已关闭连接', e)
        },

        connectDebugBackend(){
            this.initWebSocket()
        },
        setBreakPointAddress() {

        },
        nextStep() {

        },
        runToNextBreakPoint() {

        },
        runToEnd() {

        }
    }
}
</script>

<style scoped>

</style>