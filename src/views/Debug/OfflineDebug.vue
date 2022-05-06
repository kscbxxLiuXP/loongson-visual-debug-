<template>
    <el-container style="margin: 0;padding: 0">
        <div>
            <el-steps :active="active" process-status="process" finish-status="success" simple>
                <el-step title="1 上传日志"></el-step>
                <el-step title="2 上传Profile"></el-step>
                <el-step title="3 完成" :status="active===2? 'success':''"></el-step>
            </el-steps>
        </div>
        <el-main>
            <div class="offline-wrapper" v-if="active===0">
                <el-upload
                    key="1"
                    :show-file-list="true"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :disabled="loading||disable"
                    :before-upload="beforeUpload"
                    :action="uploadAddress">
                    <div class="offline">
                        <div class="offline-icon">
                            <i v-bind:class="icon"></i>
                        </div>
                        <div class="offline-text">{{ text }}</div>
                    </div>
                </el-upload>
                <div style="margin-top: 10px">
                    <span>日志类型:</span>
                    <el-radio  :disabled="loading||disable" style="margin-left: 20px" v-model="logType" label="1">普通日志文件(默认)</el-radio>
                    <el-radio  :disabled="loading||disable" v-model="logType" label="2">Profile开启后生成的日志</el-radio>
                </div>

            </div>
            <div class="offline-wrapper" v-if="active===1">
                <el-upload
                    key="2"
                    :show-file-list="true"
                    :on-success="onSuccessProfile"
                    :on-error="onErrorProfile"
                    :disabled="loading||disable"
                    :before-upload="beforeUploadProfile"
                    :action="uploadprofile">
                    <div class="offline">
                        <div class="offline-icon">
                            <i v-bind:class="icon"></i>
                        </div>
                        <div class="offline-text">{{ text }}</div>
                    </div>
                </el-upload>
            </div>
            <el-result icon="success" title="上传成功" subTitle="" v-if="active===2">
                <template slot="extra">
                    <el-button type="primary" size="medium" @click="$router.push('/debug/'+id)">查看日志信息</el-button>
                </template>
            </el-result>
        </el-main>
        <el-footer style="background: #f5f7fa">
            <el-button style="margin-top: 12px;float: right"
                       @click="
                       ()=>{
                           active=1;
                           text='上传Profile';
                           disable=false;
                           icon= 'fa fa-upload'
                       }"
                       :disabled="disable1" v-if="active===0">
                下一步
            </el-button>
            <el-button style="margin-top: 12px;float: right;margin-left: 10px" @click="active=2" v-if="active===1&&skipVisible">跳过
            </el-button>
            <el-button style="margin-top: 12px;float: right" @click="active=2" :disabled="disable2" v-if="active===1">
                下一步
            </el-button>

        </el-footer>

    </el-container>

</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "OfflineDebug",
    data() {
        return {
            text: "上传日志",
            loading: false,
            icon: "fa fa-upload",
            id: -1,
            active: 0,
            disable: false,
            disable1: true,
            disable2: true,
            uploadprofile: '',
            skipVisible: true,
            logType:'1',
        }
    },
    methods: {
        onSuccess(response, file, fileList) {
            this.icon = "fa fa-check"
            this.text = '上传成功';
            this.id = response.uid
            this.disable1 = false
            this.disable = true
            this.loading = false
            this.uploadprofile = basic_url + '/uploadProfile?ltid=' + parseInt(response.uid)


        },
        onError(err, file, fileList) {
            this.loading = false;
            this.icon = 'fa fa-close';
            this.text = '上传失败，请重新上传';
            this.disable = false
        },
        beforeUpload(file) {
            this.loading = true;
            this.icon = 'fa fa-circle-o-notch fa-spin';
            this.text = '正在上传并解析中，请保持网络通畅';
            this.disable = true
        },

        onSuccessProfile(response, file, fileList) {
            this.icon = "fa fa-check"
            this.text = '上传成功';
            this.disable = true
            this.disable2 = false
            this.skipVisible = false
        },
        onErrorProfile(err, file, fileList) {
            this.loading = false;
            this.icon = 'fa fa-close';
            this.text = '上传失败，请重新上传';
            this.disable = false
            this.skipVisible = true
        },
        beforeUploadProfile(file) {
            this.loading = true;
            this.icon = 'fa fa-circle-o-notch fa-spin';
            this.text = '正在上传并解析中，请保持网络通畅';
            this.disable = true
            this.disable2 = true
            this.skipVisible = false
        },


    },
    computed: {
        uploadAddress: function () {
            return `${basic_url}/upload?username=${localStorage.getItem('token')}&logType=${this.logType}`
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
    flex-direction: column;
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
</style>
