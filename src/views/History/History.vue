<template>
    <el-main style="padding: 20px 20px;height: 100%" class="load-container">
        <transition name="shadow-transition">
            <div class='popContainer' v-show="loading"></div>
        </transition>

        <div class="boxLoading" v-show="loading"/>
        <div style="margin-bottom: 10px">
            历史调试信息
        </div>
        <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                label="序号"
                width="50">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="uid"
                prop="uid"
                width="50">
            </el-table-column>
            <el-table-column
                label="文件名"
                prop="filename"
                width="180">
            </el-table-column>
            <el-table-column
                label="头文件id"
                prop="headid"
                width="80">
            </el-table-column>
            <el-table-column
                label="大小(Bytes)"
                prop="size"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ toThousand(scope.row.size) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上传时间"
                prop="uploadtime"
            >
            </el-table-column>
            <el-table-column label="Trace文件" width="200">
                <template slot-scope="scope">
                    <el-tag type="success" size="small" v-if="scope.row.traced===true">
                        已上传
                    </el-tag>
                    <el-button
                        style="margin-left: 10px"
                        v-if="scope.row.traced===true"
                        type="primary"
                        size="mini"
                        @click="showTrace(scope.row.traceid)">查看
                    </el-button>
                    <el-tag size="small" v-if="scope.row.traced===false">
                        未上传
                    </el-tag>
                    <el-button v-if="scope.row.traced===false" type="primary" size="mini" style="margin-left: 10px"
                               @click="uploadTrace(scope.row.uid)">
                        上传
                    </el-button>


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
                        title="这是一段内容确定删除吗？"
                    >
                        <el-button
                            style="margin-left: 10px"
                            slot="reference"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
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
        <el-dialog
            title="Trace文件上传"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">
            <div class="offline-wrapper">
                <el-upload
                    :show-file-list="false"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :before-upload="beforeUpload"
                    :disabled="uploading"
                    :action="uploadAddress()">
                    <div class="offline">
                        <div class="offline-icon">
                            <i v-bind:class="icon"></i>
                        </div>
                        <div class="offline-text">{{ text }}</div>
                    </div>

                </el-upload>
            </div>
        </el-dialog>
        <Trace :visible="traceVisible" :close="closeTrace" :traceid="traceid"/>

    </el-main>
</template>

<script>
import {basic_url} from "@/request/request";
import Trace from "@/components/Trace/TraceDialog";

export default {
    name: "History",
    components: {Trace},
    data() {
        return {
            traceVisible: false,
            tableData: [],
            currentPage: 1,
            pages: 0,
            pageSize: 10,
            total: 0,
            loading: true,
            dialogVisible: false,
            uploadUid: -1,
            uploading: false,
            icon: "fa fa-upload",
            text: "上传Trace文件",
            traceid: -1,
        }
    },
    methods: {
        showTrace(id) {
            this.traceid = id
            this.traceVisible = true
        },
        closeTrace() {
            this.traceid = -1
            this.traceVisible = false
        },
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        handleEdit(index, row) {
            this.$router.push('/debug/' + row.uid)
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        uploadTrace(uid) {
            this.dialogVisible = true;
            this.uploadUid = uid
            console.log(uid)
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
                this.loading = false
                this.tableData = e.data.records
                this.total = e.data.total
                this.pages = e.data.pages
            })
        },
        uploadAddress: function () {
            return basic_url + '/uploadTrace?ltid=' + this.uploadUid
        },
        handleClose(done) {
            if (this.uploading) {
                this.$message.error("正在上传中！")
            } else {

                done()
            }
        },

        // eslint-disable-next-line no-unused-vars
        onSuccess(response, file, fileList) {
            this.icon = "fa fa-check"
            this.text = '上传成功！';
            clearTimeout(this.timer);  //清除延迟执行
            this.timer = setTimeout(() => {   //设置延迟执行
                this.uploading = false
                this.dialogVisible = false
                this.getData()
            }, 1500);
        },
        // eslint-disable-next-line no-unused-vars
        onError(err, file, fileList) {
            this.uploading = false;
            this.icon = 'fa fa-close';
            this.text = '重新上传Trace文件';
        },
        // eslint-disable-next-line no-unused-vars
        beforeUpload(file) {
            this.uploading = true;
            this.icon = 'fa fa-circle-o-notch fa-spin';
            this.text = '正在上传Trace并解析中，请保持网络通畅';
        },
    },
    mounted() {
        this.getData()

    },
    computed: {
        loginUsername: function () {
            return localStorage.getItem('token')
        },
    }
}
</script>

<style scoped>
.offline-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.offline {
    width: 500px;
    height: 300px;
    /*border: #ff8d02 1px solid;*/
    border-radius: 10px;
    background-color: #f7f8f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 300ms;
}

.offline-icon {
    text-align: center;
    font-size: 80px;
}

.offline-text {
    margin-top: 20px;
    text-align: center;
    font-size: 25px;
}

.offline:hover {
    background-color: #fcce9e;
    color: white;
    cursor: pointer;
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