<template>
    <div class="tool-box-container">
        <!-- 搜索框-->
        <SearchToolBox
            ref="searchToolBox"
            :ltid="ltid"
            :clear-select="clearSelect"
            :selectSearch="selectSearch"
            :set-loading="setLoading"
            :set-keyword="setKeyword"
            :jump-t-b-and-select="jumpTBAndSelect"
        />
        <!-- 跟踪流表单       -->
        <PaintToolBox
            v-if="traced"
            ref="paintToolBox"
            :trace-data="traceData"
            :set-trace-data-processed="setTraceDataProcessed"
            :draw-path="drawPath"
        />
    </div>
</template>

<script>


import SearchToolBox from "@/views/Debug/ToolBox/SearchToolBox";
import PaintToolBox from "@/views/Debug/ToolBox/PaintToolBox";
export default {
    name: "ToolBoxContainer",
    components: {PaintToolBox, SearchToolBox},
    props: [
        //data
        'ltid',
        'ltlog',
        'traceData',
        'traced',

        /*
            function
         */
        //父组件清除选中状态
        'clearSelect',
        //父组件选中关键字
        'selectSearch',
        //父组件更新loading状态
        'setLoading',
        //父组件更新keyword(用于选中关键字)
        'setKeyword',
        //跳转到TB并且选择
        'jumpTBAndSelect',
        //设置画图所需的数据
        'setTraceDataProcessed',
        //画路径
        'drawPath',

    ],
    data() {
        return {

        }
    },
    methods: {
        //*********状态设置Function********
        /**
         * 由父组件传来address，设置searchToolBox中的address
         * @param address
         */
        setAddress(address){
            this.$refs.searchToolBox.expandSearch=true
            this.$refs.searchToolBox.searchType = '1'
            this.$refs.searchToolBox.searchText = address
        }

    }


}
</script>

<style scoped>
.tool-box-container {
    position: absolute;
    top: 20px;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

</style>