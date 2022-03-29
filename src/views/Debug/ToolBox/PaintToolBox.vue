<template>
    <div class="paint-box">
        <div class="box-title">
            <div>绘图</div>
            <div class="expand-button" @click="expandPaint=!expandPaint" v-if="expandPaint">
                <i class="fa fa-chevron-up"/>
            </div>
            <div class="expand-button" @click="expandPaint=!expandPaint" v-if="!expandPaint">
                <i class="fa fa-chevron-down"/>
            </div>
        </div>
        <div class="paint-body" :style="{maxHeight: expandPaint?'200px':0}">
            <div style="padding: 10px 10px;">


                <div class="paint-box-item">
                    <div class="paint-box-title">
                        绘制起点(TB块ID):
                    </div>
                    <div class="paint-box-input">
                        <el-input size="mini" v-model="startid"/>
                    </div>
                </div>
                <div class="paint-box-item">
                    <div class="paint-box-title">
                        向后搜索步长:
                    </div>
                    <div class="paint-box-input">
                        <el-input size="mini" v-model="backwardDepth"/>
                    </div>
                </div>
                <div class="paint-box-item">
                    <div class="paint-box-title">
                        向前搜索步长:
                    </div>
                    <div class="paint-box-input">
                        <el-input size="mini" v-model="forwardDepth"/>
                    </div>
                </div>

                <div class="paint-box-title">
                    <el-button size="mini" type="primary" @click="paint">绘制</el-button>
                    <el-button size="mini" type="primary" @click="drawPath" style="margin-left: 10px">生成路径</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * 只关心trace数据和是否显示，并且向Trace组件发送数据
 */
export default {
    name: "PaintToolBox",
    props: [
        //trace数据
        'traceData',

        //function
        'setTraceDataProcessed',
        'drawPath',

    ],
    data() {
        return {
            expandPaint: true,
            startid: 0,
            forwardDepth: 10,
            backwardDepth: 0,
            trace: this.traceData,
        }
    },
    methods: {

        /**
         * 根据条件产生绘图所需要的数据
         */
        paint() {
            var trace = this.trace
            var tracelist = trace.tracelist
            var nodes = []
            var edges = []
            var startid = parseInt(this.startid)

            var nodess = []
            // var startedge =
            var visited = []
            var forwardDepth = this.forwardDepth
            var backwardDepth = this.backwardDepth
            const dfsf = (index, currentDepth) => {

                if (visited.indexOf(index) !== -1) {
                    return
                }
                visited.push(index)

                let node = tracelist[index]
                nodess.push(node)
                node.nextids.forEach(iindex => {
                    if (currentDepth < forwardDepth && forwardDepth !== 0) {
                        dfsf(iindex, currentDepth + 1)
                    }
                })
            }
            dfsf(startid, 0);
            visited.shift()
            nodess.shift()

            const dfsb = (index, currentDepth) => {
                if (visited.indexOf(index) !== -1) {
                    return
                }
                visited.push(index)
                let node = tracelist[index]
                nodess.push(node)
                node.parents.forEach(iindex => {
                    if (currentDepth < backwardDepth && backwardDepth !== 0) {
                        dfsb(iindex, currentDepth + 1)
                    }
                })
            }
            dfsb(startid, 0);



            nodess.forEach(ti => {
                var nn = {
                    address: ti.address,
                    id: ti.id.toString(),
                    tbaddress: ti.tbaddress,
                    tbindex: ti.tbindex,
                    tbtype: ti.tbtype,
                }
                nodes.push(nn)
                ti.nextids.forEach(ii => {
                    if (visited.indexOf(ti.id) !== -1 && visited.indexOf(ii) !== -1) {
                        var edge = {source: ti.id.toString(), target: ii.toString(),}
                        edges.push(edge)
                    }

                })
            })
            var data = {
                'nodes': nodes,
                'edges': edges
            }

            //发送数据给绘图面板
            this.setTraceDataProcessed(data)

        },
    },
    watch: {
        traceData: function (newVal, oldVal) {
            this.trace = newVal
        },
    },
}
</script>

<style scoped>
.box-title {
    color: #727275;
    border-bottom: #dadce0 1px solid;;
    padding: 5px 20px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.paint-box {
    margin-top: 10px;
    border: #dbdcdd 1px solid;
    border-radius: 5px;
    user-select: none;
    display: flex;
    flex-direction: column;
    background-color: white;

}

.paint-body {

    overflow-y: hidden;
    transition: all 300ms;
    position: relative;
}

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


.paint-box-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}


.paint-box-title {
    font-size: 14px;
}

.paint-box-input {
    margin-left: 5px;
    margin-right: 20px;
    width: 80px;

}

</style>