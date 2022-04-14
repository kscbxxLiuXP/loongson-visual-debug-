<template>
    <div class="debug-trace-wrapper" id="debug-trace-board">
        <div style="padding: 0 10px">
            <i style="float: right" class="fa fa-close  close-button fa-fw" @click="$emit('close')"/>
            <h3 style="padding: 0;margin: 0;width: 100px">Trace信息</h3>

            <el-input size="mini" v-model="filter" @input="filterChange(traces)" placeholder="输入地址筛选"/>
        </div>
        <div style="height: 600px;overflow-y: auto;   padding: 0 10px;">
            <div :key="index" v-for="(item,index) in data" class="trace-item">
                <span class="trace_btn" @click="$emit('jumpByAddress',item.address)">跳转</span>
                <span class="trace_btn" @click="$emit('setAsStart',item.address)">设为起点</span>
                <div style="display: flex;flex-wrap: wrap;width: 228px;align-items: baseline">
                    <span style="font-size: 15px;">[{{ index + 1 }}]</span>
                    <span style="font-size: 16px;font-weight: bold">{{ item.address }}</span>
                    <span v-if="item.tbtype" class="trace-tbtype">{{ item.tbtype }}</span>
                </div>


                <div class="trace-link" :key="n_index" v-for="(nextid,n_index) in item.nextids">
                    LinkTB:<span class="trace-address">{{ item.address }}</span> -> <span
                    class="trace-address">{{ nextid }}</span>
                </div>
                <div class="trace-indirect-link" v-if="item.indirectTo!=='-1'">
                    间接跳转:<span class="trace-address">{{ item.address }}</span> -> <span
                    class="trace-address">{{ item.indirectTo }}</span>
                </div>
                <div class="trace-skip-link" v-if="item.skipTo&& item.skipTo!=='-1'">
                    <div class="trace-skip-link-body">
                        <div :key="i" v-for="i in 3"
                             style=" border-radius: 50%;width: 5px;height: 5px;background: #2c3e50;margin-top: 10px;margin-left: auto;margin-right: auto"/>
                    </div>

                    <div class="trace-skip-link-bottom">
                        <span style="font-size: 12px">SKIP TO:</span>
                        <span >{{ item.skipTo }}</span>
                    </div>

                </div>
            </div>

            <div v-if="data.length===0" style="height: 100%;align-items: center;display: flex;justify-content: center">
                <el-empty description="暂无数据"></el-empty>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "DebugTraceBoard",
    props: ['debugTraces'],
    data() {
        return {
            filter: '',
            traces: [],
            data: [],
        }
    },
    methods: {
        filterChange(val) {
            if (this.filter === '') {
                this.data = val;
                return
            }
            let d = []
            val.forEach(e => {
                if (e.address.indexOf(this.filter) !== -1) {
                    d.push(e)
                }
            })
            this.data = d;
        }
    },
    mounted() {

    },
    watch: {
        debugTraces: function (val) {
            this.traces = val
            this.filterChange(val)
        }
    }
}
</script>

<style scoped>


.trace_btn {
    margin-top: 5px;
    float: right;
    line-height: 14px;
    border-radius: 3px;
    background: #ffffff;
    color: black;
    font-size: 12px;
    padding: 2px 5px;
    margin-left: 5px;
    transition: all 300ms linear;
    cursor: pointer;

}

.trace_btn:hover {
    background: #1e94ff;
    color: white;
}

.trace-tbtype {

    border-radius: 3px;
    background: white;
    color: black;
    font-size: 12px;
    padding: 2px 5px;
    margin-left: 5px;
    line-height: 14px;
    height: fit-content;
}

.trace-address {
    background: white;
    padding: 2px 5px;
    border-radius: 3px;
}
.trace-skip-link-body{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 0;
}
.trace-skip-link {

    background: #ffcae1;
    border-radius: 8px;
    padding: 0;
    margin-top: 5px;
    border-bottom:  #ffcae1 1px solid;
}
.trace-skip-link-bottom {
    text-align: center;
    line-height: 24px;
    background: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-left:  #ffcae1 1px solid;
    border-right:  #ffcae1 1px solid;
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

.trace-item:first-child {
    margin-top: 0;
    background: #f8f7dc;
    border-radius: 8px;
    padding: 5px 10px;
}

.trace-item:not(:first-child) {
    margin-top: 10px;
    background: #f8f7dc;

    border-radius: 8px;
    padding: 5px 10px;
}

.debug-trace-wrapper {
    font-size: 14px;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    width: 380px;
    line-height: 35px;
    top: 10px;
    z-index: 9999;
    -moz-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    -webkit-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    padding: 5px 0;


}

.close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #89898c;
    background-color: white;
    margin-left: 10px;
    border-radius: 50px;

    transition: all 300ms;
    width: 25px;
    height: 26px;
}

.close-button:hover {
    color: white;
    background-color: rgba(219, 88, 96, 0.67);
}

.close-button:active {
    color: white;
    background-color: rgba(219, 88, 96, 0.82);
}
</style>