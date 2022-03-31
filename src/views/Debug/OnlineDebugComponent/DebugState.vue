<template>
    <div style="font-size: 14px;margin-left: 20px;display: flex;align-items: center;line-height: normal">
        {{ title }}
        <div class="debug-state-1" v-if="debugState===1">准备就绪</div>
        <div class="debug-state-2" v-if="debugState===2">执行中</div>
        <div class="debug-state-3" v-if="debugState===3">调试中</div>
        <div class="debug-state-4" v-if="debugState===4">已结束</div>
        <div class="debug-state-5" v-if="debugState===5">被终止</div>
        <div class="debug-state-6" v-if="debugState===6">连接丢失</div>
        <div class="debug-state-6" v-if="debugState===7">等待回复</div>
    </div>
</template>

<script>
export default {
    name: "DebugState",
    props: {
        debugState: {
            type: Number
        },
        title: {
            type: String,
            default: ''
        }
    }

}
</script>

<style scoped>
.debug-state-1 {
    /*background-color: #9f9f9a;*/
    background-color: #6ba470;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-2 {
    background-color: #20a7ff;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-3 {
    background-color: #20a7ff;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-4 {
    background-color: #FDAF75;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-5 {
    background-color: #F24A72;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}

.debug-state-6 {
    background-color: #9f9f9a;
    padding: 2px 5px;
    color: white;
    border-radius: 5px;
}
</style>