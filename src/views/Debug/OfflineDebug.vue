<template>
    <div class="offline-wrapper">
        <el-upload
            :show-file-list="true"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="loading"
            :before-upload="beforeUpload"
            :action="uploadAddress">
            <div class="offline">
                <div class="offline-icon">
                    <i v-bind:class="icon"></i>
                </div>
                <div class="offline-text">{{ text }}</div>
            </div>

        </el-upload>
    </div>
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
        }
    },
    methods: {
        // eslint-disable-next-line no-unused-vars
        onSuccess(response, file, fileList) {
            this.icon = "fa fa-check"
            this.text = '上传成功，正在跳转到调试界面';
            clearTimeout(this.timer);  //清除延迟执行
            this.timer = setTimeout(() => {   //设置延迟执行
                this.text = '';
                var id = response.uid
                this.$router.push('/debug/' + id)
            }, 1500);
        },
        // eslint-disable-next-line no-unused-vars
        onError(err, file, fileList) {
            this.loading = false;
            this.icon = 'fa fa-close';
            this.text = '上传失败，请重新上传';
        },
        // eslint-disable-next-line no-unused-vars
        beforeUpload(file) {
            this.loading = true;
            this.icon = 'fa fa-circle-o-notch fa-spin';
            this.text = '正在上传并解析中，请保持网络通畅';
        },
        jump(id) {
            this.$router.push('/debug/' + id)
        },

    },
    computed: {
        uploadAddress: function () {
            return basic_url + '/upload?username=' + localStorage.getItem('token')
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
</style>
