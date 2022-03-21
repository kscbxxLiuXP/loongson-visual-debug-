<template>
    <el-dialog
        top="40px"
        title="TB追踪图"
        center
        :visible.sync="show"
        width="1220px"
        :before-close="handleClose">

        <div class="mform">
            <div class="mform-title">
                绘制起点(TB块ID):
            </div>
            <div class="mform-input">
                <el-input size="small" v-model="startid"/>
            </div>

            <div class="mform-title">
                向后搜索步长:
            </div>
            <div class="mform-input">
                <el-input size="small" v-model="backwardDepth"/>
            </div>

            <div class="mform-title">
                向前搜索步长:
            </div>
            <div class="mform-input">
                <el-input size="small" v-model="forwardDepth"/>
            </div>

            <div class="mform-title">
                <el-button size="small" type="primary" @click="paint">绘制</el-button>
            </div>
        </div>
        <div id="cy"></div>
    </el-dialog>
</template>

<script>
import {basic_url} from "@/request/request";
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent';
import cxtmenu from 'cytoscape-cxtmenu';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);
cytoscape.use(cxtmenu);


export default {
    name: "Trace",
    props: ['visible', 'close', 'traceid'],
    data() {
        return {
            startid: 0,
            forwardDepth: 10,
            backwardDepth: 0,
            uid: -1,
            show: false,
            trace: [],
            nodes: [
                {
                    data: {
                        id: '',
                    },
                },
            ],
            edges: [
                {
                    data: {
                        source: '',
                        target: ''
                    }
                },
            ],
        }
    },
    methods: {
        handleClose(done) {
            done()
            this.close()
        },
        createCytoscape() {
            cytoscape.warnings(false);
            const cy = cytoscape({
                container: document.getElementById('cy'),
                boxSelectionEnabled: true,
                userZoomingEnabled: true, //滚轮缩放
                wheelSensitivity: 0.1,
                autounselectify: false,
                autoungrabify: true,
                layout: {
                    // name: 'grid',
                    // name: 'breadthfirst',
                    name: 'dagre',
                    // name: 'coseBilkent',

                },
                minZoom: 0.3,
                style: [{
                    selector: 'node',
                    style: {
                        'content': 'data(id)',
                        'text-opacity': 0.5,
                        "height": 40,
                        "width": 40,
                        'pie-size': '100%',
                        'text-valign': 'center',
                        'text-halign': 'left',

                        // 'pie-1-background-color': '#E8747C',
                        // 'pie-1-background-size': 'mapData(occupy, 0, 10, 0, 100)',
                    }
                },
                    {
                        selector: ':parent',
                        css: {
                            'text-valign': 'top',
                            'text-halign': 'center',
                            // 'text-halign': 'right',
                            // 'text-rotation': '90deg', //文字旋转
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            width: 3,
                            label: 'data(label)',
                            'target-arrow-shape': 'triangle',
                            // "target-arrow-fill": "hollow", //箭头填充 空心
                            'line-color': '#9dbaea',
                            'target-arrow-color': '#9dbaea',
                            'curve-style': 'bezier',
                        }
                    },

                ],
                elements: {
                    //节点数据
                    nodes: this.nodes,
                    //
                    edges: this.edges,
                }
            });
            cy.on('tap', 'node', function (evt) {
                var node = evt.target;
                console.log('tapped ' + node.id());
            });
        },

        paint() {

            var trace = this.trace
            var tracelist = trace.tracelist
            var nodes = []
            var edges = []

            console.log(tracelist[4])
            // startid: 0,
            //     forwardDepth: 10,
            //     backwardDepth: 0,
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
            console.log(visited)
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

            console.log('size:', nodess.length)
            nodess.forEach(e => {
                console.log(e.id)
            })
            console.log('size:', visited.length)
            visited.forEach(e => {
                console.log(e)
            })


            nodess.forEach(ti => {
                var nn = {
                    data: {
                        address: ti.address,
                        id: ti.id,
                        tbaddress: ti.tbaddress,
                        tbindex: ti.tbindex,
                        tbtype: ti.tbtype,
                    }
                }
                nodes.push(nn)
                ti.nextids.forEach(ii => {
                    if (visited.indexOf(ti.id) !== -1 && visited.indexOf(ii) !== -1) {
                        var edge = {
                            data: {
                                source: ti.id,
                                target: ii,
                            }
                        }
                        edges.push(edge)
                    }

                })
            })
            this.nodes = nodes
            this.edges = edges
            this.createCytoscape()
        },
    },
    mounted() {

    },
    watch: {
        traceid: function (newVal, oldVal) {
            this.uid = newVal
            if (newVal !== -1) {
                console.log(newVal)
                this.$axios.get(basic_url + "/trace/get",
                    {
                        params: {
                            id: newVal
                        }
                    }
                ).then(e => {
                    this.trace = e.data
                }).then(e => {
                    // this.createCytoscape()
                })
            }
        },
        visible: function (newVal, oldVal) {
            this.show = newVal
        },
    },

}
</script>

<style scoped>
#cy {
    margin-left: -20px;
    width: 1200px;
    height: 700px;
}

.mform {
    display: flex;
    align-items: center;
}

.mform-title {

}

.mform-input {
    margin-left: 5px;
    margin-right: 20px;
    width: 80px;
}
</style>