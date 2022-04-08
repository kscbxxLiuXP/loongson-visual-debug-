<template>
    <el-container style="padding: 0">
        <el-header style="padding: 0;line-height: 35px;height: 35px">
            <OnlineDebugToolBar
                :id="id"
                :show-console="showConsole"
                :logg="logg"
                @close="()=>{showConsole=!showConsole}"
                @newTraceArrive="newTraceArrive"
            />
        </el-header>
        <el-main style="margin: 0;padding: 0;margin-top: 1px">
            <OnlineDebugBody ref="onlineDebugBody" :ltid="ltid" />

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

import Logger from "@/components/Logger/Logger";
import OnlineDebugToolBar from "@/views/Debug/OnlineDebugComponent/OnlineDebugToolBar";
import OnlineDebugBody from "@/views/Debug/OnlineDebugComponent/OnlineDebugBody";


export default {
    name: "OnlineDebug",
    components: {OnlineDebugBody, OnlineDebugToolBar, Logger},
    props: ['id'],
    data() {
        return {
            showConsole: true,
        }
    },
    methods: {
        newTraceArrive() {
            this.$refs.onlineDebugBody.newTraceArrive()
        },
        logg(content) {
            this.$refs.logger.log(content)
        },
    },
    mounted() {

    },
    computed: {
        ltid: function () {
            return parseInt(this.$route.query.ltid)
        }
    }


}
</script>

<style scoped>


</style>