<template>
    <el-container style="padding: 0">
        <el-header style="padding: 0;line-height: 35px;height: 35px">
            <div
                style="display: flex;align-items: center;width: 100%;justify-content: center;border-bottom: #d1d1d1 1px solid;">
                <div>
                    IP地址:{{ debugVar.ip }}
                </div>
                <div style="margin-left: 10px">
                    当前地址:0x{{ debugVar.currentAddress }}
                </div>

                <div class="debug-divider"/>
                <el-tag size="mini" :type="websock===null?'error':'success'">{{
                        websock === null ? '未连接' : '已连接'
                    }}
                </el-tag>
                <MyPopover title="连接调试后台">
                    <i class="fa fa-link debug-button  fa-fw" @click="connectDebugBackend"/>
                </MyPopover>
                <MyPopover title="开始运行">
                    <i class="fa fa-play debug-button  fa-fw" @click="startRun"/>
                </MyPopover>
                <MyPopover title="停止运行">
                    <i class="fa fa-stop debug-button  fa-fw" @click="stopRun"/>
                </MyPopover>
                <div class="debug-divider"/>
                <div style="font-size: 14px">
                    断点地址:0x<input style="width: 80px;" placeholder="请输入" v-model="breakPointAddress">
                </div>
                <MyPopover title="设置断点">
                    <i class="fa fa-tag debug-button  fa-fw" @click="setBreakPointAddress"/>
                </MyPopover>
                <div class="debug-divider"/>

                <MyPopover title="下一步">
                    <i class="fa fa-mail-forward debug-button  fa-fw" @click="nextStep"/>
                </MyPopover>
                <MyPopover title="运行到下一个断点">
                    <i class="fa fa-step-forward debug-button  fa-fw" @click="runToNextBreakPoint"/>
                </MyPopover>
                <MyPopover title="运行到结束">
                    <i class="fa fa-stop-circle-o debug-button  fa-fw" @click="runToEnd"/>
                </MyPopover>
                <div class="debug-divider"/>
                <MyPopover title="显示/隐藏日志">
                    <i class="fa fa-terminal debug-button  fa-fw" @click="runToEnd"/>
                </MyPopover>
            </div>
        </el-header>
        <el-main>
            <div style="border: #B3C0D1 1px solid;height: 500px">
                {{ ltid ? 'true' : 'false' }}
            </div>
        </el-main>
        <el-footer>
            控制台
        </el-footer>


    </el-container>
</template>

<script>
import {basic_url} from "@/request/request";
import MyPopover from "@/components/Popover/MyPopover";

export default {
    name: "OnlineDebug",
    components: {MyPopover},
    props: ['id'],
    data() {
        return {
            breakPointAddress: '',
            websock: null,
            debugVar: {},
        }
    },
    methods: {
        initWebSocket() {
            if (this.websock !== null) {
                this.$message.info("已连接！")
                return
            }
            this.websock = new WebSocket("ws://127.0.0.1:8000/websocket/" + this.loginUsername)
            this.websock.onmessage = this.websocketonmessage
            this.websock.onerror = this.websocketonerror
            this.websock.onopen = this.websocketonopen
            this.websock.onclose = this.websocketclose

        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            let data = {
                type: -1,
                id: parseInt(this.id),

                msg: '这是client：初次连接'
            }
            this.websocketsend(JSON.stringify(data))
        },
        websocketonerror() {
            console.log('WebSocket连接失败')
        },
        // 数据接收
        websocketonmessage(e) {
            //处理各种数据
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

        connectDebugBackend() {
            this.initWebSocket()
        },
        setBreakPointAddress() {
            let data = {
                type: 0,
                id: parseInt(this.id),
                address: this.breakPointAddress
            }
            this.websock.send(JSON.stringify(data))
        },
        startRun() {

        },
        stopRun() {

        },
        nextStep() {
            let data = {
                type: 1,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        },
        runToNextBreakPoint() {
            let data = {
                type: 2,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        },
        runToEnd() {
            let data = {
                type: 3,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        }
    },
    mounted() {
        this.$axios.get(basic_url + "/onlineDebug/get", {
            params: {
                id: this.id
            }
        }).then(e => {
            this.debugVar = e.data
            console.log(e.data)
        })
        console.log()
    },
    computed: {
        loginUsername: function () {
            return localStorage.getItem('token')
        },
        ltid: function () {
            return parseInt(this.$route.query.ltid)
        }
    },

}
</script>

<style scoped>
.debug-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #89898c;
    background-color: white;
    margin-left: 2px;
    transition: all 300ms;
    width: 25px;
    height: 26px;
}

.debug-button:hover {

    background-color: #dfdfdf;
}

.debug-button:active {
    background-color: #c2bfbf;
}

.debug-divider {
    width: 1px;
    height: 26px;
    background-color: #d1d1d1;
    margin-right: 5px;
    margin-left: 5px;
}

input {
    font-size: 14px;
    border: none;
    border-bottom: black 1px solid;
    transition: all 300ms
}

input:hover {
    outline: 0;
    border-bottom: #40a9ff 1px solid;

}

input:focus {
    outline: 0;
    border-bottom: #1e94ff 1px solid;

}
</style>