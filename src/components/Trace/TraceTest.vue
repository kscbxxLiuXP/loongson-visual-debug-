<template>

    <div id="cy"></div>

</template>

<script>
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent';
import cxtmenu from 'cytoscape-cxtmenu';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);
cytoscape.use(cxtmenu);

export default {
    name: "TraceTest",
    data() {
        return {
            nodes: [
                {data: {id: '4', address: '0x378fde',},},
                {data: {id: '5', address: '0x378fde',},},
                {data: {id: '6', address: '0x378fde',},},
                {data: {id: '7', address: '0x378fde',},},
                {data: {id: '8', address: '0x378fde',},},
                {data: {id: '9', address: '0x378fde',},},
                {data: {id: '3', address: '0x378fde',},},
                {data: {id: '10', address: '0x378fde',},},
                {data: {id: '11', address: '0x378fde',},},
                {data: {id: '12', address: '0x378fde',},},
                {data: {id: '13', address: '0x378fde',},},
                {data: {id: '14', address: '0x378fde',},},
                {data: {id: '15', address: '0x378fde',},},
                {data: {id: '16', address: '0x378fde',},},

            ],
            edges: [
                {data: {source: '4', target: '5'}},
                {data: {source: '6', target: '7'}},
                {data: {source: '6', target: '12'}},
                {data: {source: '3', target: '4'}},
                {data: {source: '13', target: '14'}},
                {data: {source: '5', target: '4'}},
                {data: {source: '7', target: '8'}},
                {data: {source: '10', target: '11'}},
                {data: {source: '4', target: '6'}},
                {data: {source: '12', target: '13'}},
                {data: {source: '8', target: '9'}},
                {data: {source: '9', target: '10'}},
                {data: {source: '15', target: '16'}},
                {data: {source: '11', target: '4'}},
                {data: {source: '14', target: '15'}},

            ],
        }
    },
    methods: {
        createCytoscape() {
            cytoscape.warnings(false);
            const cy = cytoscape({
                container: document.getElementById('cy'),
                boxSelectionEnabled: false,
                userZoomingEnabled: true, //滚轮缩放
                wheelSensitivity: 0.1,
                autounselectify: false,
                autoungrabify: true,
                layout: {
                    // name: 'grid',
                    // name: 'breadthfirst',
                    // name: 'coseBilkent',
                    name: 'dagre',
                    nodeDimensionsIncludeLabels: true,
                },
                style: [
                    {
                        selector: 'node',
                        style: {
                            'content': 'data(address)',
                            "shape": "round-rectangle",
                            'text-opacity': 0.5,
                            "height": 40,
                            "width": 40,
                            'pie-size': '100%',
                            'text-valign': 'center',
                            'text-halign': 'left',

                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            "curve-style": "taxi",
                            "taxi-direction": "downward",
                            "taxi-turn": 20,
                            "taxi-turn-min-distance": 5,
                            width: 3,
                            'target-arrow-shape': 'triangle',
                        }
                    },

                ],
                elements: {
                    nodes: this.nodes,
                    edges: this.edges,
                }
            });
            cy.cxtmenu({
                selector: 'node',
                commands: [
                    {
                        content: 'Info',
                        select: function (ele) {
                            console.log(ele.id());
                        }
                    },
                    {
                        content: '跳转到该TB',
                        select: function (ele) {
                            console.log(ele.data('address'));
                        },
                        // enabled: false
                    },
                    // {
                    //     content: '<span class="fa fa-star fa-2x"></span>',
                    //     select: function (ele) {
                    //         console.log(ele.data('address'));
                    //     },
                    //     // enabled: false
                    // },
                    //
                ]
            });

            cy.on('tap', 'node', function (evt) {
                var node = evt.target;
                console.log('tapped ' + node.id());
            });
        }
    },
    mounted() {
        this.createCytoscape()
    }
}
</script>

<style scoped>

</style>