<template>
    <el-main style="padding: 20px 20px;height: 100%" class="load-container">
        <transition name="shadow-transition">
            <div class='popContainer' v-show="loading"></div>
        </transition>

        <div class="boxLoading" v-show="loading"/>
        <div style="margin-bottom: 10px">
            在线调试记录
        </div>
        <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                label="序号"
                width="80">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="debugid"
                prop="uid"
                width="100"
            >
            </el-table-column>
            <el-table-column
                label="IP"
                prop="ip"
                width="180">
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="createtime"
            >
            </el-table-column>
            <el-table-column
                label="调试状态"
                prop="debugstate"
                width="180">
                <template slot-scope="scope">
                    <DebugState :debug-state="scope.row.debugstate"/>
                </template>
            </el-table-column>
            <el-table-column
                label="调试参数信息"
            >
                <template slot-scope="scope">
                    <div style="display: flex;flex-direction: column;justify-content: center;">
                        <div><span style="display:inline-block;width: 50%;text-align: right">当前执行地址:</span><span>0x{{ dec2Hex(scope.row.currentaddress) }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">断点地址:</span><span>0x{{ dec2Hex(scope.row.breakpointaddress) }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">canExecute:</span><span>{{ scope.row.canexecute }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">canStart:</span><span>{{ scope.row.canstart }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">debug:</span><span>{{ scope.row.debug }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">isend:</span><span>{{ scope.row.isend }}</span></div>
                        <div><span style="display:inline-block;width: 50%;text-align: right">previousTrace:</span><span>{{ scope.row.previousTrace }}</span></div>
                    </div>


                </template>
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">查看
                    </el-button>
                    <el-popconfirm
                        confirm-button-text='好的'
                        cancel-button-text='不用了'
                        icon="el-icon-info"
                        icon-color="red"
                        @confirm="handleDelete(scope.$index, scope.row)"
                        title="确定删除吗(相关Trace信息也会被删除)？"
                    >
                        <el-button
                            style="margin-left: 10px"
                            slot="reference"
                            size="mini"
                            type="danger"
                        >删除
                        </el-button>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>

    </el-main>
</template>

<script>
import {basic_url} from "@/request/request";
import DebugState from "@/views/Debug/OnlineDebugComponent/DebugState";
import {dec2Hex, hex2Dec} from "@/util/HexadecimalConversion";

export default {
    name: "TraceManage",
    components: {DebugState},
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pages: 0,
            pageSize: 10,
            total: 0,
            loading: true,
        }
    },
    methods: {
        dec2Hex,
        hex2Dec,
        deleteTrace(index, row) {
            this.loading = true
            this.$axios.get(basic_url + '/trace/delete',
                {
                    params:
                        {
                            ltid: row.uid,
                            traceid: row.traceid,
                        }
                }
            ).then(e => {
                this.$message.success("删除成功！")
                this.loading = false
                this.getData()
            })
        },
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        handleEdit(index, row) {
            this.$router.push('/debug/online/' + row.uid)
        },
        handleDelete(index, row) {
            console.log(index, row);
        },

        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log('change')
            this.currentPage = val
            this.getData()
        },
        getData() {
            this.loading = true
            this.$axios.get(basic_url + '/onlineDebug/all',
                {
                    params:
                        {
                            currentPage: this.currentPage,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                this.loading = false
                this.tableData = e.data.records
                this.total = e.data.total
                this.pages = e.data.pages
            })
        },

    },
    mounted() {
        this.getData()

    },
}
</script>

<style scoped>

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