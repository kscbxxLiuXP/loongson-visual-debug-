<template>
    <div id="instruction-analysis">
        <h3>指令翻译分析</h3>
        <div id="chart" style="height: 500px"></div>
        <div>
            合并操作符与操作数
            <el-switch
                v-model="comboOperand"
            >
            </el-switch>
        </div>

        <div v-if="!comboOperand">
            <div style="margin-top: 10px">
                <span>Operator:</span>
                <el-select size="small" v-model="operatorFilter" filterable placeholder="请选择" clearable
                           @change="changeOperator">
                    <el-option
                        v-for="item in instructionTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span>排序:</span>
                <el-select size="small" v-model="orderFilter" filterable placeholder="请选择" @change="changeOrder">
                    <el-option
                        label="升序"
                        value="asc">
                    </el-option>
                    <el-option
                        label="降序"
                        value="desc">
                    </el-option>
                </el-select>

            </div>

            <el-table
                v-loading="loading"
                size="small"
                :summary-method="getSummaries"
                border
                show-summary
                :data="instructionMaps"
                style="width: 100%;margin-top: 10px;font-size: 14px">
                <el-table-column
                    fixed
                    label="序号"
                    width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{
                                (instructionMapsCurrentPage - 1) * pageSize + scope.$index + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="ltid" prop="ltid" width="110"></el-table-column>
                <el-table-column label="indexx" prop="indexx" width="120"></el-table-column>
                <el-table-column label="operator" prop="operator" width="100"></el-table-column>
                <el-table-column label="operand" prop="operand" min-width="200"></el-table-column>
                <el-table-column label="ir1instruction" width="400">
                    <template slot-scope="scope">
                        <div>
                            <span class="ir1-operator">{{ scope.row.operator }}</span>
                            <span class="ir2-operand">{{ scope.row.operand }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="ir2instruction" width="400">
                    <template slot-scope="scope">
                        <div class="ir2instruction"
                             v-for="(item,index) in resolveInstruction(scope.row.ir2instruction)">
                            <span class="ir2-operator">{{ item.split(' ')[0] }}</span>
                            <span class="ir2-operand">{{ item.split(' ')[1] }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="num" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ toThousand(scope.row.num) }}</span>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination
                @current-change="handleCurrentChangeInstructionMaps"
                :current-page.sync="instructionMapsCurrentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="instructionMapsTotal">
            </el-pagination>
        </div>
        <div v-if="comboOperand">
            <el-table
                v-loading="loading"
                size="small"
                border
                :data="instructionMapsCombo"
                style="width: 100%;margin-top: 10px;font-size: 14px">
                <el-table-column
                    fixed
                    label="序号"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="operator" prop="operator"></el-table-column>
                <el-table-column label="num" fixed="right">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ toThousand(scope.row.num) }}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";
import * as echarts from 'echarts';

export default {
    name: "InstructionAnalysis",
    props: ['id'],
    data() {
        return {
            comboOperand: false,
            instructionMaps: [],
            instructionMapsCurrentPage: 1,
            instructionMapsTotal: 0,
            pageSize: 10,
            instructionMapsCombo: [],
            loading: false,
            instructionTypes: [],
            operatorFilter: '',
            orderFilter: 'desc',
            sum:0,

        }
    },
    methods: {
        changeOrder(val) {
            this.getInstructionMaps()
        },
        changeOperator(val) {
            this.getInstructionMaps()
        },
        initChart() {
            var chartDom = document.getElementById('chart');
            var myChart = echarts.init(chartDom);
            var option;
            var xLabel = []
            var yData =[]
            this.instructionMapsCombo.forEach(item=>{
                xLabel.push(item.operator)
                yData.push(item.num)
            })
            option = {
                title: {
                    text: '指令数统计绘图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
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
        },
        resolveInstruction(instructions) {
            return JSON.parse(instructions)
        },
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        getInstructionMaps() {
            this.loading = true
            this.$axios.get(basic_url + '/ltlogInstructionMap/getAll',
                {
                    params:
                        {
                            operator: this.operatorFilter,
                            order: this.orderFilter,
                            ltid: this.id,
                            currentPage: this.instructionMapsCurrentPage,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                this.loading = false
                this.instructionMaps = e.data.records
                this.instructionMapsTotal = e.data.total
                this.sum = e.data.sum
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
        handleCurrentChangeInstructionMaps(val) {
            // console.log('change')
            this.instructionMapsCurrentPage = val
            this.getInstructionMaps()
        },
        getSummaries(param) {
            const {columns, data} = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计';
                    return;
                }
                sums[7] = this.toThousand( this.sum)
            });

            return sums;
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
        this.getInstructionMaps()
        this.getInstructionMapsComboed()

    }
}
</script>

<style scoped>
.ir2-operator {
    display: inline-block;
    width: 150px;
}

.ir1-operator {
    display: inline-block;
    width: 100px;
}

.ir2instruction {
    padding: 0 10px;
    border-radius: 5px;
    border: transparent 1px solid;
    transition: all 300ms;
}

.ir2instruction:hover {
    border: black 1px solid;
}

.ir2-operand {

}
</style>