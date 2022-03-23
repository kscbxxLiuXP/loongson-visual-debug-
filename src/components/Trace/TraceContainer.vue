<template>
    <div style="height: 100%">
        <div v-if="uid===-1" class="trace-upload">
            <MUpload
                :small="true"
                :address="uploadAddress()"
                :tip-text="'Trace'"
                :before-upload-callback="beforeUploadcallback"
                :fail-callback="failcallback"
                :success-callback="successcallBack"
            />


        </div>
        <Trace :traceData="data" v-if="uid!==-1" :jump-t-b="jumpTB"/>
    </div>
</template>

<script>
import Trace from "@/components/Trace/Trace";
import {basic_url} from "@/request/request";
import MUpload from "@/components/MUpload";

export default {
    name: "TraceContainer",
    props: ['ltlog', 'jumpTB'],
    components: {MUpload, Trace},
    data() {
        return {
            startid: 0,
            forwardDepth: 10,
            backwardDepth: 0,
            uid: -1,
            trace: [],
            ltid: -1,
            data: {
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
            },


        }
    },
    methods: {
        successcallBack(response) {
            let trace = response
            this.uid = trace.uid
            this.trace = trace
        },
        failcallback() {

        },
        beforeUploadcallback() {

        },
        uploadAddress: function () {

            return basic_url + '/uploadTrace?ltid=' + this.ltid
        },

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
            var a = {
                'nodes': nodes,
                'edges': edges
            }
            this.data = a

        },
    },
    watch: {
        ltlog: function (newVal, oldVal) {

            let traceid = newVal.traced ? newVal.traceid : -1
            this.uid = parseInt(traceid)
            this.ltid = parseInt(newVal.uid)

            if (traceid !== -1) {
                this.$axios.get(basic_url + "/trace/get",
                    {
                        params: {
                            id: traceid
                        }
                    }
                ).then(e => {
                    this.trace = e.data
                })
            }
        },
    },
}
</script>

<style scoped>


.trace-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.offline-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.offline {
    width: 500px;
    height: 300px;
    /*border: #ff8d02 1px solid;*/
    border-radius: 10px;
    background-color: #f7f8f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 300ms;
}

.offline-icon {
    text-align: center;
    font-size: 80px;
}

.offline-text {
    margin-top: 20px;
    text-align: center;
    font-size: 25px;
}

.offline:hover {
    background-color: #fcce9e;
    color: white;
    cursor: pointer;
}

</style>