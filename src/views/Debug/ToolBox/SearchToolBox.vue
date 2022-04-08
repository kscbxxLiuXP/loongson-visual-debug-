<template>
    <div class="search-box">
        <div class="box-title">
            <div>搜索</div>
            <div class="expand-button" @click="expandSearch=!expandSearch" v-if="expandSearch">
                <i class="fa fa-chevron-up"/>
            </div>
            <div class="expand-button" @click="expandSearch=!expandSearch" v-if="!expandSearch">
                <i class="fa fa-chevron-down"/>
            </div>
        </div>

        <div class="search-body" :style="{maxHeight: expandSearch?'100px':0}">
            <transition name="shadow-transition">
                <div class='popContainer' v-if="loading"/>
            </transition>
            <el-input size="mini" placeholder="搜索内容" v-model="searchText" style="width: 280px;border-radius: 0"
                      clearable>
                <el-select v-model="searchType" slot="prepend" style="width: 80px">
                    <el-option label="地址" value="1"></el-option>
                    <el-option label="指令" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="onSubmitSearch()"></el-button>
            </el-input>

            <!--搜索结果-->
            <div style="position: relative;display: flex;align-items: center;padding: 10px 0">
                <svg id="load" x="0px" y="0px" viewBox="0 0 150 150" :style="{ width: loading?'30px':'0' }"
                     style="transition: all 300ms">
                    <circle id="loading-inner" cx="75" cy="75" r="45"/>
                </svg>
                <input type="number" placeholder="请输入"
                       :disabled="resultsNum===0||loading"
                       :min="1"
                       :max="resultsNum"
                       style="width: 60px;margin-left: 10px"
                       @keyup.enter="currentSearchChange"
                       v-model="inputCurrentSearch"/>
                <div style="margin-left: 10px">
                    / {{ resultsNum === 0 ? '--' : toThousand(resultsNum) }}
                </div>
                <div style="margin-left: 20px;display: flex;align-items: center">
                    <div v-bind:class="(resultsNum===0||loading)?'disabled-button':'expand-button'"
                         @click="previousResult">
                        <i class="el-icon-arrow-up"/>
                    </div>
                    <div v-bind:class="(resultsNum===0||loading)?'disabled-button':'expand-button'"
                         @click="nextResult">
                        <i class="el-icon-arrow-down"/>
                    </div>
                    <div v-bind:class="loading?'disabled-button':'expand-button'" @click="onClearSearch">
                        <i class="el-icon-close"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "SearchToolBox",
    props: [
        //data
        'ltid',

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
    ],
    data() {
        return {
            //当前search是否展开
            expandSearch: false,
            searchType: '1',
            //搜索框内容
            searchText: '',
            //当前搜索位置
            inputCurrentSearch: '',
            //在搜索中
            loading: false,
            //搜索结果
            searchResults: [],
            //当前搜索位置
            currentSearch: 1,
            //搜索结果数量
            resultsNum: 0,
            //关键词，用于选中
            keywords: ''
        }
    },
    methods: {
        //搜索函数
        onSubmitSearch() {
            //判断是否为空
            if (this.searchText === '') {
                this.$message.error("搜索不可以为空")
                return
            }
            //搜索前先清楚上一次搜索的结果
            this.clearSelect()
            this.currentSearch = 1
            this.resultsNum = 0
            this.searchResults = []
            this.inputCurrentSearch = 1
            //设置关键词
            this.keywords = this.searchText
            this.setKeyword(this.searchText)
            //设置加载状态
            //本页面加载
            this.loading = true
            //TB页面加载
            this.tbloading = true
            this.setLoading(true)
            if (this.searchType === '1') {
                this.searchAddress()
            } else {
                this.searchInstruction()
            }

        },
        searchAddress() {
            this.$axios.get(basic_url + '/debug/search/address', {
                params: {
                    ltid: this.ltid,
                    address: this.searchText,
                    skipHead: true
                }
            }).then(e => {
                if (e.data.total === 0) {
                    this.$message.success("没有查询到结果")
                    this.tbloading = false
                    this.loading = false
                    this.setLoading(false)
                    return
                }
                this.searchResults = e.data.results
                this.resultsNum = e.data.total
                this.selectSearch()
                this.loading = false
                this.tbloading = false
                this.setLoading(false)

            })
        },
        searchInstruction() {
            this.$axios.get(basic_url + '/debug/search/instruction', {
                params: {
                    type: 1,
                    ltid: this.ltid,
                    instruction: this.searchText,
                    skipHead: true
                }
            }).then(e => {
                if (e.data.total === 0) {
                    this.$message.success("没有查询到结果")
                    this.tbloading = false
                    this.loading = false
                    this.setLoading(false)
                    return
                }
                this.searchResults = e.data.results
                this.resultsNum = e.data.total
                this.selectSearch()
                this.loading = false
                this.tbloading = false
                this.setLoading(false)
            })

        },
        previousResult() {
            if (this.currentSearch === 1) {
                this.currentSearch = this.resultsNum
            } else {

                this.currentSearch--;
            }
            this.inputCurrentSearch = this.currentSearch
            this.jumpTarget(this.currentSearch)

        },
        nextResult() {
            if (this.currentSearch === this.resultsNum) {
                this.currentSearch = 1
            } else {
                this.currentSearch++;
            }
            this.inputCurrentSearch = this.currentSearch
            this.jumpTarget(this.currentSearch)
        },
        //用户改变当前搜索结果位置
        currentSearchChange() {
            if (parseInt(this.inputCurrentSearch) > this.resultsNum) {
                this.inputCurrentSearch = this.resultsNum
            }
            this.currentSearch = this.inputCurrentSearch
            this.jumpTarget(this.currentSearch)
        },
        /**
         * 由搜索结果index得到TBID并且跳转
         * @param resultIndex
         */
        jumpTarget(resultIndex) {
            //印射相差1
            let resultT = this.searchResults[resultIndex - 1]
            let tbid = resultT.tbid
            let selectID = resultT.selectID
            this.jumpTBAndSelect(tbid, selectID)
        },
        //清空搜索结果
        onClearSearch() {
            //清楚本组件状态
            this.currentSearch = 1
            this.resultsNum = 0
            this.searchResults = []
            this.keywords = ''
            this.searchText = ''
            this.inputCurrentSearch = 1
            //清楚TB组件选择状态
            this.setKeyword('')
            this.clearSelect()
            this.$message.success("已重置搜索")
        },
        //工具类
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
    }
}
</script>

<style scoped>
.disabled-button {
    color: #c3c4c4;
    pointer-events: none;
}

.expand-button {
    text-align: center;
    font-size: 14px;
    color: #89898c;
    background-color: white;
    padding: 5px;
    border-radius: 50px;
    transition: all 300ms;
}

.expand-button:hover {
    background-color: #ebebec;
}

.expand-button:active {
    background-color: #d3d3d4;
}


.box-title {
    color: #727275;
    border-bottom: #dadce0 1px solid;;
    padding: 5px 20px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-body {
    overflow-y: hidden;
    transition: all 300ms;
    position: relative;
}

.search-box {
    display: flex;
    flex-direction: column;
    background-color: white;

    border: #dbdcdd 1px solid;

    border-radius: 5px;
}

.shadow-transition-enter,
.shadow-transition-leave-to {
    opacity: 0;
}

.shadow-transition-enter-active,
.shadow-transition-leave-active {
    transition: all 0.4s ease;
}

#load {
    z-index: 9;
    width: 30px;
    animation: loading 3s linear infinite;
}

#load #loading-inner {
    stroke-dashoffset: 0;
    stroke-dasharray: 200;
    stroke-width: 5;
    stroke-miterlimit: 5;
    stroke-linecap: round;
    animation: loading-circle 2s linear infinite;
    stroke: #00adb5;
    fill: transparent;
}

@keyframes loading {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes loading-circle {
    0% {
        stroke-dashoffset: 0;
    }
    100% {
        stroke-dashoffset: -400;
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
input {
    font-size: 14px;
    border: none;
    border-bottom: #a1a1a1 1px solid;
    text-align: right;
    transition: all 300ms
}

input:hover {
    outline: 0;
    border-bottom: #40a9ff 1px solid;

}

input:focus {
    outline: 0;
    border-bottom: #1e94ff 1px solid;

}
input:disabled {
    outline: 0;
    cursor: not-allowed;
    background-color: white;
    border-bottom: #a1a1a1 1px solid;


}
</style>