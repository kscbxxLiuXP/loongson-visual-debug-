<template>
    <div id="instruction-analysis">
        <h3>指令翻译分析</h3>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="指令总数统计图" name="first">
                <div id="chart1" style="height: 500px"></div>
            </el-tab-pane>
            <el-tab-pane label="指令总数分布图" name="second">
                <div id="chart1" style="height: 500px"></div>
            </el-tab-pane>
            <el-tab-pane label="operator分布图" name="third">
                operator分布图
            </el-tab-pane>

            <el-tab-pane label="Tab4" name="fourth">
                定时任务补偿
            </el-tab-pane>
        </el-tabs>

        <el-tabs type="card" v-model="activeTable">
            <el-tab-pane label="指令分析(全部)" name="first">
                <TableAll ref="tableAll" :id="id" :instruction-types="instructionTypes"
                          @drawPatternDistribute="drawPatternDistribute"/>
            </el-tab-pane>
            <el-tab-pane label="指令分析(合并pattern)" name="second">
                <TablePattern ref="tablePattern" :id="id" :instruction-types="instructionTypes"
                              @drawPatternDistribute="drawPatternDistribute"/>
            </el-tab-pane>
            <el-tab-pane label="指令分析(合并operator)" name="third">
                <TableOperator :loading="loading" :instruction-maps-combo="instructionMapsCombo"/>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
import {basic_url} from "@/request/request";
import * as echarts from 'echarts';
import TableAll from "@/views/DataAnalysis/Components/InstructionAnalysis/TableAll";
import TableOperator from "@/views/DataAnalysis/Components/InstructionAnalysis/TableOperator";
import TablePattern from "@/views/DataAnalysis/Components/InstructionAnalysis/TablePattern";

export default {
    name: "InstructionAnalysis",
    components: {TablePattern, TableOperator, TableAll},
    props: ['id'],
    data() {
        return {
            comboOperand: false,

            instructionMapsCombo: [],
            loading: false,
            instructionTypes: [],

            activeName: 'first',
            activeTable: 'first'


        }
    },
    methods: {
        drawPatternDistribute(operator) {
            //绘制operator分布图
            this.activeName = 'second'
        },

        initChart() {
            var that = this
            var chartDom = document.getElementById('chart1');
            var myChart = echarts.init(chartDom);
            var option;
            var xLabel = []
            var yData = []
            this.instructionMapsCombo.forEach(item => {
                xLabel.push(item.operator)
                yData.push(item.sumir2)
            })
            option = {
                title: {
                    text: '指令数统计绘图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: `{b}:{c}`
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom: [
                    {
                        show: true,
                        start: 0,
                        end: 20
                    },
                    {
                        type: 'inside',
                        start: 94,
                        end: 100
                    },
                    {
                        show: true,
                        yAxisIndex: 0,
                        filterMode: 'empty',
                        width: 30,
                        height: '80%',
                        showDataShadow: false,
                        left: '93%'
                    }
                ],
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category',
                    data: xLabel
                },
                series: [
                    {
                        name: 'ir1',
                        type: 'bar',
                        data: yData
                    }
                ]
            };
            myChart.setOption(option);
            myChart.on('click', function (params) {
                that.$refs.tableAll.operatorFilter = params.name
                that.$refs.tableAll.changeOperator()
            });
        },

        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },

        getInstructionMapsComboed() {
            this.loading = true
            this.$axios.get(basic_url + '/ltlogInstructionMap/getCombo',
                {
                    params:
                        {
                            ltid: this.id,
                        }
                }
            ).then(e => {
                this.loading = false
                this.instructionMapsCombo = e.data
            }).then(_ => {
                this.initChart()
            })
        },


        getInstructionTypes() {
            this.$axios.get(basic_url + '/ltlogInstructionMap/getInstructionTypes',
                {
                    params:
                        {
                            ltid: this.id,
                        }
                }
            ).then(e => {
                this.loading = false
                this.instructionTypes = e.data
            })
        }
    },
    mounted() {
        this.getInstructionTypes()
        this.getInstructionMapsComboed()

    }
}
</script>

<style scoped>

</style>