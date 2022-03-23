<template>
    <el-container id="debug-container">
        <el-aside :width="width" class="lf" ref="letfDom">
            <ToolBoxContainer
                ref="toolbox"
                :ltid="this.id"

                :clear-select="clearSelect"
                :selectSearch="selectSearch"
                :set-loading="setLoading"
                :set-keyword="setKeyword"
                :jump-t-b-and-select="jumpTBAndSelect"
            />
            <TraceContainer style="flex:1;" :ltlog="ltlog" :traceid="ltlog.traced?ltlog.traceid:-1"
                            :jump-t-b="jumpTB"/>
            <div class="touch-div" ref="moveDom">
                <!--<div class="circle" :key="'circle'+i" v-for=" i in 6"></div>-->
            </div>
        </el-aside>
        <el-container class="rt">
            <el-main class="mmcontainer load-container">
                <!-- 遮罩 -->
                <transition name="shadow-transition">
                    <div class='popContainer' v-show="tbloading"></div>
                </transition>
                <!--加载动画-->
                <div class="boxLoading" v-show="tbloading"/>
                <!--主体-->
                <div style="height: 100%;overflow-y: scroll" class="target-scroll">
                    <div
                        style="background-color: #f7f8f9;padding: 5px;font-size: 14px;display: flex;align-items: center;border-radius: 10px;border: #e6e6e6 1px solid;margin-bottom: 10px;margin-top: 5px">
                        <div style="line-height: 30px;margin-left: 10px">
                            日志文件共{{ toThousand(ltlog.line) }}行， 解析了共{{ toThousand(simpleTbBlocks.length) }}个TB块
                        </div>
                        <el-button size="mini" style="margin-left: 10px" @click="clickHeadM">跳转到日志头部</el-button>
                        <el-button size="mini" style="margin-left: 10px" @click="clickJumpTB">跳转到TB块</el-button>
                        <el-button size="mini" style="margin-left: 10px" @click="clickShowDrawer">已固定TB块</el-button>
                    </div>
                    <!---------TB块头部 ST--------->
                    <div id="lt-head" class="lt-head" v-if="currentPage===1">
                        <div
                            class="tbblock-title"
                        >
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
                        <div v-show="!hideHead" v-bind:id="'head-line-'+index" :key="'head'+index"
                             style="font-size: 16px"
                             v-for="(item,index) in head.headtext">
                            {{ item }}
                        </div>

                    </div>
                    <!---------TB块头部 ED--------->
                    <!---------整个TB块ST--------->
                    <div :key="'tbblock-wrap-'+index" v-for="(item,index) in tbBlocks" class="tbblock-wrapper">
                        <!---------TB块标题部分ST--------->
                        <div v-bind:id="'TB-'+ item.tbindex" class="tbblock-title">
                            <div style="display: flex;margin-left: 10px">
                                <div
                                    style="width: 6px;height: 6px;background-color: #c2c2c2;border-radius: 100px;margin-left: 3px"
                                    :key="i" v-for="i in 3"/>
                            </div>
                            <div style="margin-left: 10px;display: flex;align-items: center">
                                <div>
                                    <el-button @click="fixBlock(item)" size="mini" type="primary"
                                               style="height: 25px;padding: 0 5px" icon=""><i class="fa fa-thumb-tack"
                                                                                              aria-hidden="true"></i>
                                    </el-button>
                                </div>
                                <div style="margin-left: 10px">
                                    TB - {{ item.tbindex }}
                                </div>
                                <div style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #20a7ff">
                                    {{ item.tBAddress }}
                                </div>
                                <div
                                    style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                                    IR1 Num = {{ item.iR1Num }}
                                </div>
                                <div
                                    style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                                    IR2 Num = {{ item.iR2Num }}
                                </div>

                            </div>
                        </div>
                        <!---------TB块标题部分ED--------->

                        <!---------TB块内容部分ST--------->
                        <div class="tbblock-content-wrapper">
                            <!---------TB块左边部分ST--------->
                            <div style="width: 50%;border-right: #B3C0D1 solid 1px" class="tbblock-content-left">
                                <!---------一条IR2指令ST--------->
                                <div
                                    class="normalIR2"
                                    v-bind:class="(item.tbindex===currentTB&&i.id>=selectIR2Start&&i.id<=selectIR2End)?'selectIR2':'normalIR2'"
                                    :key="'ir2' +ii"
                                    v-for="(i,ii) in item.iR2Instr" style="margin-top: 3px">
                                    <div name="tbblock" style="display: flex"
                                         v-bind:id="`TB-${item.tbindex}-ir2-${i.id}`">
                                        <div style="color: #bebebe;width: 100px">{{ i.address }}</div>
                                        <div style="width: 100px;color: #990faf">{{ i.instruction.operator }}</div>
                                        <OperandWrapper style="width: 100px;margin-left: 20px"
                                                        :callback="addressClick" :contents="i.instruction.operand"/>
                                    </div>
                                </div>
                                <!---------一条IR2指令ED--------->
                            </div>
                            <!---------TB块左边部分ED--------->

                            <!---------TB块右边部分ST--------->
                            <div style="width: 50%" class="tbblock-content-right">
                                <!---------一条IR1指令ST--------->
                                <div @mouseenter="IR1MouseEnter(item.tbindex,ii,item.iR2Map)"
                                     class="normalIR1"
                                     @mouseleave="IR1MouseLeave()"
                                     :key="'ir1'+ii"
                                     v-for="(i,ii) in item.iR1Instr" style="margin-top: 3px">
                                    <div name="tbblock" style="display: flex"
                                         v-bind:id="`TB-${item.tbindex}-ir1-${i.id}`">
                                        <div style="color: #bebebe;width: 90px">{{ i.address }}</div>
                                        <div style="width: 30px;color: #990faf">{{ i.instruction.operator }}</div>
                                        <OperandWrapper style="width: 300px;margin-left: 20px"
                                                        :callback="addressClick" :contents="i.instruction.operand"/>
                                    </div>
                                </div>
                                <!---------一条IR1指令ED--------->
                            </div>
                            <!---------TB块右边部分ED--------->
                        </div>
                        <!---------TB块内容部分ED--------->

                    </div>
                    <!---------整个TB块ED--------->
                </div>

            </el-main>
            <!---------悬浮分页组件ST--------->
            <div
                style="position: absolute;bottom: 10px;background-color: #f7f8f9;left: calc(50% - 300px);padding: 5px 10px;border-radius: 10px;display: flex;align-items: center">
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
        <div style="width: 100px;border: #96979a 1px solid;position: fixed;top: 20%;right: 35px;height: 620px">
            <div style="background-color: white;border-bottom: #96979a 1px solid;text-align: center">
                内存空间
            </div>
            <div @mouseenter="mouseenter(-2)"
                 @mouseleave="mouseleave()" style="position: relative">
                <div style="text-align: center; height: 100%;cursor: pointer;font-size: 14px" class="mTB"
                     @click="clickHeadM()">
                    head
                </div>
                <div v-show="mTipSeen&&mTipSeenId===-2" class="mTBPop">
                    head
                </div>
            </div>
            <div @mouseenter="mouseenter(index)"
                 @mouseleave="mouseleave()" :key="index" v-for="(item ,index) in simpleTbBlocks"
                 style="position: relative">
                <div :style="{height:tbMemHeight}" class="mTB"
                     @click="jumpTB(item.tbindex)">

                </div>
                <div v-if="mTipSeen&&mTipSeenId===index" class="mTBPop">
                    <div>
                            <span style="font-size: 18px">
                                TB{{ item.tbindex }}
                            </span>
                        <span>
                                {{ item.tbaddress }}
                            </span>
                    </div>

                    <div>
                        IR1起始地址:<span>{{ item.startaddressir1 }}</span>
                    </div>
                    <div>
                        IR1结束地址:<span>{{ item.endaddressir1 }}</span>
                    </div>
                    <div>
                        IR2起始地址:<span>{{ item.startaddressir2 }}</span>
                    </div>
                    <div>
                        IR2结束地址:<span>{{ item.endaddressir2 }}</span>
                    </div>
                    <div>
                        IR1 num = <span style="color: #8645cb">{{ item.ir1num }}</span>
                    </div>
                    <div>
                        IR2 num = <span style="color: #8645cb">{{ item.ir2num }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!---------浮动内存空间ED--------->
        <el-drawer
            title="固定的TB块"
            size="600px"
            :visible.sync="showDrawer"
        >
            <div style="padding: 0 10px">
                <div :key="'pin-'+index" v-for="(item,index) in fixblocks" class="tbblock-wrapper">
                    <div class="tbblock-title">
                        <div style="display: flex;margin-left: 10px">
                            <div
                                style="width: 6px;height: 6px;background-color: #c2c2c2;border-radius: 100px;margin-left: 3px"
                                :key="i" v-for="i in 3"/>
                        </div>
                        <div style="margin-left: 10px;display: flex;align-items: center">
                            <div>
                                <el-button @click="clearblock(item)" size="mini" type="danger"
                                           style="height: 25px;padding: 0 5px" icon=""><i class="fa fa-trash-o"
                                                                                          aria-hidden="true"></i>
                                </el-button>
                            </div>
                            <div style="margin-left: 10px">
                                TB - {{ item.tbindex }}
                            </div>
                            <div style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #20a7ff">
                                {{ item.tBAddress }}
                            </div>
                            <div
                                style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                                IR1 Num = {{ item.iR1Num }}
                            </div>
                            <div
                                style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                                IR2 Num = {{ item.iR2Num }}
                            </div>

                        </div>
                    </div>
                    <div style="display: flex;padding: 5px 40px;flex-direction: column">
                        <div style="border-bottom: #B3C0D1 solid 1px" class="tbblock-content-left">
                            <!--  下面是循环每一个TB中的IR1指令                          -->
                            <div :key="'ir2' +ii" v-for="(i,ii) in item.iR2Instr"
                                 style="margin-top: 3px">
                                <div style="display: flex">

                                    <div style="color: #bebebe;width: 100px">{{ i.address }}</div>
                                    <div style="width: 100px;color: #990faf">{{
                                            i.instruction.operator
                                        }}
                                    </div>
                                    <OperandWrapper style="width: 100px;margin-left: 20px"
                                                    :callback="addressClick" :contents="i.instruction.operand"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div :key="'ir1'+ii" v-for="(i,ii) in item.iR1Instr" style="margin-top: 3px">
                                <div style="display: flex">
                                    <div style="color: #bebebe;width: 90px">{{ i.address }}</div>
                                    <div style="width: 50px;color: #990faf">{{
                                            i.instruction.operator
                                        }}
                                    </div>
                                    <div>
                                        <!--                                        {{i.instruction.operand}}-->
                                    </div>
                                    <OperandWrapper style="width: 300px;margin-left: 20px"
                                                    :callback="addressClick" :contents="i.instruction.operand"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </el-drawer>
    </el-container>

</template>

<script>
import {basic_url} from "@/request/request";
import Mark from "mark.js";
import OperandWrapper from "@/components/OperandWrapper/OperandWrapper";
import ToolBoxContainer from "@/views/Debug/ToolBoxContainer";
import TraceContainer from "@/components/Trace/TraceContainer";


export default {
    name: "Debug",
    components: {TraceContainer, ToolBoxContainer, OperandWrapper},
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

            mTipSeen: false,
            mTipSeenId: -1,
            simpleTbBlocks: [],
            head: {
                headtext: '',
                ltid: '',
                uid: '',
            },
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

            showDrawer: false,
            //选中IR1之后需要记录的信息
            currentTB: -1,
            selectIR2Start: -1,
            selectIR2End: -1,
            letfDom: null,
            clientStartX: 0,
            width: ''

        }
    },
    methods: {
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

        //**********状态设置函数**********
        hideTheHead() {
            this.hideHead = !this.hideHead
        },
        clickShowDrawer() {
            this.showDrawer = true
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


        IR1MouseEnter(tbindex, ir1id, map) {
            this.currentTB = tbindex
            this.selectIR2Start = map[ir1id]
            this.selectIR2End = map[ir1id + 1]
        },
        IR1MouseLeave() {
            this.currentTB = -1
            this.selectIR2Start = -1
            this.selectIR2End = -1
        },
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
            this.$refs.toolbox.searchType = '1'
            this.$refs.toolbox.searchText = address
        },

        getTbBlockRange() {
            var c = this.currentPage
            let start = (c - 1) * 20
            let end = c * 20 - 1
            let s = 'TB-' + start + ' ~ TB-' + end
            return s
        },


        mouseenter(mTipSeenId) {
            this.mTipSeen = true
            this.mTipSeenId = mTipSeenId
        },
        mouseleave() {
            this.mTipSeen = false
            this.mTipSeenId = -1
        },


        //点击head事件
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
                document.getElementById("lt-head").scrollIntoView(this.scrollIntoViewOptions)
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
                document.getElementById("TB-" + tbindex).scrollIntoView(this.scrollIntoViewOptions)
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
                    document.getElementById("TB-" + tbindex).scrollIntoView(this.scrollIntoViewOptions)

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
                document.getElementById(selectID).scrollIntoView(this.scrollIntoViewOptions)
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
                    document.getElementById(selectID).scrollIntoView(this.scrollIntoViewOptions)
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

    },
    mounted() {
        const container = document.getElementById('debug-container');

        this.width = container.scrollWidth / 2 + 'px'
        // this.letfDom = this.$refs.letfDom;
        // let moveDom = this.$refs.moveDom;
        //
        // moveDom.onmousedown = e => {
        //     this.clientStartX = e.clientX;
        //     e.preventDefault();
        //
        //     document.onmousemove = e => {
        //         this.moveHandle(e.clientX, this.letfDom);
        //     };
        //
        //     document.onmouseup = e => {
        //         document.onmouseup = null;
        //         document.onmousemove = null;
        //     };
        // };

        if (this.$route.query.page === undefined)
            this.currentPage = 1
        else
            this.currentPage = parseInt(this.$route.query.page)


        // this.loading = true

        this.$axios.get(basic_url + '/debug', {params: {id: this.id}}).then(e => {
            // this.loading = false
            // this.tbBlocks = e.data.tbBlocks
            this.simpleTbBlocks = e.data.simpleTbBlocks
            this.head = e.data.head
            this.ltlog = e.data.ltlog
            let a = 585 / e.data.simpleTbBlocks.length
            let transformVal = Number(a).toFixed(3)

            let realVal = transformVal.substring(0, transformVal.length - 1)

            // num.toFixed(3)获取的是字符串
            // this.tbMemHeight =Number(realVal) +'px'
            // this.tbMemHeight =Number(realVal) +'px'
            this.tbMemHeight = a + 'px'
            // console.log(this.tbMemHeight)
        })
        this.getData()
        this.$nextTick(function () {
            document.querySelector('#app').addEventListener('scroll', this.onScroll)
        })
        window.addEventListener('scroll', this.onScroll, true)
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
    cursor: col-resize;
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
    z-index: 10;
    background: rgba(49, 48, 48, 0.3);
}

.mmcontainer {
    padding-left: 0;
    margin-left: 5px;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0
}

.load-container {
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

.mTB {

    background-color: #f7f8f9;
    color: black;
    transition: all 300ms;
    text-align: center;
}

.mTB:hover {
    background-color: lightcoral;
    color: white;
}

.mTBPop {
    font-size: 14px;
    padding: 10px;
    right: 110px;
    bottom: 0;
    width: 200px;

    background-color: #ffffff;
    position: absolute;
    transition: all 300ms;
    z-index: 999;
    border: #B3C0D1 1px solid;
}


.lt-block {
    border: #B3C0D1 1px solid;

}

.tbblock {
    margin-top: 10px;
}


.lt-head {
    position: relative;
    border: #e6e6e6 1px solid;
    border-radius: 8px;
    margin-bottom: 10px;
}

.tbblock-wrapper {
    margin-bottom: 10px;
    border: #e6e6e6 2px solid;
    border-radius: 8px;
}

.tbblock-title {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #f2f2f2;
    color: #939292;
    display: flex;
    align-items: center;
    padding: 5px 2px;
}

.tbblock-content-wrapper {
    display: flex;
    padding: 5px 0px;
}

.tbblock-content-left {

}

.tbblock-content-right {

}

.selectIR2 {
    background-color: #e9f2ff;
}

.normalIR2 {
    padding-left: 20px;
    transition: all 300ms;
}

.normalIR1 {
    padding-left: 10px;
    background-color: white;
    transition: all 300ms;
}

.normalIR1:hover {
    background-color: #fffbe7;
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
</style>