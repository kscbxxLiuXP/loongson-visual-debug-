<template>
    <el-container id="debug-container">
        <el-aside :style="{width:width}" class="lf" ref="letfDom">
            <ToolBoxContainer
                ref="toolbox"
                :ltid="this.id"
                :clear-select="clearSelect"
                :selectSearch="selectSearch"
                :set-loading="setLoading"
                :set-keyword="setKeyword"
                :jump-t-b-and-select="jumpTBAndSelect"
                :trace-data="traceData.tracelist"
                :traced="ltlog.traced"
                :set-trace-data-processed="setTraceDataProcessed"
                :draw-path="drawPath"
                @jumpByAddress="jumpByAddress"

            />
            <div v-if="!ltlog.traced" class="trace-upload">
                <MUpload
                    :small="true"
                    :address="uploadAddress()"
                    :tip-text="'Trace'"
                    :success-callback="successcallBack"
                />
            </div>
            <Trace ref="trace" :trace-data-processed="traceDataProcessed" v-if="ltlog.traced" :jump-t-b="jumpTB"/>


            <div class="touch-div" ref="moveDom" @click="clickExpand">
                <i v-if="expand" class="el-icon-arrow-left"/>
                <i v-if="!expand" class="el-icon-arrow-right"/>
                <!--<div class="circle" :key="'circle'+i" v-for=" i in 6"></div>-->
            </div>
        </el-aside>
        <el-container class="rt">
            <el-main class="load-container">
                <!-- 遮罩 -->
                <transition name="shadow-transition">
                    <div class='popContainer' v-show="tbloading"></div>
                </transition>
                <!--加载动画-->
                <div class="boxLoading" v-show="tbloading"/>
                <!--主体-->
                <div id="scroll-body" style="height: 100%;overflow-y: scroll" class="target-scroll">
                    <div style="position: sticky;top: 0;padding: 5px 0;z-index: 3;background: white">
                        <div
                            style="background-color: #f7f8f9;padding: 5px;font-size: 14px;display: flex;align-items: center;border-radius: 10px;border: #e6e6e6 1px solid;">
                            <div style="line-height: 30px;margin-left: 10px">
                                日志文件共{{ toThousand(ltlog.line) }}行， 解析了共{{ toThousand(simpleTbBlocks.length) }}个TB块
                            </div>
                            <el-button size="mini" style="margin-left: 10px" @click="clickHeadM">跳转到日志头部</el-button>
                            <el-button size="mini" style="margin-left: 10px" @click="clickJumpTB">跳转到TB块</el-button>
                            <el-button size="mini" style="margin-left: 10px" @click="clickShowDrawer">已固定TB块</el-button>
                        </div>
                    </div>

                    <!---------TB块头部 ST--------->
                    <div id="lt-head" class="lt-head" v-if="currentPage===1">
                        <div class="tbblock-title">
                            <div style="display: flex;margin-left: 10px">
                                <div
                                    style="width: 6px;height: 6px;background-color: #c2c2c2;border-radius: 100px;margin-left: 3px"
                                    :key="i" v-for="i in 3"/>
                            </div>
                            <div style="margin-left: 10px;display: flex;align-items: center">
                                <div>
                                    头部信息
                                </div>
                                <div>
                                    <el-button style="margin-left: 10px" size="mini" @click="hideTheHead()">{{
                                            hideHead ? '显示头部信息' : '隐藏头部信息'
                                        }}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <div v-if="!hideHead">
                            <div v-bind:id="'head-line-'+index" :key="'head'+index"
                                 style="font-size: 16px"
                                 v-for="(item,index) in head.headtext">
                                {{ item }}
                            </div>
                        </div>
                    </div>
                    <!---------TB块头部 ED--------->
                    <!---------整个TB块ST--------->
                    <TBBlockBody
                        :tbblock-data="tbBlocks"
                        @fixBlock="fixBlock"
                        @addressClick="addressClick"
                        @getRegisterInfoFromTrace="getRegisterInfoFromTrace"

                    />

                    <!---------整个TB块ED--------->
                </div>

            </el-main>
            <!---------悬浮分页组件ST--------->
            <div
                v-if="!expand"
                style="position: absolute;bottom: 10px;background-color: #f7f8f9;left: calc(50% - 300px);padding: 5px 10px;border-radius: 10px;display: flex;align-items: center;z-index: 99">
                <div style="background-color: white;padding: 6px 10px;font-size: 14px">{{ getTbBlockRange() }}</div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <!---------悬浮分页组件ED--------->
            <el-backtop target=".target-scroll"></el-backtop>
        </el-container>
        <!---------浮动内存空间ST--------->
        <MemoryFloat v-if="!expand" @clickHeadM="clickHeadM" :tb-mem-height="tbMemHeight"
                     :simple-tb-blocks="simpleTbBlocks"
                     @jumpTB="jumpTB"/>
        <!---------浮动内存空间ED--------->
        <TBDrawer
            @clearblock="clearblock"
            :show-drawer="showDrawer"
            :fixblocks="fixblocks"
            @close="()=>{this.showDrawer=false}"
            @addressClick="addressClick"

        />

    </el-container>
</template>

<script>
import {basic_url} from "@/request/request";
import Mark from "mark.js";
import ToolBoxContainer from "@/views/Debug/ToolBox/ToolBoxContainer";
import MUpload from "@/components/MUpload";
import Trace from "@/components/Trace/Trace";
import MemoryFloat from "@/views/Debug/OfflineDebugComponent/MemoryFloat";
import TBDrawer from "@/views/Debug/OfflineDebugComponent/TBDrawer";
import './tbblock.css'
import TBBlockBody from "@/views/Debug/OfflineDebugComponent/TBBlockBody";
import DebugTraceBoard from "@/views/Debug/OnlineDebugComponent/DebugTraceBoard";

export default {
    name: "Debug",
    components: {DebugTraceBoard, TBBlockBody, TBDrawer, MemoryFloat, Trace, MUpload, ToolBoxContainer},
    props: ['id'],
    data() {
        return {
            fixblocks: [],
            hideHead: true,
            currentPage: 1,
            pages: 0,
            pageSize: 20,
            total: 0,
            tbMemHeight: '0.1px',
            tbloading: true,
            loading: true,

            simpleTbBlocks: [],
            head: {
                headtext: '',
                ltid: '',
                uid: '',
            },
            addressIndexMap: {},
            ltlog: {
                filename: '',
                headid: '',
                line: '',
                size: '',
                traced: false,
                traceid: '-1',
                uid: '',
                uploadtime: '',
                userid: '',

            },
            tbBlocks: [],
            keywords: '',
            expand: false,
            showDrawer: false,
            //选中IR1之后需要记录的信息
            currentTB: -1,
            selectIR2Start: -1,
            selectIR2End: -1,
            letfDom: null,
            clientStartX: 0,
            width: '50%',

            //原始的所有trace数据
            traceData: [],
            //已经处理过的，用于画图的数据
            traceDataProcessed: {
                nodes: [
                    {id: '', address: '', tbaddress: '', tbindex: '', tbtype: '',},
                ],
                edges: [
                    {source: '', target: ''},
                ],
            },

        }
    },
    methods: {

        //从Trace文件中获取一个TB块的寄存器信息
        getRegisterInfoFromTrace(address, callback) {

            let tracelist = this.traceData.tracelist
            if (tracelist == null) {
                callback(null)
                return
            }
            let registers = null
            for (let i = 0; i < tracelist.length; i++) {
                let trace = tracelist[i]
                console.log(trace.address + " " + address)
                if (trace.address === address) {
                    registers = trace.registers
                    break
                }
            }
            callback(registers)

        },

        //**********父子组件通信函数**********
        /**
         * 设置TBContainer的loading状态，参数由子组件传入
         * @param loading
         */
        setLoading(loading) {
            this.tbloading = loading
        },
        /**
         * 设置选中的关键字，由子组件更新
         * @param keyword
         */
        setKeyword(keyword) {
            this.keywords = keyword
        },
        /**
         * 由子组件TraceToolBox调用此函数，更新Trace图所需的data
         */
        setTraceDataProcessed(traceDataProcessed) {
            this.traceDataProcessed = traceDataProcessed
        },
        /**
         *
         */
        drawPath() {
            this.$refs.trace.drawPath()
        },

        //**********状态设置函数**********
        hideTheHead() {
            this.hideHead = !this.hideHead
        },
        clickShowDrawer() {
            this.showDrawer = true
        },
        clickExpand() {
            if (this.width === '50%') {
                this.width = '100%'
                this.expand = true
            } else {
                this.width = '50%'
                this.expand = false
            }
            setTimeout(() => {
                let width = this.$refs.letfDom.$el.clientWidth
                let height = this.$refs.letfDom.$el.clientHeight
                this.$refs.trace.resetSize(width, height)
            }, 100)


        },

        //**********搜索相关函数**********
        /**
         * 清除TB块中选中的关键字
         */
        clearSelect() {
            document.getElementsByName("tbblock").forEach(e => {
                var instance = new Mark(e)
                instance.unmark();
            })
        },
        /**
         * 选中TB块中的关键字，在调用函数前应该先设置keyword
         */
        selectSearch() {
            document.getElementsByName("tbblock").forEach(e => {
                var instance = new Mark(e)
                instance.mark(this.keywords);
            })
        },

        //*********Trace文件上传函数********
        successcallBack(response) {
            let trace = response
            this.ltlog.traced = true
            this.traceData = trace
        },

        uploadAddress: function () {
            return basic_url + '/uploadTrace?ltid=' + this.id
        },
        //*********Trace文件上传函数********
        /**
         * 取消固定TB块
         * @param block
         */
        clearblock(block) {
            let a = this.fixblocks.indexOf(block)
            this.fixblocks.splice(a, 1)
            this.$message.success("已取消固定")
        },
        /**
         * 固定TB块
         * @param block
         */
        fixBlock(block) {
            var exist = false
            this.fixblocks.forEach(e => {
                if (e.tbindex === block.tbindex) {
                    exist = true
                }
            })
            if (exist) {
                this.$message.info("此块已固定！")
            } else {

                this.fixblocks.push(block)
                this.$message.success("固定成功！")
            }
        },
        /**
         * 点击TB块中的地址
         * 同步更新子组件中输入框的内容
         * @param address
         */
        addressClick(address) {
            this.$refs.toolbox.setAddress(address)
        },

        getTbBlockRange() {
            var c = this.currentPage
            let start = (c - 1) * 20
            let end = c * 20 - 1
            let s = 'TB-' + start + ' ~ TB-' + end
            return s
        },
        //点击head事件(由子组件MemoryFloat emit触发)
        clickHeadM() {
            //不在当前页面
            //需要刷新数据
            // 请求数据之后
            this.currentPage = 1
            this.loading = true
            let that = this
            this.tbloading = true
            this.$axios.get(basic_url + '/tbblocks',
                {
                    params:
                        {
                            id: this.id,
                            currentPage: 1,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                this.clearSelect()
                // console.log(e)

                that.tbBlocks = e.data.records
                this.selectSearch()
            }).then(e => {
                that.tbloading = false
                that.loading = false
                document.getElementById("lt-head").scrollIntoView()
                document.getElementById("scroll-body").scrollBy(0, -80)
            })
        },
        clickJumpTB() {
            this.$prompt('请输入你想要跳转的TB块ID', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                if (isNaN(parseInt(value))) {
                    this.$message.error("请输入数字")
                    return
                }
                if (parseInt(value) > this.simpleTbBlocks.length) {
                    this.$message.error("超出范围！")
                    return;
                }
                this.jumpTB(value)
                this.$message({
                    type: 'success',
                    message: '跳转成功'
                });
            })
        },
        jumpByAddress(address) {
            //根据address获取tbindex
            let id = this.addressIndexMap[address]
            if (id === undefined) {
                this.$message.error("跳转错误！没有找到这个TB块")
            } else {
                this.jumpTB(id)
            }

        },
        jumpTB(tbindex) {
            /*
            获取TB块处于第几页
            一共total个
            一页pageSize个
            例子：
            pagesize:20
            0-1,19-1
             */
            // console.log(this.pageSize)
            let nextpage = Math.floor(tbindex / this.pageSize) + 1
            if (this.currentPage === nextpage) {
                //就在当前页面
                //直接跳转元素
                // 获取文档中 id="demo" 的元素：
                // console.log("#TB-" + tbindex)
                document.getElementById("TB-" + tbindex).scrollIntoView()
                document.getElementById("scroll-body").scrollBy(0, -100)
            } else {
                //不在当前页面
                //需要刷新数据
                // 请求数据之后
                this.currentPage = nextpage
                this.tbloading = true
                let that = this
                this.$axios.get(basic_url + '/tbblocks',
                    {
                        params:
                            {
                                id: this.id,
                                currentPage: nextpage,
                                limit: this.pageSize
                            }
                    }
                ).then(e => {
                    this.clearSelect()
                    // console.log(e)

                    that.tbBlocks = e.data.records

                }).then(e => {
                    this.selectSearch()
                    that.tbloading = false
                    document.getElementById("TB-" + tbindex).scrollIntoView()
                    document.getElementById("scroll-body").scrollBy(0, -100)
                })
            }
        },
        /**
         * 跳转到对应的tb块并且选中
         * @param tbindex
         * @param selectID
         */
        jumpTBAndSelect(tbindex, selectID) {
            /*
            获取TB块处于第几页
            一共total个
            一页pageSize个
            例子：
            pagesize:20
            0-1,19-1
             */
            // console.log(this.pageSize)
            let nextpage = Math.floor(tbindex / this.pageSize) + 1
            if (this.currentPage === nextpage) {
                document.getElementById(selectID).scrollIntoView()
                document.getElementById("scroll-body").scrollBy(0, -500)
            } else {
                //不在当前页面
                //需要刷新数据
                // 请求数据之后
                this.currentPage = nextpage
                this.tbloading = true
                let that = this
                this.$axios.get(basic_url + '/tbblocks',
                    {
                        params:
                            {
                                id: this.id,
                                currentPage: nextpage,
                                limit: this.pageSize
                            }
                    }
                ).then(e => {
                    this.clearSelect()
                    that.tbBlocks = e.data.records
                }).then(e => {
                    this.selectSearch()
                    that.tbloading = false
                    document.getElementById(selectID).scrollIntoView()
                    document.getElementById("scroll-body").scrollBy(0, -500)
                })
            }
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

            this.tbloading = true
            this.$axios.get(basic_url + '/tbblocks',
                {
                    params:
                        {
                            id: this.id,
                            currentPage: this.currentPage,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                // console.log(e)
                this.tbloading = false
                this.tbBlocks = e.data.records
                this.total = e.data.total
                this.pages = e.data.pages
            })
        },
        moveHandle(nowClientX, letfDom) {
            let computedX = nowClientX - this.clientStartX;
            let leftBoxWidth = parseInt(this.width);
            let changeWidth = leftBoxWidth + computedX;

            if (changeWidth < 280) {
                changeWidth = 280;
            }

            if (changeWidth > 800) {
                changeWidth = 800;
            }
            let width = changeWidth + "px"
            this.width = width

            this.clientStartX = nowClientX;
        },


        //工具类函数
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        /**
         * 根据Traceid获取Trace
         * @param id
         */
        getTraceData(id) {
            this.$axios.get(basic_url + "/trace/get",
                {
                    params: {
                        id: id
                    }
                }
            ).then(e => {
                this.traceData = e.data
            })
        },

    },

    mounted() {


        if (this.$route.query.page === undefined)
            this.currentPage = 1
        else
            this.currentPage = parseInt(this.$route.query.page)


        this.$axios.get(basic_url + '/debug', {params: {id: this.id}}).then(e => {
            this.simpleTbBlocks = e.data.simpleTbBlocks
            this.head = e.data.head
            this.ltlog = e.data.ltlog
            this.addressIndexMap = e.data.addressIndexMap
            let a = 585 / e.data.simpleTbBlocks.length
            this.tbMemHeight = a + 'px'

        }).then(e => {
            if (this.ltlog.traced) {
                this.getTraceData(this.ltlog.traceid)
            }
        })
        this.getData()
        // this.$nextTick(function () {
        //     document.querySelector('#app').addEventListener('scroll', this.onScroll)
        // })
        // window.addEventListener('scroll', this.onScroll, true)
        window.addEventListener("scroll", function (e) {
        },true);
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll, true)
    },
    watch: {      // 监听路由变化，随时获取新的列表信息
        '$route': 'fetchData'
    }


}
</script>

<style scoped>

.rt {
    position: relative;
}

.lf {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
}

.touch-div {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    right: 0;
    width: 10px;
    top: 0;
    height: 100%;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 300ms;
}

.touch-div:hover {
    width: 12px;
    background-color: #dfdfdf;

}

.touch-div .circle {
    margin-top: 5px;
    width: 3px;
    height: 3px;
    border-radius: 150px;
    background-color: #B3C0D1
}

.popContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
    background: rgba(49, 48, 48, 0.3);
}


.load-container {
    margin-left: 5px;
    padding: 0;
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
    z-index: 100;
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


.circle-transition-enter,
.circle-transition-leave-to {
    opacity: 0;
}

.circle-transition-enter-active,
.circle-transition-leave-active {
    transition: all 0.4s ease;
}


.shadow-transition-enter,
.shadow-transition-leave-to {
    opacity: 0;
}

.shadow-transition-enter-active,
.shadow-transition-leave-active {
    transition: all 0.4s ease;
}

.trace-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>