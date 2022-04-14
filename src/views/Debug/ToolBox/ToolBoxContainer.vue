<template>
    <div class="tool-box-container">
        <div style="position: relative">
            <transition
                name="fade-in-linear">
                <DebugTraceBoard
                    :debug-traces="traceData"
                    v-show="showTraceBoard"
                    @close="showTraceBoard=false"
                    @setAsStart="setAsStart"
                    @jumpByAddress="jumpByAddress"
                />
            </transition>
        </div>
        <!-- 搜索框-->
        <SearchToolBox
            ref="searchToolBox"
            id="searchToolBox"
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
            id="paintToolBox"
            :trace-data="traceData"
            :set-trace-data-processed="setTraceDataProcessed"
            :draw-path="drawPath"
            @showTrace="showTraceBoard=true"
        />


    </div>
</template>

<script>


import SearchToolBox from "@/views/Debug/ToolBox/SearchToolBox";
import PaintToolBox from "@/views/Debug/ToolBox/PaintToolBox";
import DebugTraceBoard from "@/views/Debug/OnlineDebugComponent/DebugTraceBoard";

export default {
    name: "ToolBoxContainer",
    components: {DebugTraceBoard, PaintToolBox, SearchToolBox},
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
            showTraceBoard: false,
        }
    },
    methods: {
        //*********状态设置Function********
        /**
         * 由父组件传来address，设置searchToolBox中的address
         * @param address
         */
        setAddress(address) {
            this.$refs.searchToolBox.expandSearch = true
            this.$refs.searchToolBox.searchType = '1'
            this.$refs.searchToolBox.searchText = address
        },
        setAsStart(address){
            this.$refs.paintToolBox.startAddress = address
        },
        jumpByAddress(address){
            this.$emit("jumpByAddress",address)
        }

    },
    mounted() {
        //设置debugBoard位置
        let board = document.getElementById("debug-trace-board")
        let searchbox = document.getElementById("searchToolBox")

        board.style.left = searchbox.clientWidth+10+'px'
        board.style.top = '0px'

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