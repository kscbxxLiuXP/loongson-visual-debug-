<template>
    <el-main style="padding: 20px 20px;height: 100%" class="load-container">
        <transition name="shadow-transition">
            <div class='popContainer' v-show="loading"></div>
        </transition>

        <div class="boxLoading" v-show="loading"/>
        <div style="margin-bottom: 10px">
            日志分析列表
        </div>
        <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                label="序号"
                width="50">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ (currentPage-1)*10+ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="文件名"
                prop="filename"
                width="180">
                <template slot-scope="scope">
                    <span >{{ scope.row.ltlog.filename }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="大小(Bytes)"
                prop="size"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{$util.renderSize (scope.row.ltlog.size).size }}</span>
                    <span style="margin-left: 10px; display: inline-flex; padding: 2px 5px; background: orange; color: white;font-size: 12px;border-radius: 5px;line-height: 14px">
                        {{$util.renderSize (scope.row.ltlog.size).type }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="行数"
                prop="line"
                width="180">
                <template slot-scope="scope">
                    <span>{{ toThousand(scope.row.ltlog.line) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上传时间"
            >
                <template slot-scope="scope">
                    <span >{{ scope.row.ltlog.uploadtime }}</span>
                </template>


            </el-table-column>
            <el-table-column
                label="gen code size">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.genCodeSize1 }}/{{ scope.row.genCodeSize2 }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Profile文件" width="200">
                <template slot-scope="scope">
                    <el-tag type="success" size="small" v-if="scope.row.profiled===true">
                        已上传
                    </el-tag>
                    <el-tag size="small" v-if="scope.row.profiled===false">
                        未上传
                    </el-tag>
                    <el-button v-if="scope.row.profiled===false" type="primary" size="mini" style="margin-left: 10px"
                               @click="uploadProfile(scope.row.ltid)">
                        上传
                    </el-button>
                    <el-popconfirm
                        confirm-button-text='好的'
                        cancel-button-text='不用了'
                        icon="el-icon-info"
                        icon-color="red"
                        title="确定删除这个Trace吗？"
                        @confirm="deleteTrace(scope.$index, scope.row)"
                    >
                        <el-button
                            v-if="scope.row.traced===true"
                            style="margin-left: 10px"
                            slot="reference"
                            size="mini"
                            type="danger"
                        >删除
                        </el-button>
                    </el-popconfirm>


                </template>
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">查看
                    </el-button>
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
            title="Profile文件上传"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">
            <MUpload
                :address="uploadAddress()"
                :tip-text="'Profile'"
                :before-upload-callback="beforeUploadcallback"
                :fail-callback="failcallback"
                :success-callback="successcallBack"
            />
        </el-dialog>

    </el-main>
</template>

<script>
import {basic_url} from "@/request/request";
import MUpload from "@/components/MUpload";

export default {
    name: "DataAnalysisList",
    components: {MUpload},
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pages: 0,
            pageSize: 10,
            total: 0,
            loading: true,
            dialogVisible: false,
            uploadUid: -1,
            uploading: false,
            traceid: -1,
        }
    },
    methods: {
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
        successcallBack(response) {

            let error = ''
            response.forEach(e => {
                    error = error + e + "\n"
                }
            )
            if (response.length !== 0) {
                this.$alert(<div>分析已经完成，但是发生了以下的错误：
                        <div>下列地址没有在日志中找到映射</div>
                        <div> ${error}</div>
                    </div>,
                    '错误提示',
                    {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                            this.uploading = false
                            this.dialogVisible = false
                            this.getData()
                        }
                    });
            } else {
                this.uploading = false
                this.dialogVisible = false
                this.getData()
            }
        },
        failcallback() {
            this.uploading = false
        },
        beforeUploadcallback() {

            this.uploading = true
        },

        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        handleEdit(index, row) {
            this.$router.push('/dataAnalysis/' + row.ltid)
        },

        uploadProfile(uid) {
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
            this.$axios.get(basic_url + '/ltLogAnalysis/getAll',
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
                console.log(e.data.records)
            })
        },
        uploadAddress: function () {
            return basic_url + '/uploadProfile?ltid=' + parseInt(this.uploadUid)
        },
        handleClose(done) {
            if (this.uploading) {
                this.$message.error("正在上传中！")
            } else {
                done()
            }
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
