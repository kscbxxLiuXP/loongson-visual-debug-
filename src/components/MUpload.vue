<template>
    <div class="upload-wrapper">
        <el-upload
            :show-file-list="false"
            :on-success="onSuccess"
            :on-error="onError"
            :before-upload="beforeUpload"
            :disabled="uploading"
            :action="address+'&uuid='+uuid">
            <div v-bind:class="small?'uploadd-small':'uploadd'">
                <div v-bind:class="small?'uploadd-icon-small':'uploadd-icon'">
                    <i v-bind:class="icon"></i>
                </div>
                <div v-bind:class="small?'uploadd-text-small':'uploadd-text'">{{ text }}</div>
            </div>

        </el-upload>
    </div>
</template>

<script>
import {upload_websocket} from "@/request/request";

export default {
    name: "MUpload",
    props: ['successCallback', 'tipText', 'address', 'failCallback', 'beforeUploadCallback', 'small'],
    data() {
        return {
            uploading: false,
            icon: "fa fa-upload",
            text: "上传" + this.tipText + "文件",
            uuid: '',
            websock: null,
        }
    },
    methods: {
        // eslint-disable-next-line no-unused-vars
        onSuccess(response, file, fileList) {
            this.icon = "fa fa-check"
            this.text = '上传成功！';
            clearTimeout(this.timer);  //清除延迟执行
            this.timer = setTimeout(() => {   //设置延迟执行
                this.uploading = false
                this.successCallback(response)
            }, 1500);
        },
        // eslint-disable-next-line no-unused-vars
        onError(err, file, fileList) {
            this.uploading = false;
            this.icon = 'fa fa-close';
            this.text = '重新上传' + this.tipText + '文件';
            if (this.failCallback)
                this.failCallback()
        },
        // eslint-disable-next-line no-unused-vars
        beforeUpload(file) {
            this.uploading = true;
            this.icon = 'fa fa-circle-o-notch fa-spin';
            this.text = '正在上传' + this.tipText + '并解析中，请保持网络通畅';
            if (this.beforeUploadCallback)
                this.beforeUploadCallback()
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
            this.text = e.data

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
}
</script>

<style scoped>
.upload-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.uploadd {
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

.uploadd-small {
    width: 250px;
    height: 100px;
    /*border: #ff8d02 1px solid;*/
    border-radius: 10px;
    background-color: #f7f8f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 300ms;
}

.uploadd-icon {
    text-align: center;
    font-size: 80px;
}

.uploadd-icon-small {
    text-align: center;
    font-size: 40px;
}

.uploadd-text {
    margin-top: 20px;
    text-align: center;
    font-size: 25px;
}

.uploadd-text-small {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
}

.uploadd:hover {
    background-color: #fcce9e;
    color: white;
    cursor: pointer;
}

.uploadd-small:hover {
    background-color: #fcce9e;
    color: white;
    cursor: pointer;
}
</style>