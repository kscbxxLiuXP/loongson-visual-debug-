<template>
    <div class="tbblock">
        <div v-bind:id="'TB-'+ source.tbindex" style="width: 100%;text-align: center;background-color: #e5cbff">TB -
            {{ source.tbindex }}
        </div>
        <div style="display: flex;margin: 0;padding: 0" v-if="visible1">
            <div style="width: 50%;border-right: #B3C0D1 solid 1px">
                <!--  下面是循环每一个TB中的IR1指令                          -->
                <div :key="'ir2' +ii" v-for="(i,ii) in source.iR2Instr" style="margin-top: 3px">
                    <div style="display: flex">
                        <div style="color: #ff8d02">{{ i.address }}</div>
                        <div style="width: 100px;margin-left: 20px">{{ i.instruction.operator }}</div>
                        <div style="width: 100px;margin-left: 20px">{{ i.instruction.operand }}</div>
                    </div>
                </div>
            </div>
            <div style="width: 50%">
                <!--  下面是循环每一个TB中的IR1指令                          -->
                <div :key="ii" v-for="(i,ii) in source.iR1Instr">
                    <div style="display: flex">
                        <div style="color: #ff8d02">{{ i.address }}</div>
                        <div style="width: 100px;margin-left: 20px">{{ i.instruction.operator }}</div>
                        <div style="width: 100px;margin-left: 20px">{{ i.instruction.operand }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "TBBlock",
    props: {
        index: { // index of current item
            type: Number
        },
        source: { // here is: {uid: 'unique_1', text: 'abc'}
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            visible1: true,
        }
    },
    methods: {
        ccc() {
            this.visible1 = !this.visible1
        }
    }
}
</script>

<style scoped>
.tbblock {
    margin-top: 10px;
}
</style>