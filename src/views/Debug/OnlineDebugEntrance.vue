<template>
    <div class="online-debug-entrance">
        <h2 style="padding: 0;margin:0">
            在线调试列表
        </h2>
        <div style="color: #9195a3;font-size: 14px;display: flex;align-items: center">
            从下列表中选择一个进入调试
            <el-tooltip content="刷新" placement="top-end">
                <i class="fa fa-refresh circle-button refresh-button fa-fw" @click="getOnlineList"/>

            </el-tooltip>
            <el-popover
                placement="top"
                width="50"
                trigger="hover"
                content="管理调试过程中生成的历史Trace">
                <i slot="reference" class="fa fa-gear circle-button refresh-button fa-fw" @click="manageTrace"/>
            </el-popover>

        </div>
        <div class="online-debug-list-wrapper load-container">
            <transition name="shadow-transition">
                <div class='popContainer' v-show="loading"></div>
            </transition>

            <div class="boxLoading" v-show="loading"/>
            <div>
                <div :key="index" class="online-debug-list-item" v-for="(item,index) in onlineList">
                    <div class="lf">
                        <div class="title">
                            <h4>
                                Debug-{{ item.id }}
                            </h4>
                            <div style="font-size: 14px;margin-left: 20px;display: flex;align-items: center">
                                状态：
                                <div class="debug-state-1" v-if="item.debugState===1">准备就绪</div>
                                <div class="debug-state-2" v-if="item.debugState===2">执行中</div>
                                <div class="debug-state-3" v-if="item.debugState===3">调试中</div>
                                <div class="debug-state-4" v-if="item.debugState===4">已结束</div>
                                <div class="debug-state-5" v-if="item.debugState===5">被终止</div>
                                <div class="debug-state-6" v-if="item.debugState===6">连接丢失</div>

                            </div>
                        </div>
                        <div class="info">
                            <div>
                                IP: {{ item.ip }}
                            </div>
                            <div style="margin-left: 10px">
                                创建时间: {{ item.createTime }}
                            </div>
                        </div>
                    </div>
                    <div class="rf">
                        <!-- 调试状态都可以进入，但是进入之后根据state设置按钮状态-->
                        <i class="fa fa-play circle-button run-button fa-fw" @click="runClick(item.id)"/>
                        <i v-if="item.debugState===2||item.debugState===3" class="fa fa-stop circle-button stop-button fa-fw"/>
                    </div>
                </div>
            </div>
        </div>
        <div style="color: #9195a3;font-size: 14px;">上一次刷新：{{ lastRefresh }}</div>
        <el-dialog title="确认进入调试" :visible.sync="outerVisible" :before-close="handleClose">
            <el-dialog
                width="800px"
                title="选择日志文件"
                :visible.sync="innerVisible"
                append-to-body>
                <el-table
                    border
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        label="序号"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="uid"
                        prop="uid"
                    >
                    </el-table-column>
                    <el-table-column
                        label="文件名"
                        prop="filename"
                    >
                    </el-table-column>
                    <el-table-column
                        label="大小(Bytes)"
                        prop="size"
                    >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ toThousand(scope.row.size) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="上传时间"
                        prop="uploadtime"
                        width="180px"
                    >
                    </el-table-column>

                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="selectLtlog(scope.$index, scope.row)">选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-dialog>
            <h3 v-if="ltid===null" class="ltlog-select ltlog-select-noselect">
                未选择日志文件
            </h3>
            <h3 v-if="ltid" class="ltlog-select ltlog-select-select">
                已选择日志文件 ltid:{{ ltid }}
            </h3>
            <div v-if="!ltid" @click="innerVisible=true" class="od-button od-green">
                添加日志
            </div>

            <div v-if="!ltid" class="od-button od-blue" @click="skip">
                跳过
            </div>
            <div v-if="!ltid" style="margin: auto;text-align: center;margin-top: 2px">*仅保留绘图功能，将无法跳转TB块</div>
            <div v-if="ltid" class="od-button od-red" @click="ltid=null">
                清除选择
            </div>
            <div @click="debug" v-if="ltid" class="od-button od-blue">进入调试</div>

        </el-dialog>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "OnlineDebugEntrance",
    data() {
        return {
            innerVisible: false,
            outerVisible: false,
            index: null,
            ltid: null,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            onlineList: [],
            loading: false,
            lastRefresh: ''
        }
    },
    methods: {
        manageTrace() {
            this.$router.push('/trace')
        },
        selectLtlog(index, row) {
            this.ltid = row.uid
            this.innerVisible = false
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        getOnlineList() {
            this.loading = true
            this.$axios.get(basic_url + '/onlineDebug/available').then(e => {
                console.log(e.data)
                this.onlineList = e.data
                this.lastRefresh = new Date()
                this.loading = false
            })
        },
        getData() {
            this.$axios.get(basic_url + '/history',
                {
                    params:
                        {
                            username: localStorage.getItem('token'),
                            currentPage: this.currentPage,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                this.tableData = e.data.records
                this.total = e.data.total
                this.pages = e.data.pages
            })

        },
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        handleClose(done) {
            this.index = null
            this.ltid = null

            done()
        },
        skip() {
            this.$router.push("/debug/online/" + this.index)
        },
        debug() {
            this.$router.push("/debug/online/" + this.index + "?ltid=" + this.ltid)
        },
        runClick(i) {
            this.index = i
            this.outerVisible = true
        }
    },
    mounted() {
        this.getData()
        this.getOnlineList()
    }
}
</script>

<style scoped>
.debug-state-1 {
    /*background-color: #9f9f9a;*/
    background-color: #75d07d;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-2 {
    background-color: #20a7ff;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-3 {
    background-color: #20a7ff;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-4 {
    background-color: #FDAF75;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-5 {
    background-color: #F24A72;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-6 {
    background-color: #9f9f9a;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.od-button {
    margin: auto;
    margin-top: 10px;
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    color: #020202;
    transition: all 300ms;
}

.od-green {
    color: white;
    background-color: #55b977;
}

.od-green:hover {
    background-color: #74d394;

}

.od-green:active {
    background-color: #1c813e;

}

.od-red {
    color: white;
    background-color: #e57b7b;
}

.od-red:hover {
    background-color: #e09292;

}

.od-red:active {
    background-color: #a93232;

}

.od-blue {
    color: white;
    background-color: #1e94ff;

}

.od-blue:hover {
    background-color: #40a9ff;

}

.od-blue:active {
    background-color: #096dd9;
}

.ltlog-select {
    height: 50px;
    width: 100%;
    text-align: center;
    line-height: 50px;
}

.ltlog-select-noselect {
    background-color: #8FBDD3;
}

.ltlog-select-select {
    background-color: #c6efc9;
}

.online-debug-entrance {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.online-debug-list-wrapper {
    margin-top: 10px;
    border: black 2px solid;
    border-radius: 15px;
}

.online-debug-list-item {
    width: 350px;
    display: flex;
    align-items: center;
    padding: 10px 30px;
    justify-content: space-between;
    transition: all 300ms;
    border-top: #e3e3e3 1px solid;

}

.online-debug-list-item:first-child {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}

.online-debug-list-item:last-child {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
}

.online-debug-list-item:hover {
    background-color: #efeded;
}

.online-debug-list-item .lf {
    display: flex;
    flex-direction: column;
}

.online-debug-list-item .lf .title {
    display: flex;
    align-items: center;
}

.online-debug-list-item .lf h4 {
    margin: 0;
}

.online-debug-list-item .lf .info {
    color: #94979a;
    margin-top: 5px;
    display: flex;
    align-items: center;
    font-size: 14px;
}

.online-debug-list-item .rf {
    display: flex;
    align-items: center;
}

.circle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #89898c;
    background-color: white;
    margin-left: 10px;
    border-radius: 50px;

    transition: all 300ms;
}

.run-button {
    width: 23px;
    height: 26px;
    padding-left: 3px;
    color: #59a869;
}

.run-button:hover {
    background-color: rgba(89, 168, 105, 0.22);

}

.run-button:active {
    background-color: rgba(89, 168, 105, 0.45);

}

.refresh-button {
    font-size: 14px;
    width: 25px;
    height: 26px;
    padding-left: 1px;
    color: white;
    background-color: #1e94ff;
}

.refresh-button:hover {
    background-color: #40a9ff;

}

.refresh-button:active {
    background-color: #096dd9;

}

.stop-button {
    width: 25px;
    height: 26px;
    padding-left: 1px;
    color: #db5860;
}

.stop-button:hover {
    background-color: rgba(219, 88, 96, 0.22);

}

.stop-button:active {
    background-color: rgba(219, 88, 96, 0.45);

}

.load-container {
    position: relative;
}

.load-container .boxLoading {
    width: 50px;
    height: 50px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.load-container .boxLoading:before {
    content: "";
    width: 50px;
    height: 5px;
    background: #000;
    opacity: 0.1;
    position: absolute;
    top: 59px;
    left: 0;
    border-radius: 50%;
    animation: shadow 0.5s linear infinite;
}

.load-container .boxLoading:after {
    content: "";
    width: 50px;
    height: 50px;
    background: #00adb5;
    animation: animate 0.5s linear infinite;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 3px;
}

@keyframes animate {
    17% {
        border-bottom-right-radius: 3px;
    }
    25% {
        transform: translateY(9px) rotate(22.5deg);
    }
    50% {
        transform: translateY(18px) scale(1, 0.9) rotate(45deg);
        border-bottom-right-radius: 40px;
    }
    75% {
        transform: translateY(9px) rotate(67.5deg);
    }
    100% {
        transform: translateY(0) rotate(90deg);
    }
}

@keyframes shadow {
    0%, 100% {
        transform: scale(1, 1);
    }
    50% {
        transform: scale(1.2, 1);
    }
}

.popContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(49, 48, 48, 0.3);
}

.shadow-transition-enter,
.shadow-transition-leave-to {
    opacity: 0;
    /*transform: translateX(100px);*/
}

.shadow-transition-enter-active,
.shadow-transition-leave-active {
    transition: all 0.4s ease;
}
</style>