<template>
    <el-container style="margin: 0;padding: 0;transition: all 300ms ease-in-out">
        <div>
            <el-steps v-if="profileType==='1'" :active="active" process-status="process" finish-status="success" simple>
                <el-step title="1 上传日志"></el-step>
                <el-step v-if="profileType==='1'" title="2 上传Profile(可以跳过)"></el-step>
                <el-step title="3 完成" :status="active===2? 'success':''"></el-step>
            </el-steps>
            <el-steps v-else :active="active" process-status="process" finish-status="success" simple>
                <el-step title="1 上传日志"></el-step>
                <el-step title="2 完成" :status="active===2? 'success':''"></el-step>
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
                    <span>Profile:</span>
                    <el-radio :disabled="loading||disable" style="margin-left: 20px" v-model="profileType" label="1">
                        单独上传(默认)
                    </el-radio>
                    <el-radio :disabled="loading||disable" v-model="profileType" label="2">
                        Attach在dump文件中
                        <el-popover
                            placement="top"
                            title="提示"
                            width="200"
                            trigger="hover"
                            content="dump和profile在一个文件中">
                            <i slot="reference" class=" el-icon-warning-outline"></i>
                        </el-popover>
                    </el-radio>
                </div>
                <div style="margin-top: 10px">
                    <span>日志类型:</span>
                    <el-radio :disabled="loading||disable" style="margin-left: 20px" v-model="logType" label="1">
                        普通日志文件(默认)
                    </el-radio>
                    <el-radio :disabled="loading||disable" v-model="logType" label="2">Profile开启后生成的日志
                        <el-popover
                            placement="top"
                            title="提示"
                            width="300"
                            trigger="hover"
                            content="即开启编译选项 --enable-latx-profiler 所产生的log文件">
                            <i slot="reference" class=" el-icon-warning-outline"></i>
                        </el-popover>
                    </el-radio>


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
                           if(profileType==='2'){
                               active=2
                           }else{
                               active=1;
                           }
                           text='上传Profile';
                           disable=false;
                           icon= 'fa fa-upload'
                       }"
                       :disabled="disable1" v-if="active===0">
                下一步
            </el-button>
            <el-button style="margin-top: 12px;float: right;margin-left: 10px" @click="active=2"
                       v-if="active===1&&skipVisible">跳过
            </el-button>
            <el-button style="margin-top: 12px;float: right" @click="active=2" :disabled="disable2" v-if="active===1">
                下一步
            </el-button>

        </el-footer>

    </el-container>

</template>

<script>
import {basic_url,upload_websocket} from "@/request/request";

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
            logType: '1',
            profileType: '1',
            uuid: '',
            websock: null,
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
            this.uploadprofile = `${basic_url}/uploadProfile?ltid=${parseInt(response.uid)}&uuid=${this.uuid}`


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
        initWebSocket() {
            this.websock = new WebSocket(upload_websocket + this.uuid)
            this.websock.onmessage = this.websocketonmessage
            this.websock.onerror = this.websocketonerror
            this.websock.onopen = this.websocketonopen
            this.websock.onclose = this.websocketclose

        },
        // 连接建立之后执行send方法发送数据
        websocketonopen() {
            console.log("连接socket")
        },
        websocketonerror() {
            console.log('WebSocket连接失败')
        },
        // 数据接收
        websocketonmessage(e) {
            //处理各种数据
            console.log(e.data)
            this.text=e.data

        },
        // 数据发送
        websocketsend(Data) {
            this.websock.send(Data)
        },
        // 关闭
        websocketclose(e) {
            console.log('已关闭连接', e)
        },

    },
    mounted() {
        this.uuid = this.$util.uuid()
        this.initWebSocket()
        console.log(this.uuid)
    },
    computed: {
        uploadAddress: function () {
            return `${basic_url}/upload?username=${localStorage.getItem('token')}&logType=${this.logType}&profileType=${this.profileType}&uuid=${this.uuid}`
            // return `${basic_url}/upload?username=${localStorage.getItem('token')}&logType=${this.logType}&profileType=${this.profileType}`
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
