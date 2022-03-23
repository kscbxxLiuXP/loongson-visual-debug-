<template>
    <div id="container" style="position: relative;width: 100%;height: 100%">

    </div>
</template>

<script>
import G6, {Minimap} from '@antv/g6';

export default {
    name: "AntvTest",
    data() {
        return {
            data: {
                nodes: [
                    {id: '4', address: '0x378fde4', tbaddress: '0xffffff04', tbindex: '4', tbtype: '',},
                    {id: '5', address: '0x378fde5', tbaddress: '0xffffff05', tbindex: '5', tbtype: 'syscall',},
                    {id: '6', address: '0x378fde6', tbaddress: '0xffffff06', tbindex: '6', tbtype: 'syscall',},
                    {id: '7', address: '0x378fde7', tbaddress: '0xffffff07', tbindex: '7', tbtype: 'syscall',},
                    {id: '8', address: '0x378fde8', tbaddress: '0xffffff08', tbindex: '8', tbtype: 'syscall',},
                    {id: '9', address: '0x378fde9', tbaddress: '0xffffff09', tbindex: '9', tbtype: 'syscall',},
                    {id: '3', address: '0x378fde3', tbaddress: '0xffffff03', tbindex: '3', tbtype: 'syscall',},
                    {id: '10', address: '0x378fde10', tbaddress: '0xffffff010', tbindex: '10', tbtype: 'syscall',},
                    {id: '11', address: '0x378fde11', tbaddress: '0xffffff011', tbindex: '11', tbtype: 'syscall',},
                    {id: '12', address: '0x378fde12', tbaddress: '0xffffff012', tbindex: '12', tbtype: 'syscall',},
                    {id: '13', address: '0x378fde13', tbaddress: '0xffffff013', tbindex: '13', tbtype: 'syscall',},
                    {id: '14', address: '0x378fde14', tbaddress: '0xffffff014', tbindex: '14', tbtype: 'syscall',},
                    {id: '15', address: '0x378fde15', tbaddress: '0xffffff015', tbindex: '15', tbtype: 'syscall',},
                    {id: '16', address: '0x378fde16', tbaddress: '0xffffff016', tbindex: '16', tbtype: 'syscall',},

                ],
                edges: [
                    {source: '4', target: '5'},
                    {source: '6', target: '7'},
                    {source: '6', target: '12'},
                    {source: '3', target: '4'},
                    {source: '13', target: '14'},
                    {source: '5', target: '4'},
                    {source: '7', target: '8'},
                    {source: '10', target: '11'},
                    {source: '4', target: '6'},
                    {source: '12', target: '13'},
                    {source: '8', target: '9'},
                    {source: '9', target: '10'},
                    {source: '15', target: '16'},
                    {source: '11', target: '4'},
                    {source: '12', target: '4'},
                    {source: '14', target: '15'},
                ],
            }

        }
    },
    methods: {
        createAntv() {
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
                                    text: '[' + cfg.tbindex + '] ' + cfg.address,
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
            const height = container.scrollHeight || 500;
            var minimap = new Minimap({
                size: [container.scrollWidth / 4, container.scrollHeight / 4]
            });
            const contextMenu = new G6.Menu({
                getContent(evt) {

                    return `
                    <div>跳转到TB块</div>
                        `;
                },
                handleMenuClick: (target, item) => {
                    console.log(target, item._cfg.model.id);
                },
                // offsetX and offsetY include the padding of the parent container
                // 需要加上父级容器的 padding-left 16 与自身偏移量 10
                offsetX: -180,
                // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
                offsetY: -45,
                // the types of items that allow the menu show up
                // 在哪些类型的元素上响应
                itemTypes: ['node',],
            });
            const graph = new G6.Graph({
                container: 'container',
                width,
                height,
                plugins: [minimap, contextMenu],
                layout: {
                    type: 'dagre',
                    nodesep: 50,
                    ranksep: 70,
                    controlPoints: true,
                },
                defaultNode: {
                    // shape: 'rect',
                    type: 'node',
                },
                defaultEdge: {
                    type: 'polyline',
                    style: {
                        radius: 20,
                        offset: 45,
                        endArrow: true,
                        lineWidth: 2,
                        stroke: '#C2C8D5',
                    },
                },
                nodeStateStyles: {
                    selected: {
                        stroke: '#d9d9d9',
                        fill: '#5394ef',

                    },
                },
                edgeStateStyles: {
                    selected: {
                        stroke: '#5394ef',
                    },
                },
                modes: {
                    default: [
                        'drag-canvas',
                        'zoom-canvas',
                        'click-select',
                        {
                            type: 'tooltip',
                            formatText(model) {

                                const text = [];
                                text.push('<div>')

                                text.push("<div style='font-size: 14px;font-weight: bold'>" + model.address + "</div>")
                                text.push("<div style='margin-top: 5px'>id: TB-" + model.id + "</div>")
                                if (model.tbtype !== "") {
                                    text.push("<div style='margin-top: 5px;display: flex;align-items: center'>tbtype:" +
                                        "<div style='background-color: ##fff0f6;padding: 1px 2px;margin-left: 5px;border: #ffadd2 1px solid;color: #c41d93'>" + model.tbtype + "</div>" +
                                        "</div>")
                                }


                                text.push('</div>')

                                return text.join("")
                            },
                            offset: -90


                        },
                    ],
                },
                fitView: true,
            });

            graph.on('edge:mouseenter', ev => {
                const item = ev.item;
                graph.update(item, {
                    type: 'polyline',
                    style: {
                        radius: 20,
                        offset: 45,
                        endArrow: true,
                        lineWidth: 5,
                        stroke: '#898b8c',
                    },

                });
            });
            graph.on('edge:mouseleave', ev => {
                const item = ev.item;
                graph.update(item, {
                    type: 'polyline',
                    style: {
                        radius: 20,
                        offset: 45,
                        endArrow: true,
                        lineWidth: 2,
                        stroke: '#C2C8D5',
                    },
                });
            });

            graph.data(this.data);
            graph.render();
        }
    },
    mounted() {
        this.createAntv()
    }
}
</script>

<style>
.g6-component-contextmenu {
    position: absolute;

    padding: 5px 0;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    opacity: 1;
}

.g6-component-contextmenu div {
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 300ms;
}

.g6-component-contextmenu div:hover {
    background-color: #ecf5ff;
    color: #66b1ff;

}


</style>
