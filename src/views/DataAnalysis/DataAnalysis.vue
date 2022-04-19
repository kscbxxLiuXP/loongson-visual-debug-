<template>
    <el-container>
        <el-aside width="150">
            <el-menu
                style="height: 100%;"
                default-active="1"
               >
                <el-menu-item index="1" @click="scrollToView('basicInfo')">
                    <i class="el-icon-document"></i>
                    <span slot="title">基本信息</span>

                </el-menu-item>
                <el-menu-item index="2" @click="scrollToView('instruction-analysis')">
                    <i class="el-icon-document"></i>
                    <span  slot="title">指令翻译分析</span>
                </el-menu-item>
                <el-menu-item index="3" @click="scrollToView('tb-analysis')">
                    <i class="el-icon-document"></i>
                    <span slot="title">TB块分析</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <DataAnalysisBasicInfo id="basicInfo" :ltlog="this.ltlog"/>
            <el-divider></el-divider>
            <InstructionAnalysis :id="id"/>
            <el-divider></el-divider>
            <TBAnalysis :id="id"/>
        </el-main>


    </el-container>
</template>

<script>
import {basic_url} from "@/request/request";
import DataAnalysisBasicInfo from "@/views/DataAnalysis/Components/DataAnalysisBasicInfo";
import InstructionAnalysis from "@/views/DataAnalysis/Components/InstructionAnalysis/InstructionAnalysis";
import TBAnalysis from "@/views/DataAnalysis/Components/TBAnalysis/TBAnalysis";

export default {
    name: "DataAnalysis",
    components: {TBAnalysis, InstructionAnalysis, DataAnalysisBasicInfo},
    props: ['id'],
    data() {
        return {
            ltlog: {},
        }
    },
    methods: {
        scrollToView(viewid){
            // 获取点击的按钮对应页面的id
            var view = document.getElementById(viewid)

            view.scrollIntoView()
        },
        getData() {
            this.$axios.get(basic_url + "/ltLogAnalysis/getOne",
                {
                    params:
                        {
                            ltid: this.id,
                        }
                }
            ).then(e => {
                    this.ltlog = e.data.ltlog
                }
            )
        },



    },
    mounted() {
        this.getData()

    }
}
</script>

<style scoped>
h3 {
    margin: 0;
}


</style>