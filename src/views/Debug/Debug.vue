<template>
    <el-container id="debug-container">
        <el-aside :width="width" class="lf" ref="letfDom">
            <div style="position: absolute; top:20px;display: flex;flex-direction: column;padding-bottom: 5px;">
                <div>
                    <el-radio v-model="radio" label="1">按地址搜索</el-radio>
                    <el-radio v-model="radio" label="2">按指令搜索</el-radio>
                    <div v-if="radio==='1'">
                        <el-input size="mini" placeholder="地址" v-model="form.address" style="width: 250px" clearable>
                        </el-input>
                    </div>

                    <div style="display: flex;" v-if="radio==='2'">

                        <el-select size="mini" v-model="form.insType" placeholder="请选择指令类型">
                            <el-option label="全选" value="1">
                            </el-option>
                            <el-option label="x86" value="2"></el-option>
                            <el-option label="LoongArch" value="3"></el-option>
                        </el-select>
                        <el-input size="mini" v-model="form.instruction" placeholder="指令" clearable/>

                    </div>
                    <el-button type="primary" size="mini" @click="onSubmitSearch">搜索</el-button>
                    <el-button type="primary" size="mini" @click="onClearSearch">重置</el-button>
                </div>

                <div v-if="searched"
                     style="height: 38px;margin-top: 10px;display: flex;align-items: center;border-radius: 5px;background-color: #f7f8f9;padding: 5px;position: relative">
                    <transition name="shadow-transition">
                        <div class='popContainer' v-if="addressloading"/>
                    </transition>

                    <svg id="load" x="0px" y="0px" viewBox="0 0 150 150" :style="{ width: addressloading?'30px':'0' }"
                         style="transition: all 300ms">
                        <circle id="loading-inner" cx="75" cy="75" r="45"/>
                    </svg>
                    <div style="background-color: white;padding: 2px 10px;border-radius: 10px;margin-left: 10px">
                        检索结果:
                    </div>

                    <div style="margin-left: 10px">
                        共搜索到
                    </div>
                    <div style="line-height: normal;vertical-align:middle">{{ toThousand(resultsNum) }}处</div>
                    <div>
                        ，当前位于
                    </div>
                    <el-input-number size="mini"
                                     controls-position="right" :min="1"
                                     :max="resultsNum"
                                     style="width: 100px;margin-left: 10px"
                                     @keyup.enter.native="currentSearchChange"
                                     v-model="inputCurrentSearch"/>
                    <div style="margin-left: 10px">
                        / {{ toThousand(resultsNum) }}
                    </div>
                    <div style="margin-left: 20px">
                        <el-button size="mini" @click="previousResult">上一处</el-button>
                        <el-button size="mini" @click="nextResult">下一处</el-button>
                    </div>
                </div>

            </div>
            <TraceBox style="flex:1;" :ltlog="ltlog" :traceid="ltlog.traced?ltlog.traceid:-1" :jump-t-b="jumpTB1"/>
            <div class="touch-div" ref="moveDom">
                <div class="circle" :key="'circle'+i" v-for=" i in 6"></div>
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
                                <!--                        getClassName(item.tbindex,i.id)-->
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
                     @click="jumpTB1(item.tbindex)">

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
import TBBlock from "@/views/Debug/TBBlock";
import Mark from "mark.js";
import OperandWrapper from "@/components/OperandWrapper/OperandWrapper";
import Trace from "@/components/Trace/Trace";
import TraceBox from "@/components/Trace/TraceBox";


export default {
    name: "Debug",
    components: {TraceBox, Trace, OperandWrapper},
    props: ['id'],
    data() {

        return {
            fixblocks: [],
            hideHead: true,
            currentPage: 1,
            pages: 0,
            pageSize: 20,
            total: 0,
            inputCurrentSearch: '',
            form: {
                address: '',
                insType: '',
                instruction: '',
                skipHead: true,

            },
            tbMemHeight: '0.1px',
            itemComponent: TBBlock,
            tbloading: true,
            addressloading: true,
            loading: true,
            radio: '1',
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
            searched: false,
            tbBlocks: [],
            keywords: '',
            searchResults: [],
            currentSearch: 1,
            resultsNum: 0,
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
        getClassName(tbindex, ir2id) {

            if (tbindex !== this.currentTB) {
                return "normalIR2"
            }
            if (ir2id >= this.selectIR2Start && ir2id <= this.selectIR2End) {
                return "selectIR2"
            }
            return "normalIR2"
        },
        clearblock(block) {
            let a = this.fixblocks.indexOf(block)
            this.fixblocks.splice(a, 1)
            this.$message.success("已取消固定")
        },
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
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        onClearSearch() {
            this.currentSearch = 1
            this.resultsNum = 0
            this.searchResults = []
            this.keywords = ''
            this.searched = false
            this.form = {
                address: '',
                instruction: '',
            }
            this.inputCurrentSearch = 1
            this.clearSelect()
            this.$message.success("已重置搜索")
        },
        addressClick(address) {
            this.radio = '1'
            this.form.address = address
        },
        currentSearchChange() {
            if (parseInt(this.inputCurrentSearch) > this.resultsNum) {
                this.inputCurrentSearch = this.resultsNum
            }
            this.currentSearch = this.inputCurrentSearch
            this.jumpTarget(this.currentSearch)
        },
        getTbBlockRange() {
            var c = this.currentPage
            let start = (c - 1) * 20
            let end = c * 20 - 1
            let s = 'TB-' + start + ' ~ TB-' + end
            return s
        },
        searchAddress() {


            if (this.form.address === '') {
                this.$message.error("搜索不可以为空")
                this.searched = false
                return
            }
            this.keywords = this.form.address
            this.addressloading = true
            this.tbloading = true
            this.$axios.get(basic_url + '/debug/search/address', {
                params: {
                    ltid: this.id,
                    address: this.form.address,
                    skipHead: true
                }
            }).then(e => {
                if (e.data.total === 0) {
                    this.$message.success("没有查询到结果")
                    this.searched = false
                    this.tbloading = false
                    this.addressloading = false
                    return
                }
                this.searchResults = e.data.results
                this.resultsNum = e.data.total
                this.selectSearch()
                this.searched = true;
                this.addressloading = false
                this.tbloading = false
            })
        },
        searchInstruction() {
            if (this.form.insType === '') {
                this.$message.error("请选择指令类型")
                this.searched = false
                return
            }
            if (this.form.instruction === '') {
                this.$message.error("请输入搜索指令")
                this.searched = false
                return
            }
            this.keywords = this.form.instruction

            this.addressloading = true
            this.tbloading = true
            this.$axios.get(basic_url + '/debug/search/instruction', {
                params: {
                    type: parseInt(this.form.insType),
                    ltid: this.id,
                    instruction: this.form.instruction,
                    skipHead: true
                }
            }).then(e => {
                if (e.data.total === 0) {
                    this.$message.success("没有查询到结果")
                    this.searched = false
                    return
                }
                this.searchResults = e.data.results
                this.resultsNum = e.data.total
                this.selectSearch()
                this.searched = true;
                this.addressloading = false
                this.tbloading = false
            })

        },
        //搜索函数
        onSubmitSearch() {
            //处理两种搜索
            //搜索前先清楚上一次搜索的结果
            this.clearSelect()
            this.currentSearch = 1
            this.resultsNum = 0
            this.searchResults = []
            this.keywords = ''
            this.inputCurrentSearch = 1
            if (this.radio === '1') {
                this.searchAddress()
            } else {
                this.searchInstruction()
            }


        },
        hideTheHead() {
            this.hideHead = !this.hideHead
        },
        clearSelect() {
            document.getElementsByName("tbblock").forEach(e => {
                var instance = new Mark(e)
                instance.unmark();
            })

        },
        selectSearch() {
            document.getElementsByName("tbblock").forEach(e => {
                var instance = new Mark(e)
                instance.mark(this.keywords);
            })
            console.log(this.keywords)
        },
        mouseenter(mTipSeenId) {
            this.mTipSeen = true
            this.mTipSeenId = mTipSeenId
        },
        mouseleave() {
            this.mTipSeen = false
            this.mTipSeenId = -1
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

        previousResult() {
            if (this.currentSearch === 1) {
                this.currentSearch = this.resultsNum
            } else {

                this.currentSearch--;
            }
            this.inputCurrentSearch = this.currentSearch
            this.jumpTarget(this.currentSearch)

        },
        jumpTarget(resultIndex) {
            //印射相差1
            let resultT = this.searchResults[resultIndex - 1]
            let tbid = resultT.tbid
            let selectID = resultT.selectID
            this.selectSearchResult(tbid, selectID)
            // console.log(resultIndex)
        },
        selectSearchResult(tbid, selectID) {

            this.jumpTB2(tbid, selectID)
        },
        clickShowDrawer() {
            this.showDrawer = true
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
        isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/;
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
            if (regPos.test(val) && regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
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
                this.jumpTB1(value)
                this.$message({
                    type: 'success',
                    message: '跳转成功'
                });
            })
        },
        jumpTB1(tbindex) {
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
        jumpTB2(tbindex, selectID) {
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
                    // console.log(e)

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

    },
    mounted() {
        const container = document.getElementById('debug-container');

        this.width = container.scrollWidth / 2 +'px'
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