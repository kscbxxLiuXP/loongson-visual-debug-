<template>
    <div id="container"></div>
</template>

<script>
import G6, {Minimap} from '@antv/g6';

export default {
    name: "Trace",
    props: [
        //已经处理过的图数据
        'traceDataProcessed',
        'jumpTB'
    ],
    data() {
        return {
            data: {
                nodes: [
                    {id: '', address: '', tbaddress: '', tbindex: '', tbtype: '',},
                ],
                edges: [
                    {source: '', target: ''},
                ],
            },
            graph: null
        }
    },
    methods: {
        resetSize(width, height) {
            if (this.graph !== null) {

                this.graph.changeSize(width, height);
            }
        },
        createTrace() {
            G6.registerNode(
                'node',
                {
                    drawShape(cfg, group) {
                        const rect = group.addShape('rect', {
                            attrs: {
                                x: -75,
                                y: -25,
                                width: 150,
                                height: 50,
                                radius: 10,
                                stroke: '#5B8FF9',
                                fill: '#C6E5FF',
                                lineWidth: 3,
                            },
                            name: 'rect-shape',
                        });
                        if (cfg.address) {
                            group.addShape('text', {
                                attrs: {
                                    text: '[' + cfg.id + '] ' + cfg.address,
                                    x: 0,
                                    y: 0,
                                    fill: '#00287E',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    fontWeight: 'bold',
                                },
                                name: 'text-shape',
                            });
                        }
                        return rect;
                    },
                },
                'single-node',
            );



            const container = document.getElementById('container');
            const width = container.scrollWidth;
            const height = container.scrollHeight;
            var minimap = new Minimap({
                size: [200, 150],
            });
            const tooltip = new G6.Tooltip({
                offsetX: 10,
                offsetY: 10,
                // 允许出现 tooltip 的 item 类型
                itemTypes: ['node', 'edge'],
                // custom the tooltip's content
                // 自定义 tooltip 内容
                getContent: (e) => {
                    const outDiv = document.createElement('div');
                    outDiv.style.width = 'fit-content';
                    let model = e.item.getModel()
                    if (e.item.getType() === 'edge') {
                        let source = e.item._cfg.sourceNode._cfg.model
                        let target = e.item._cfg.targetNode._cfg.model
                        outDiv.innerHTML = `
                        <div>
                            <div style='font-size: 18px;'> <span>${model.styleType==='link'?'': '间接跳转'}</span>  ${source.address} <span style="font-size: 40px;line-height: 16px">→ </span> ${target.address}</div>
                        </div>`;
                    } else {
                        outDiv.innerHTML = `
                        <div>
                            <div style='font-size: 14px;font-weight: bold'>${model.address}</div>
                            <div style='margin-top: 5px'>id: TB-${model.id}</div>

                            <div style='margin-top: 5px;display: flex;align-items: center' >tbtype:
                                <div style='background-color: ##fff0f6;padding: 1px 2px;margin-left: 5px;border: #ffadd2 1px solid;color: #c41d93'>${model.tbtype === '' ? '无' : model.tbtype}</div>
                            </div>
                        </div>`;
                    }

                    return outDiv;
                },
            });
            const contextMenu = new G6.Menu({
                getContent(evt) {
                    return `
                    <div>跳转到TB块</div>
                        `;
                },
                handleMenuClick: (target, item) => {
                    let id = parseInt(item._cfg.model.id)
                    this.jumpTB(id)
                },
                // offsetX and offsetY include the padding of the parent container
                // 需要加上父级容器的 padding-left 16 与自身偏移量 10
                offsetX: 20,
                // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
                offsetY: 0,
                // the types of items that allow the menu show up
                // 在哪些类型的元素上响应
                itemTypes: ['node',],
            });
            const graph = new G6.Graph({
                container: 'container',
                width,
                height,
                groupByTypes: false,
                plugins: [minimap, contextMenu, tooltip],
                layout: {
                    type: 'dagre',
                    nodesep: 50,
                    ranksep: 70,
                    controlPoints: true,
                },
                defaultCombo: {
                    type: 'rect',
                    /* The minimum size of the combo. combo 最小大小 */
                    size: [50, 50],
                    /* style for the keyShape */
                    // style: {
                    //   lineWidth: 1,
                    // },
                    labelCfg: {
                        /* label's offset to the keyShape */
                        // refY: 10,
                        /* label's position, options: center, top, bottom, left, right */
                        position: 'top',
                        /* label's style */
                        style: {
                          fontSize: 18,
                        },
                    },
                },
                defaultNode: {
                    // shape: 'rect',
                    type: 'node',
                },
                defaultEdge: {
                    type: 'polyline',
                    style: {
                        radius: 10,
                        offset: 30,
                        lineWidth: 3,
                        stroke: '#C2C8D5',
                    },
                },
                edgeStateStyles: {
                    link: {
                        radius: 10,
                        offset: 30,
                        stroke: '#c3c3c3',
                        lineWidth: 1,
                        shadowBlur: 0,
                        endArrow:true
                    },
                    // edge style of active state
                    linkActive: {
                        lineWidth: 4,
                        opacity: 0.5,
                        stroke: '#0900ff',
                        endArrow:true,
                    },
                    // edge style of selected state

                    linkHover: {
                        endArrow:true,
                        stroke: '#f00',
                        lineWidth: 4,
                        shadowBlur: 0
                    },
                    linkHighlight: {
                        endArrow:true,
                        stroke: '#f00',
                        lineWidth: 4,
                        shadowBlur: 0
                    },
                    dot: {
                        lineDash:  [5, 5] ,
                        stroke: '#bcb7b7',
                        lineWidth: 4,
                        shadowBlur: 0,
                        endArrow: false
                    },
                    dotHover: {
                        lineDash:  [5, 5] ,
                        endArrow: false,

                        stroke: '#f00',
                        lineWidth: 4,
                        shadowBlur: 0,
                    },
                    dotActive: {
                        lineDash:  [5, 5] ,


                        endArrow: false,

                        stroke: '#f00',
                        lineWidth: 4,
                        shadowBlur: 0,
                    },
                    dotHighlight: {
                        lineDash:  [10, 20] ,

                        endArrow: false,

                        stroke: '#f00',
                        lineWidth: 4,
                        shadowBlur: 0,
                    },
                },
                nodeStateStyles: {
                    selected: {
                        stroke: '#d9d9d9',
                        fill: '#5394ef',

                    },
                    highlight: {
                        stroke: '#d9d9d9',
                        fill: '#5394ef',

                    },
                },
                modes: {
                    default: [
                        'drag-canvas',
                        'zoom-canvas',
                        'click-select',
                        'collapse-expand-combo',
                        'drag-combo',

                    ],
                },
                fitView: true,
            });
            const clearStates = () => {
                graph.getNodes().forEach((node) => {
                    graph.clearItemStates(node);
                });
                initEdge()
            };

            const initEdge = () => {
                graph.getEdges().forEach((edge) => {
                    graph.clearItemStates(edge);
                    if (edge._cfg.model.styleType !== 'link') {
                        graph.setItemState(edge, 'dot', true)
                    } else {
                        graph.setItemState(edge, 'link', true);
                    }

                });
            }


            graph.on('canvas:click', (e) => {
                clearStates();
            });

            graph.on('edge:mouseenter', (evt) => {
                const {item} = evt;
                if (item._cfg.model.styleType !== 'link') {
                    graph.setItemState(item, 'dotHover', true)
                } else {
                    graph.setItemState(item, 'linkHover', true);
                }

            });

            graph.on('edge:mouseleave', (evt) => {
                const {item} = evt;
                if (item._cfg.model.styleType !== 'link') {
                    graph.setItemState(item, 'dotHover', false)
                } else {
                    graph.setItemState(item, 'linkHover', false);
                }
            });
            graph.on('edge:click', (evt) => {
                initEdge()
                const {item} = evt;
                if (item._cfg.model.styleType !== 'link') {
                    graph.setItemState(item, 'dotActive', true)
                } else {
                    graph.setItemState(item, 'linkActive', true);
                }
            });
            graph.on('canvas:click', (evt) => {
               initEdge()
            });

            graph.on('combo:mouseenter', (evt) => {
                const { item } = evt;
                graph.setItemState(item, 'active', true);
            });

            graph.on('combo:mouseleave', (evt) => {
                const { item } = evt;
                graph.setItemState(item, 'active', false);
            });
            graph.on('combo:click', (evt) => {
                const { item } = evt;
                graph.setItemState(item, 'selected', true);
            });
            if (typeof window !== 'undefined')
                window.onresize = () => {
                    if (!graph || graph.get('destroyed')) return;
                    if (!container || !container.scrollWidth || !container.scrollHeight) return;
                    graph.changeSize(container.scrollWidth, container.scrollHeight);
                };
            this.graph = graph
        },
        drawPath() {
            let graph = this.graph
            const clearStates = () => {
                graph.getNodes().forEach((node) => {
                    graph.clearItemStates(node);
                });
                initEdge()
            };

            const initEdge = () => {
                graph.getEdges().forEach((edge) => {
                    graph.clearItemStates(edge);
                    if (edge._cfg.model.styleType !== 'link') {
                        graph.setItemState(edge, 'dot', true)
                    } else {
                        graph.setItemState(edge, 'link', true);
                    }

                });
            }
            const selectedNodes = graph.findAllByState('node', 'selected');
            if (selectedNodes.length !== 2) {
                alert('Please select TWO nodes!\n\r请选择有且两个节点！');
                return;
            }
            clearStates();
            const {findShortestPath} = G6.Algorithm;
            // path 为其中一条最短路径，allPath 为所有的最短路径
            const {path, allPath} = findShortestPath(
                this.data,
                selectedNodes[0].getID(),
                selectedNodes[1].getID(),
            );

            const pathNodeMap = {};
            path.forEach((id) => {
                const pathNode = graph.findById(id);
                pathNode.toFront();
                graph.setItemState(pathNode, 'highlight', true);
                pathNodeMap[id] = true;
            });
            graph.getEdges().forEach((edge) => {
                const edgeModel = edge.getModel();
                const source = edgeModel.source;
                const target = edgeModel.target;
                const sourceInPathIdx = path.indexOf(source);
                const targetInPathIdx = path.indexOf(target);
                if (sourceInPathIdx === -1 || targetInPathIdx === -1) return;
                graph.clearItemStates(edge);
                if (Math.abs(sourceInPathIdx - targetInPathIdx) === 1) {

                    if (edge._cfg.model.styleType !== 'link') {
                        graph.setItemState(edge, 'dotHighlight', true)
                    } else {
                        graph.setItemState(edge, 'linkHighlight', true);
                    }
                } else {
                    if (edge._cfg.model.styleType !== 'link') {
                        graph.setItemState(edge, 'dot', true)
                    } else {
                        graph.setItemState(edge, 'link', true);
                    }
                }
            });
            graph.getNodes().forEach((node) => {
                if (!pathNodeMap[node.getID()]) {
                    graph.setItemState(node, 'inactive', true);
                }
            });

        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                console.log("size change")
                // this.screenWidth = document.body.clientWidth
            })()
        }
    },

    watch: {
        traceDataProcessed: function (newVal, oldVal) {

            let nodes = newVal.nodes
            let edges = newVal.edges
            let combos = newVal.combos
            let d = {
                'nodes': nodes,
                'edges': edges,
                'combos':combos
            }
            this.data = d
            if (this.graph === null) {
                this.createTrace()
            }
            this.graph.clear()
            this.graph.data(d);
            this.graph.render();
            this.graph.getEdges().forEach((edge) => {
                this.graph.clearItemStates(edge);
                if (edge._cfg.model.styleType !== 'link') {
                    this.graph.setItemState(edge, 'dot', true)
                } else {
                    this.graph.setItemState(edge, 'link', true);
                }

            });
        },
    },
}
</script>

<style scoped>
#container {

    width: 100%;
    height: 100%;
}
</style>