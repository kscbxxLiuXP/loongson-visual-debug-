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
                <div style="margin-left: 10px">
                    当前断点:0x{{ debugVar.breakPointAddress }}
                </div>
                <DebugState :debug-state="debugVar.debugState"/>
                <div class="debug-divider"/>
                <el-tag size="mini" :type="websock===null?'error':'success'">{{
                        websock === null ? '未连接' : '已连接'
                    }}
                </el-tag>
                <MyPopover title="连接调试后台">
                    <DebugButton icon="fa-link" :click="connectDebugBackend"/>
                </MyPopover>
                <MyPopover title="开始运行">
                    <DebugButton icon="fa-play" color="green" :click="startRun"
                                 :disabled="getDisabledState().runDisabled"/>
                </MyPopover>
                <MyPopover title="停止运行">
                    <DebugButton icon="fa-stop" color="red" :click="stopRun"
                                 :disabled="getDisabledState().stopDisabled"/>
                </MyPopover>
                <div class="debug-divider"/>
                <div style="font-size: 14px">
                    断点地址:0x<input style="width: 80px;" placeholder="请输入" v-model="breakPointAddress">
                </div>
                <MyPopover title="设置断点">
                    <DebugButton icon="fa-tag" color="red" :click="setBreakPointAddress"
                                 :disabled="getDisabledState().breakPointDisabled"/>
                </MyPopover>
                <div class="debug-divider"/>
                <MyPopover title="下一步">
                    <DebugButton color="green" icon="fa-mail-forward" :click="nextStep"
                                 :disabled="getDisabledState().nextStepDisabled"/>
                </MyPopover>
                <MyPopover title="运行到下一个断点">
                    <DebugButton color="green" icon="fa-step-forward" :click="runToNextBreakPoint"
                                 :disabled="getDisabledState().runToNextBreakPointDisabled"/>
                </MyPopover>
                <MyPopover title="运行到结束">
                    <DebugButton color="red" icon="fa-stop-circle-o" :click="runToEnd"
                                 :disabled="getDisabledState().runToEndDisabled"/>
                </MyPopover>
                <div class="debug-divider"/>
                <MyPopover title="显示/隐藏日志">
                    <DebugButton color="gray" :selected="showConsole" icon="fa-terminal"
                                 :click="()=>{this.showConsole = !this.showConsole}"/>
                </MyPopover>
            </div>
        </el-header>
        <el-main>
            <div style="border: #B3C0D1 1px solid;height: 500px">
                {{ ltid ? 'true' : 'false' }}
            </div>
        </el-main>
        <el-footer v-show="showConsole" height="100" style="padding: 0;border: #d6d6d6 1px solid">
            <div style="background-color: #f4f4f4;padding:2px 10px;font-size: 14px;border-bottom: #d6d6d6 1px solid">
                控制台
            </div>

            <Logger ref="logger"/>
        </el-footer>


    </el-container>
</template>

<script>
import {basic_url} from "@/request/request";
import MyPopover from "@/components/Popover/MyPopover";
import Logger from "@/components/Logger/Logger";
import DebugButton from "@/components/Button/DebugButton";
import DebugState from "@/views/Debug/OnlineDebugComponent/DebugState";

export default {
    name: "OnlineDebug",
    components: {DebugState, DebugButton, Logger, MyPopover},
    props: ['id'],
    data() {
        return {
            breakPointAddress: '',
            websock: null,
            debugVar: {},
            showConsole: true,
            breakPointSet: false,
        }
    },
    methods: {
        getDisabledState() {
            var runDisabled = true
            var stopDisabled = true
            var breakPointDisabled = true
            var nextStepDisabled = true
            var runToNextBreakPointDisabled = true
            var runToEndDisabled = true
            if (this.websock !== null) {
                switch (this.debugVar.debugState) {
                    case 1:
                        //准备就绪
                        if (this.breakPointSet) {
                            runDisabled = false
                        }
                        breakPointDisabled = false
                        break;
                    case 2:
                        //执行中
                        break;
                    case 3:
                        //调试中
                        stopDisabled = false
                        breakPointDisabled = false
                        nextStepDisabled = false
                        runToEndDisabled = false
                        if (this.breakPointSet) {
                            runToNextBreakPointDisabled = false
                        }
                        break;
                    case 4:
                        //已结束
                        break;
                    case 5:
                        //被终止
                        break;
                    case 6:
                        //连接丢失
                        break;
                    case 7:
                        //等待Latx更新状态
                        break;
                }
            }
            return {
                'runDisabled': runDisabled,
                'stopDisabled': stopDisabled,
                'breakPointDisabled': breakPointDisabled,
                'nextStepDisabled': nextStepDisabled,
                'runToEndDisabled': runToEndDisabled,
                'runToNextBreakPointDisabled': runToNextBreakPointDisabled
            }
        },
        logg(content) {
            this.$refs.logger.log(content)
        },
        initWebSocket() {
            if (this.websock !== null) {
                this.$message.info("已连接！")
                return
            }
            this.logg("连接调试台")
            this.websock = new WebSocket("ws://127.0.0.1:8000/websocket/" + this.id)
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
            var reply = JSON.parse(e.data)
            switch (reply.type) {
                case -1:
                    //连接socket回调
                    if (reply.code === 1) {
                        this.logg("连接成功！")

                    }
                    break;
                case 0:
                    //设置断点成功回调
                    if (reply.code === 1) {
                        this.logg("设置断点成功！")
                        this.breakPointSet = true
                    }
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break
                case 4:
                    //开始执行
                    if (reply.code === 1) {
                        this.logg("发生指令： 开始执行")
                        this.logg("等待LATX回复...")
                    }
                    break
                case 5 :
                    //停止执行

                    break;
                case 6:
                    //Latx向Server主动更新状态
                    this.logg("LATX状态更新！")
                    break;
                case 7:
                    //Latx向Server主动更新状态
                    this.logg("LATX 运行结束！")
                    break;
            }
            this.debugVar = reply.data

        },
        // 数据发送
        websocketsend(Data) {
            this.websock.send(Data)
        },
        // 关闭
        websocketclose(e) {
            this.websock = null
            this.logg("发生异常，连接已断开")
            console.log('已关闭连接', e)
        },

        connectDebugBackend() {
            this.initWebSocket()
        },
        setBreakPointAddress() {
            console.log('setbreakpoint')
            let data = {
                type: 0,
                id: parseInt(this.id),
                address: this.breakPointAddress
            }
            this.websock.send(JSON.stringify(data))
        },
        startRun() {
            //断点是否更新为false
            this.breakPointSet = false
            console.log('startRun')
            let data = {
                type: 4,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        },
        stopRun() {
            //断点是否更新为false
            console.log('stopRun')
            let data = {
                type: 5,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        },
        nextStep() {
            let data = {
                type: 1,
                id: parseInt(this.id),
            }
            this.websock.send(JSON.stringify(data))
        },
        runToNextBreakPoint() {
            this.breakPointSet = false

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