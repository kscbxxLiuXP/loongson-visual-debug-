<template>
    <div id="instruction-analysis">
        <h3>指令翻译分析</h3>
        <el-tabs id="charts" v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="指令总数统计图" name="first">
                <div ref="chart1" id="chart1" style="height: 500px;width: 100%"></div>
            </el-tab-pane>
            <el-tab-pane label="指令总数分布图" name="second">
                <div ref="chart2" id="chart2" style="height: 500px"></div>
            </el-tab-pane>
            <el-tab-pane label="operator分布图" name="third">

                <div v-if="currentOperator===''" style="margin:50px 20px;width: 100%;text-align: center">
                    请从表格或者图表中选择一种operator
                </div>
                <div v-else ref="chart3" id="chart3" style="width: 100%;height: 600px"></div>
            </el-tab-pane>
        </el-tabs>

        <el-tabs type="card" v-model="activeTable">
            <el-tab-pane label="指令分析(全部)" name="first">
                <el-alert
                    title="展示所有指令的数据，默认排序：ir2执行次数"
                    type="info"
                    effect="dark"
                    show-icon>
                </el-alert>
                <TableAll ref="tableAll" :id="id" :instruction-types="instructionTypes" @operatorClick="operatorClick"
                          @patternClick="patternClick"
                          @drawPatternDistribute="drawPatternDistribute"/>
            </el-tab-pane>
            <el-tab-pane label="指令分析(合并pattern)" name="second">
                <el-alert
                    title="合并同一个operator下的相同pattern指令，表格中展示的operand和ir2instructions为示例数据，默认排序：ir2执行次数"
                    type="info"
                    effect="dark"
                    show-icon>
                </el-alert>
                <TablePattern ref="tablePattern" :id="id" :instruction-types="instructionTypes"
                              @operatorClick="operatorClick" @patternClick="patternClick"
                              @drawPatternDistribute="drawPatternDistribute"/>
            </el-tab-pane>
            <el-tab-pane label="指令分析(operator+pattern)" name="third">
                <el-alert
                    title="指定Operator和pattern的特定组合"
                    type="info"
                    effect="dark"
                    show-icon>
                </el-alert>
                <TableSpecific ref="tableSpecific" :id="id" :instruction-types="instructionTypes"

                              @drawPatternDistribute="drawPatternDistribute"/>
            </el-tab-pane>
            <el-tab-pane label="指令分析(合并operator)" name="forth">
                <el-alert
                    title="合并相同operator的指令，默认排序：ir2执行次数"
                    type="info"
                    effect="dark"
                    show-icon>
                </el-alert>
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
import TableSpecific from "@/views/DataAnalysis/Components/InstructionAnalysis/TableSpecific";

export default {
    name: "InstructionAnalysis",
    components: {TableSpecific, TablePattern, TableOperator, TableAll},
    props: ['id'],
    data() {
        return {
            comboOperand: false,

            instructionMapsCombo: [],
            loading: false,
            instructionTypes: [],

            activeName: 'second',
            activeTable: 'first',
            currentOperator: '',
            specificOperator: '',
            specificPattern: '',


        }
    },
    methods: {
        handleTabClick(tab, event) {
            this.$nextTick(() => {
                echarts.getInstanceByDom(this.$refs.chart1).resize()
                echarts.getInstanceByDom(this.$refs.chart2).resize()
            })
        },
        drawPatternDistribute(operator) {
            //绘制operator分布图
            this.activeName = 'second'
        },

        initChart1() {
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

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
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
                that.$refs.tablePattern.operatorFilter = params.name
                that.$refs.tablePattern.changeOperator()
                that.operatorClick(params.name)
            });
        },
        initChart2() {
            var that = this
            var chartDom = document.getElementById('chart2');
            var myChart2 = echarts.init(chartDom);
            var option;
            var data = [];
            this.instructionMapsCombo.forEach(item => {
                let d = {
                    value: item.sumir2,
                    name: item.operator
                }
                data.push(d)
            })
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    type: 'scroll',
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Operator分布',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }
                ]
            };
            myChart2.setOption(option);
            myChart2.on('click', function (params) {
                that.operatorClick(params.name)
            });
        },
        drawChart3() {
            this.$axios.get(basic_url + '/ltlogInstructionPattern/getPatternsByOperator',
                {
                    params:
                        {
                            ltid: this.id,
                            operator: this.currentOperator,
                        }
                }
            ).then(e => {
                this.loading = false
                let res = e.data
                console.log(res)
                var that = this
                var chartDom = document.getElementById('chart3');
                var myChart3 = echarts.init(chartDom);
                var option;
                var children = []
                res.forEach(e => {
                    children.push({
                        name: e.pattern,
                        value: e.ir2execute
                    })
                })
                var data = [
                    {
                        name: that.currentOperator,
                        children: children
                    }
                ]
                option = {
                    tooltip: {
                        trigger: 'item',

                        formatter: `{b}</br>{c}`
                    },
                    series: {
                        type: 'sunburst',
                        data: data,
                        radius: [0, '95%'],
                        sort: undefined,
                        emphasis: {
                            focus: 'ancestor'
                        },
                        levels: [
                            {},
                            {
                                r0: '15%',
                                r: '35%',
                                itemStyle: {
                                    borderWidth: 2,
                                    color: '#f9cd63'
                                },
                                label: {
                                    rotate: 'tangential'
                                }
                            },
                            {
                                r0: '35%',
                                r: '70%',
                                label: {
                                    position: 'outside',
                                    align: 'right'
                                },
                                itemStyle: {
                                    color: '#f06a6a'
                                }
                            },

                        ]
                    }
                };
                myChart3.setOption(option);
            })

        },
        patternClick(operator,pattern){
            this.specificOperator=operator
            this.specificPattern = pattern
            this.$refs.tableSpecific.operatorFilter = operator
            this.$refs.tableSpecific.patternFilter = pattern
            this.$refs.tableSpecific.getInstructionMapsAll()
            this.activeTable='third'

        },
        operatorClick(operator) {
            console.log(operator)
            this.currentOperator = operator
            this.activeName = "third"
            this.drawChart3()
            var view = document.getElementById('charts')

            view.scrollIntoView()

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
                this.initChart1()
                this.initChart2()
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