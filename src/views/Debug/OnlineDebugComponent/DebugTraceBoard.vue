<template>
    <div class="debug-trace-wrapper" id="debug-trace-board">
        <h4 style="padding: 0 0;margin: 0">Trace信息</h4>
        <div :key="index" v-for="(item,index) in debugTraces" class="trace-item">
            <span style="font-size: 15px;">[{{ index + 1 }}]</span>
            <span style="font-size: 16px;font-weight: bold">{{ item.address }}</span>
            <span v-if="item.tbtype" class="trace-tbtype">{{ item.tbtype }}</span>
            <div class="trace-link" :key="n_index" v-for="(nextid,n_index) in item.nextids">
                LinkTB:<span class="trace-address">{{ item.address }}</span> -> <span
                class="trace-address">{{ nextid }}</span>
            </div>
            <div class="trace-indirect-link" v-if="item.indirectTo">
                间接跳转:<span class="trace-address">{{ item.address }}</span> -> <span
                class="trace-address">{{ item.indirectTo }}</span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "DebugTraceBoard",
    props: ['debugTraces'],
    data() {
        return {}
    },
    methods: {},
    mounted() {
        let button = document.getElementById("showTrace_btn")
        let board = document.getElementById("debug-trace-board")
        let offsetleft = (button.offsetLeft + button.clientWidth / 2) - (320 / 2)
        board.style.left = (offsetleft - button.offsetLeft) + 'px'
    }
}
</script>

<style scoped>
.trace-tbtype {

    border-radius: 3px;
    background: #ea6198;
    color: white;
    font-size: 12px;
    padding: 2px 5px;
    margin-left: 5px
}

.trace-address {
    background: white;
    padding: 2px 5px;
}

.trace-indirect-link {
    background: #f4e0fd;
    border-radius: 8px;
    padding: 0 10px;
    margin-top: 5px;
}

.trace-link {
    background: #dceafa;
    border-radius: 8px;
    padding: 0 10px;
    margin-top: 5px;
}

.trace-item {
    background: #f8f7dc;
    margin-top: 10px;
    border-radius: 8px;
    padding: 5px 10px;
}

.debug-trace-wrapper {
    background: #fff;
    border-radius: 5px;
    position: absolute;
    width: 320px;
    height: 600px;
    top: 10px;
    z-index: 9999;
    -moz-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    -webkit-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    overflow-y: auto;
    padding: 10px 10px;

}
</style>