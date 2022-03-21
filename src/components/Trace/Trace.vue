<template>
    <div id="cy"></div>
</template>

<script>
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);
cytoscape.use(cxtmenu);


export default {
    name: "Trace",
    props: ['traceData', 'jumpTB'],
    data() {
        return {
            nodes: [
                {data: {id: ''},},
            ],
            edges: [
                {data: {source: '', target: ''}},
            ],
        }
    },
    methods: {
        createCytoscape() {
            cytoscape.warnings(false);
            var that = this;
            const cy = cytoscape({
                container: document.getElementById('cy'),
                boxSelectionEnabled: false,
                userZoomingEnabled: true, //滚轮缩放
                wheelSensitivity: 0.1,
                autounselectify: false,
                autoungrabify: true,
                layout: {
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
                            that.jumpTB()
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

    watch: {
        traceData: function (newVal, oldVal) {
            let nodes = newVal.nodes
            let edges = newVal.nodes
            this.nodes = nodes
            this.edges = edges
            this.createCytoscape()
        },
    },
}
</script>

<style scoped>

</style>