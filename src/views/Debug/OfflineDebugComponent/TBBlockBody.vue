<template>
    <div>
        <div :key="'tbblock-wrap-'+index" v-for="(item,index) in tbBlocks" class="tbblock-wrapper">
            <div style="position: sticky;top: 50px;background: white;z-index: 2">
                <!---------TB块标题部分ST--------->
                <div v-bind:id="'TB-'+ item.tbindex" class="tbblock-title">
                    <div style="display: flex;margin-left: 10px">
                        <div
                            style="width: 6px;height: 6px;background-color: #c2c2c2;border-radius: 100px;margin-left: 3px"
                            :key="i" v-for="i in 3"/>
                    </div>


                    <el-button @click="$emit('fixBlock',item)" size="mini" type="primary"
                               style="height: 25px;padding: 0 5px;margin-left: 10px">
                        <i class="fa fa-thumb-tack" aria-hidden="true"></i>
                    </el-button>

                    <div style="margin-left: 10px">
                        TB - {{ item.tbindex }}
                    </div>
                    <div style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #20a7ff">
                        {{ item.startAddressIR1 }}
                    </div>
                    <div
                        style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                        IR1 Num = {{ item.iR1Num }}
                    </div>
                    <div
                        style="margin-left: 10px;background-color: white;padding: 2px 5px;color: #7c37cb;font-size: 14px">
                        IR2 Num = {{ item.iR2Num }}
                    </div>
                    <el-button @click="registerClick(item)" size="mini"
                               style="height: 25px;padding: 0 5px;margin-left: 10px">
                        寄存器
                    </el-button>
                </div>
                <!---------TB块标题部分ED--------->
                <!-------寄存器信息显示 ------->
                <div class="tb-register" v-show="item.expand">
                    <div style="display: flex;width: 80px;align-items: center;justify-content: center">
                        <svg t="1649313824280" class="icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="1626" width="40" height="40">
                            <path
                                d="M180.736 389.376c-60.288 0-100.992-51.456-100.992-149.76 0-98.304 40.704-146.688 100.992-146.688 60.288 0 101.376 49.152 101.376 146.688 0 98.304-41.088 149.76-101.376 149.76z m0-52.992c20.352 0 36.864-18.432 36.864-96.768 0-77.952-16.512-94.08-36.864-94.08-20.352 0-36.48 16.128-36.48 94.08 0 78.336 16.128 96.768 36.48 96.768zM327.808 384v-55.296h60.672V166.272h-52.608v-42.24c30.72-5.76 50.688-13.44 70.656-25.728h50.304v230.4h51.456V384h-180.48z m320.64 5.376c-60.288 0-100.992-51.456-100.992-149.76 0-98.304 40.704-146.688 100.992-146.688 60.288 0 101.376 49.152 101.376 146.688 0 98.304-41.088 149.76-101.376 149.76z m0-52.992c20.352 0 36.864-18.432 36.864-96.768 0-77.952-16.512-94.08-36.864-94.08-20.352 0-36.48 16.128-36.48 94.08 0 78.336 16.128 96.768 36.48 96.768zM795.52 384v-55.296h60.672V166.272h-52.608v-42.24c30.72-5.76 50.688-13.44 70.656-25.728h50.304v230.4h51.456V384h-180.48z m-614.784 581.376c-60.288 0-100.992-51.456-100.992-149.76 0-98.304 40.704-146.688 100.992-146.688 60.288 0 101.376 49.152 101.376 146.688 0 98.304-41.088 149.76-101.376 149.76z m0-52.992c20.352 0 36.864-18.432 36.864-96.768 0-77.952-16.512-94.08-36.864-94.08-20.352 0-36.48 16.128-36.48 94.08 0 78.336 16.128 96.768 36.48 96.768zM327.808 960v-55.296h60.672v-162.432h-52.608v-42.24c30.72-5.76 50.688-13.44 70.656-25.728h50.304v230.4h51.456V960h-180.48z m320.64 5.376c-60.288 0-100.992-51.456-100.992-149.76 0-98.304 40.704-146.688 100.992-146.688 60.288 0 101.376 49.152 101.376 146.688 0 98.304-41.088 149.76-101.376 149.76z m0-52.992c20.352 0 36.864-18.432 36.864-96.768 0-77.952-16.512-94.08-36.864-94.08-20.352 0-36.48 16.128-36.48 94.08 0 78.336 16.128 96.768 36.48 96.768zM795.52 960v-55.296h60.672v-162.432h-52.608v-42.24c30.72-5.76 50.688-13.44 70.656-25.728h50.304v230.4h51.456V960h-180.48zM64 576V512h896v64H64z"
                                fill="#AFB1B3" p-id="1627"></path>
                        </svg>
                    </div>
                    <div v-if="item.registers===null"
                         style="line-height: 45px;width: 100%;text-align: center;align-items: center;color: #89898c">
                        暂时没有获取到该TB块的寄存器信息
                    </div>

                    <RegisterDisplay v-if="item.registers!==null" :registers="item.registers"/>


                </div>
            </div>

            <!---------TB块内容部分ST--------->
            <div class="tbblock-content-wrapper">

                <!---------TB块左边部分ST--------->
                <div class="tbblock-content-left">
                    <!---------一条IR2指令ST--------->
                    <div
                        class="normalIR2"
                        v-bind:class="{'hoverIR2':(item.tbindex===hoverTB&&i.id>=hoverIR2Start&&i.id<=hoverIR2End),'selectIR2':(item.tbindex===selectTB&&i.id>=selectIR2Start&&i.id<=selectIR2End)}"
                        :key="'ir2' +ii"
                        v-for="(i,ii) in item.iR2Instr" style="margin-top: 3px;display: flex"
                        name="tbblock"
                        v-bind:id="`TB-${item.tbindex}-ir2-${i.id}`"
                    >
                        <div style="color: #bebebe;width: 100px">{{ i.address }}</div>
                        <div style="min-width: 100px;color: #990faf">{{ i.instruction.operator }}</div>
                        <OperandWrapper style="width: 100px;margin-left: 20px"
                                        :callback="addressClick" :contents="i.instruction.operand"/>
                    </div>
                    <!---------一条IR2指令ED--------->
                </div>
                <!---------TB块左边部分ED--------->

                <!---------TB块右边部分ST--------->
                <div class="tbblock-content-right">

                    <!---------一条IR1指令ST--------->
                    <div style="position: sticky;top: 90px;background: white">


                    <div @mouseenter="IR1MouseEnter(item.tbindex,ii,item.iR2Map)"
                         @click="IR1Click(item.tbindex,ii,item.iR2Map)"
                         v-bind:class="{'selectIR1':(item.tbindex===selectTB&&ii===selectIR1)}"
                         class="normalIR1"
                         @mouseleave="IR1MouseLeave()"
                         :key="'ir1'+ii"
                         name="tbblock" style="display: flex;margin-top: 3px"
                         v-bind:id="`TB-${item.tbindex}-ir1-${i.id}`"
                         v-for="(i,ii) in item.iR1Instr">
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
    </div>

</template>

<script>
import OperandWrapper from "@/components/OperandWrapper/OperandWrapper";
import RegisterDisplay from "@/views/Debug/OfflineDebugComponent/RegisterDisplay";

export default {
    name: "TBBlockBody",
    components: {RegisterDisplay, OperandWrapper},
    props: ['tbblockData'],
    data() {
        return {
            //选中IR1之后需要记录的信息
            hoverTB: -1,
            hoverIR2Start: -1,
            hoverIR2End: -1,
            selectTB: -1,
            selectIR2Start: -1,
            selectIR2End: -1,
            selectIR1:-1,
            tbBlocks: this.tbblockData,

        }
    },
    methods: {
        IR1Click(tbindex, ir1id, map) {
            this.selectTB = tbindex
            this.selectIR1 = ir1id
            this.selectIR2Start = map[ir1id]
            this.selectIR2End = map[ir1id + 1]
        },
        addressClick(address) {
            this.$emit('addressClick', address)
        },
        IR1MouseEnter(tbindex, ir1id, map) {
            this.hoverTB = tbindex
            this.hoverIR2Start = map[ir1id]
            this.hoverIR2End = map[ir1id + 1]
        },
        IR1MouseLeave() {
            this.hoverTB = -1
            this.hoverIR2Start = -1
            this.hoverIR2End = -1
        },
        registerClick(item) {
            if (item.registers === null && item.expand === false) {
                this.$emit('getRegisterInfoFromTrace', item.startAddressIR1, val => {
                    item.registers = val
                })
            }
            item.expand = !item.expand
        }
    },
    watch: {
        tbblockData: function (val) {
            this.tbBlocks = val
        }
    }
}
</script>

<style scoped>

</style>