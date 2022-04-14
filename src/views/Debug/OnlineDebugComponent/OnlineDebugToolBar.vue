<template>
    <div
        style="display: flex;align-items: center;width: 100%;justify-content: center;border-bottom: #d1d1d1 1px solid;font-size: 14px">
        <div>
            <MyPopover title="显示/隐藏跟踪信息" position="top">
                <DebugButton color="gray" :selected="showTrace" icon="fa-history" id="showTrace_btn"
                             :click="()=>{showTrace=!showTrace}"/>
            </MyPopover>
            <div style="position: relative">
                <transition
                    name="fade-in-linear">
                    <DebugTraceBoard
                        :debug-traces="debugTraces"
                        v-show="showTrace"
                        @close="showTrace=false"
                        @setAsStart="setAsStart"
                        @jumpByAddress="jumpByAddress"
                    />
                </transition>

            </div>

        </div>


        <div class="debug-divider"/>
        <div style="line-height: 14px">
            IP地址:{{ onlineDebug.ip }}
        </div>

        <div style="margin-left: 10px;line-height: 14px" v-if="onlineDebug.currentaddress===-1">
            当前地址: <span style="color: palevioletred">NULL</span>
        </div>
        <div style="margin-left: 10px;line-height: 14px" v-if="onlineDebug.currentaddress!==-1">
            当前地址:<span style="color: #df8a2e;margin-left: 5px">0x{{ dec2Hex(onlineDebug.currentaddress) }}</span>
        </div>
        <div style="margin-left: 10px;line-height: 14px" v-if="onlineDebug.breakpointaddress===-1">
            当前断点: <span style="color: palevioletred">NULL</span>
        </div>
        <div style="margin-left: 10px;line-height: 14px" v-if="onlineDebug.breakpointaddress!==-1">
            当前断点:0x{{ dec2Hex(onlineDebug.breakpointaddress) }}
        </div>
        <DebugState style="line-height: 14px;" :debug-state="onlineDebug.debugstate"/>
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
                         :click="()=>{$emit('close')}"/>
        </MyPopover>
    </div>
</template>

<script>
import DebugButton from "@/components/Button/DebugButton";
import DebugState from "@/views/Debug/OnlineDebugComponent/DebugState";
import {basic_url, basic_websocket} from "@/request/request";

import MyPopover from "@/components/Popover/MyPopover";
import {dec2Hex, hex2Dec} from "@/util/HexadecimalConversion";
import DebugTraceBoard from "@/views/Debug/OnlineDebugComponent/DebugTraceBoard";

export default {

    name: "OnlineDebugToolBar",
    components: {DebugTraceBoard, DebugState, DebugButton, MyPopover},
    props: ['showConsole', 'id', 'logg', 'debugTraces'],
    data() {
        return {
            breakPointAddress: '',
            websock: null,
            onlineDebug: {},
            breakPointSet: false,
            showTrace: true,

        }
    },
    methods: {
        dec2Hex,
        hex2Dec,
        setAsStart(address){
            this.$emit("setAsStart",address)
        },
        jumpByAddress(address){
            this.$emit("jumpByAddress",address)
        },
        getDisabledState() {
            var runDisabled = true
            var stopDisabled = true
            var breakPointDisabled = true
            var nextStepDisabled = true
            var runToNextBreakPointDisabled = true
            var runToEndDisabled = true
            if (this.websock !== null) {
                switch (this.onlineDebug.debugstate) {
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
        initWebSocket() {
            if (this.websock !== null) {
                this.$message.info("已连接！")
                return
            }
            this.logg("连接调试台")
            this.websock = new WebSocket(basic_websocket + this.id)
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
                case 8:
                    //Latx向Server发送了trace信息
                    this.logg("收到 LATX 发送的trace信息！" + reply.trace)
                    this.$notify({
                        title: '收到了一条Trace',
                        position: 'top-left',
                        offset: 100,
                        dangerouslyUseHTMLString: true,
                        message: `<div>
                                    <div>
                                    Trace地址:<span>${dec2Hex(reply.trace)}</span>
                                    </div>
                                    <div>
                                    寄存器信息:<span>${reply.registers}</span>
                                    </div>
                                </div>`
                    });
                    this.$emit('newTraceArrive')
                    break;
                case 9:
                    //Latx向Server发送了Link信息
                    this.logg("LATX Link TBS")
                    this.$notify({
                        title: '收到了一条Linking TB',
                        position: 'top-left',
                        offset: 100,
                        dangerouslyUseHTMLString: true,
                        message: `<div>
                                        <div>
                                        TB块链接 从:<span>${dec2Hex(reply.linkFrom)}</span> 到 <span>${dec2Hex(reply.linkTo)}</span>
                                        </div>
                                    </div>`
                    });
                    break;
            }
            this.onlineDebug = reply.data

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
            let addressDec = hex2Dec(this.breakPointAddress)
            console.log('setbreakpoint' + addressDec)
            let data = {
                type: 0,
                id: parseInt(this.id),
                address: addressDec
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
        let button = document.getElementById("showTrace_btn")
        let board = document.getElementById("debug-trace-board")
        let offsetleft = (button.offsetLeft + button.clientWidth / 2) - (350 / 2)
        board.style.left = (offsetleft - button.offsetLeft) + 'px'

        this.$axios.get(basic_url + "/onlineDebug/get", {
            params: {
                id: this.id
            }
        }).then(e => {
            this.onlineDebug = e.data
        })
    },
    computed: {
        loginUsername: function () {
            return localStorage.getItem('token')
        },

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