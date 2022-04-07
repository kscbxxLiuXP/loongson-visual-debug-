<template>
    <el-drawer
        title="固定的TB块"
        size="600px"
        :before-close="handleClose"
        :visible.sync="showDrawer1"
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
                            <el-button @click="$emit('clearblock',item)" size="mini" type="danger"
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
                                                :callback="addressClick " :contents="i.instruction.operand"/>
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
</template>

<script>
import OperandWrapper from "@/components/OperandWrapper/OperandWrapper";
import '../tbblock.css'

export default {
    name: "TBDrawer",
    components: {OperandWrapper},
    props: ['showDrawer', 'fixblocks'],
    data() {
        return {
            showDrawer1: false
        }
    },
    methods: {
        addressClick(address){
            this.$emit('addressClick',address)
        },
        handleClose(done) {
           this.$emit('close')
            done()
        }
    },
    watch: {
        showDrawer: function (val) {
            this.showDrawer1 = val
        }
    }
}
</script>

<style scoped>

</style>