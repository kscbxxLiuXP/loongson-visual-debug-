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
                        绘制起点:
                    </div>
                    <div class="paint-box-input">
                        <span style="color: #e57b7b" v-if="startAddress===''" class="paint-startAddress">NULL</span>
                        <span style="color: #df8a2e" v-if="startAddress!==''"
                              class="paint-startAddress">{{ startAddress }}</span>
                        <span class="select_btn" @click="$emit('showTrace')">选择</span>
                    </div>
                </div>
                <div class="paint-box-item">
                    <div class="paint-box-title">
                        向后搜索步长:
                    </div>
                    <div class="paint-box-input">
                        <el-input style="width: 80px" size="mini" v-model="backwardDepth"/>
                    </div>
                </div>
                <div class="paint-box-item">
                    <div class="paint-box-title">
                        向前搜索步长:
                    </div>
                    <div class="paint-box-input">
                        <el-input style="width: 80px" size="mini" v-model="forwardDepth"/>
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
            startAddress: '',
            forwardDepth: 10,
            backwardDepth: 0,
            trace: this.traceData,
            dic: [],
        }
    },
    methods: {
        combo(nodes) {
            var dic = this.dic;
            nodes.sort(function (a, b) {
                return a.index - b.index;
            })

            const resolve = (node) => {
                let next, previous;
                let cout = 0;
                if (node.indirectTo && node.indirectTo !== "-1") {
                    cout++;
                    next = dic[node.indirectTo]
                }
                if (node.skipTo && node.skipTo !== '-1') {
                    cout++;
                    next = dic[node.skipTo]
                }
                if (node.nextids.length !== 0) {
                    cout = cout + node.nextids.length
                    next = dic[node.nextids[0]]
                }

                let cin = 0;
                if (node.indirectFrom && node.indirectFrom !== "-1") {
                    cin++;
                    previous = dic[node.indirectFrom]
                }
                if (node.skipFrom && node.skipFrom !== '-1') {
                    cin++;
                    previous = dic[node.skipFrom]
                }
                if (node.parents.length !== 0) {
                    cin = cin + node.parents.length
                    previous = dic[node.parents[0]]
                }
                return {
                    'cin': cin,
                    'cout': cout,
                    'next': next,
                    'previous': previous
                }
            }
            var visited = []

            let coms = []
            let tempCom = []
            const dfs = (node) => {
                if (node ===undefined) return;
                if (visited.indexOf(node.index) !== -1) {
                    return
                }
                visited.push(node.index)
                let res = resolve(node)
                if (res.cin > 1 || res.cout > 1) {
                    return
                }
                tempCom.push(node.index)
                dfs(nodes[res.next])
                dfs(nodes[res.previous])
            }
            for (let i = 0; i < nodes.length; i++) {
                //访问
                if (visited.indexOf(i) !== -1) {
                    continue
                }

                dfs(nodes[i], tempCom)
                if (tempCom.length >= 3) {
                    coms.push(tempCom)
                }
                tempCom = []
            }
            console.log('com:',coms)
            return coms
        },
        /**
         * 根据条件产生绘图所需要的数据
         */
        paint() {
            if (this.startAddress === '') {
                this.$message.error("请选择绘制起点")
                return
            }
            var trace = this.trace
            //创建地址 - trace中index的映射
            var dic = this.dic;

            var nodes = []
            var edges = []
            //此index是在数组中的下标，并不是对应的TBIndex
            var startIndex = dic[this.startAddress]
            var nodess = []
            // var startedge =
            var visited = []
            var forwardDepth = this.forwardDepth
            var backwardDepth = this.backwardDepth
            const dfsf = (index, currentDepth) => {
                //index指的是在数组中的下标
                //已经找过(=-1意味着visit中没有index)
                if (visited.indexOf(index) !== -1) {
                    return
                }
                visited.push(index)

                let node = trace[index]
                nodess.push(node)
                node.nextids.forEach(iindex => {
                    if (currentDepth < forwardDepth && forwardDepth !== 0) {
                        dfsf(dic[iindex], currentDepth + 1)
                    }
                })
                //向前的间接跳转
                if (currentDepth < forwardDepth && forwardDepth !== 0) {
                    if (node.indirectTo && node.indirectTo !== '-1') {
                        console.log(node.indirectTo, dic[node.indirectTo])

                        dfsf(dic[node.indirectTo], currentDepth + 1)
                    }
                }
                //由于调试模式，直接跳转到的部分
                if (currentDepth < forwardDepth && forwardDepth !== 0) {
                    if (node.skipTo && node.skipTo !== '-1') {
                        console.log(node.skipTo, dic[node.skipTo])

                        dfsf(dic[node.skipTo], currentDepth + 1)
                    }
                }
            }
            dfsf(startIndex, 0);
            visited.shift()
            nodess.shift()

            const dfsb = (index, currentDepth) => {
                if (visited.indexOf(index) !== -1) {
                    return
                }
                visited.push(index)
                let node = trace[index]
                nodess.push(node)
                node.parents.forEach(iindex => {
                    if (currentDepth < backwardDepth && backwardDepth !== 0) {
                        dfsb(dic[iindex], currentDepth + 1)
                    }
                })
                //向后的间接跳转
                if (currentDepth < forwardDepth && forwardDepth !== 0) {
                    if (node.indirectFrom && node.indirectFrom !== '-1') {
                        console.log(node.indirectFrom, dic[node.indirectFrom])

                        dfsf(dic[node.indirectFrom], currentDepth + 1)
                    }
                }
                //由于调试模式，直接跳转到的部分
                if (currentDepth < forwardDepth && forwardDepth !== 0) {
                    if (node.skipFrom && node.skipFrom !== '-1') {
                        console.log(node.skipFrom, dic[node.skipFrom])

                        dfsf(dic[node.skipFrom], currentDepth + 1)
                    }
                }
            }
            dfsb(startIndex, 0);

            //生成组合图层
            let coms =  this.combo(nodess)
            let combos = []
            let comIndex = 0
            coms.forEach(com=>{
                comIndex++;
                combos.push({
                    id:'Combo'+comIndex,
                    label: 'Combo'+comIndex,
                })
                com.forEach(nodeIndex=>{
                    if (nodess[nodeIndex]){

                        nodess[nodeIndex].comboId = 'Combo'+comIndex
                    }
                })
            })

            nodess.forEach(ti => {
                var nn = {
                    address: ti.address,
                    id: ti.index.toString(),
                    tbtype: ti.tbtype,
                }
                if (ti.comboId){
                    nn.comboId = ti.comboId
                }
                nodes.push(nn)
                ti.nextids.forEach(nextaddress => {
                    if (visited.indexOf(ti.index) !== -1 && visited.indexOf(dic[nextaddress]) !== -1) {
                        let edge = {source: ti.index.toString(), target: dic[nextaddress].toString(), styleType: 'link'}
                        edges.push(edge)
                    }
                })
                if (visited.indexOf(ti.index) !== -1 && visited.indexOf(dic[ti.indirectTo]) !== -1) {
                    let edge = {
                        source: ti.index.toString(),
                        target: dic[ti.indirectTo].toString(),
                        styleType: 'indirect'
                    }
                    edges.push(edge)
                }
                if (visited.indexOf(ti.index) !== -1 && visited.indexOf(dic[ti.skipTo]) !== -1) {
                    let edge = {
                        source: ti.index.toString(),
                        target: dic[ti.skipTo].toString(),
                        styleType: 'skip'
                    }
                    edges.push(edge)
                }

            })
            var data = {
                'nodes': nodes,
                'edges': edges,
                'combos':combos
            }
            console.log(data)
            //发送数据给绘图面板
            this.setTraceDataProcessed(data)

        },
    },
    watch: {
        traceData: function (newVal) {

            let dic = []
            for (let i = 0; i < newVal.length; i++) {
                //dic[0x31455]=2
                dic[newVal[i].address] = i
                newVal[i].index = i
            }
            this.trace = newVal
            this.dic = dic
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
    display: flex;
    align-items: baseline;
    margin-left: 5px;
    margin-right: 20px;
}

.paint-startAddress {
    font-size: 14px;
}

.select_btn {
    width: fit-content;
    margin-top: 5px;
    float: right;
    line-height: 14px;
    border-radius: 3px;
    background: #e3e3e3;
    color: black;
    font-size: 12px;
    padding: 2px 5px;
    margin-left: 5px;
    transition: all 300ms linear;
    cursor: pointer;
}

.select_btn:hover {
    background: #1e94ff;
    color: white;
}

</style>