<template>
    <div>
        <div style="margin-top: 10px">
            <span>当前组合:</span>
            {{ operatorFilter }}{{ patternFilter }}
        </div>
        <div v-if="operatorFilter===''&&patternFilter===''"
             style="text-align: center;align-items: center;height: 200px;display: flex;justify-content: center">
            <div>
                请在其他标签页筛选opertaor和pattern
                (点击表格中的pattern标签)
            </div>

        </div>
        <el-table
            v-if="operatorFilter!==''&&patternFilter!==''"
            v-loading="loading"
            :data="instructionMaps"
            :summary-method="getSummaries"
            border
            show-summary
            size="small"
            style="width: 100%;margin-top: 10px;font-size: 14px"
            @sort-change="handleSort">
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


            <el-table-column header-align="center" label="ir1指令">
                <el-table-column label="operator" prop="operator" width="100">
                    <template slot-scope="scope">
                        <el-popover placement="top" trigger="hover"
                                    @show="operatorPopoverShow(scope.row.operator, scope.row.pattern)">
                            <div class="pattern-filter">
                                <span class="pattern-filter-pattern">{{ scope.row.operator }}</span>
                            </div>
                            <div style="margin-top: 5px">
                                ir1总计：{{ toThousand(operatorInfo.ir1execute) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator" style="font-size: 12px">本条指令占</span> :
                                    {{ (scope.row.ir1execute / operatorInfo.ir1execute * 100).toFixed(6) }}%
                                </div>

                            </div>
                            <div style="margin-top: 5px">
                                ir2总计：{{ toThousand(operatorInfo.ir2execute) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator" style="font-size: 12px">本条指令占</span> :
                                    {{ (scope.row.ir2execute / operatorInfo.ir2execute * 100).toFixed(6) }}%
                                </div>
                            </div>
                            <!--                            <el-button v-if="operatorFilter===''" size="mini" type="text"-->
                            <!--                                       @click="hideOperator(scope.row.operator)">隐藏{{ scope.row.operator }}-->
                            <!--                            </el-button>-->

                            <div slot="reference" class="table-operator">
                                {{
                                    scope.row.operator
                                }}
                            </div>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column label="operand" min-width="200" prop="operand">
                    <template slot-scope="scope">
                        <span>{{ scope.row.operand }}</span>
                        <el-popover placement="top" trigger="hover">
                            <div class="pattern-filter">
                                <span class="pattern-filter-pattern">源自以下TB index:</span>
                            </div>
                            <ul>
                                <li :key="index" v-for="(item,index) in JSON.parse(scope.row.tbs) ">TB-{{item}}</li>
                            </ul>

                            <span slot="reference" style="margin-left: 10px" class="table-operator"><i class="fa fa-crosshairs"/>定位出处</span>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column label="pattern" min-width="200" prop="pattern">
                    <template slot-scope="scope">
                        <el-popover placement="top" trigger="hover"
                                    @show="patternPopoverShow(scope.row.operator, scope.row.pattern)">
                            <div class="pattern-filter">
                                <span class="pattern-filter-operator">{{ scope.row.operator }}</span>
                                <span class="pattern-filter-pattern">{{ scope.row.pattern }}</span>
                            </div>
                            <div style="margin-top: 5px">
                                ir1总计：{{ toThousand(patternInfo.ir1execute) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator">{{ scope.row.operator }}</span> :
                                    {{ patternInfo.percentageir1Operator }}%
                                </div>
                                <div style="margin-top: 5px">
                                    <span class="pattern-filter-operator" style="font-size: 12px">总</span> :
                                    {{ patternInfo.percentageir1All }}%
                                </div>
                            </div>
                            <div style="margin-top: 5px">
                                ir2总计：{{ toThousand(patternInfo.ir2execute) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator">{{ scope.row.operator }}</span> :
                                    {{ patternInfo.percentageir2Operator }}%
                                </div>
                                <div style="margin-top: 5px">
                                    <span class="pattern-filter-operator" style="font-size: 12px">总</span> :
                                    {{ patternInfo.percentageir2All }}%
                                </div>
                            </div>
                            <!--                            <el-button v-if="comboBtnVisible(scope.row.operator,scope.row.pattern)"-->
                            <!--                                       size="mini"-->
                            <!--                                       type="text"-->
                            <!--                                       @click="comboPattern(scope.row.operator,scope.row.pattern)">合并此类型-->
                            <!--                            </el-button>-->
                            <!--                            <el-button v-if="!comboBtnVisible(scope.row.operator,scope.row.pattern)" size="mini"-->
                            <!--                                       type="text"-->
                            <!--                                       @click="cancelCombo(scope.row.operator,scope.row.pattern)">取消合并-->
                            <!--                            </el-button>-->
                            <!--                            <el-button size="mini" type="text"-->
                            <!--                                       @click="hidePattern(scope.row.operator,scope.row.pattern)">隐藏这一类指令-->
                            <!--                            </el-button>-->

                            <div slot="reference" class="pattern"
                                 @click="patternClick(scope.row.operator,scope.row.pattern)">
                                {{ scope.row.pattern }}
                            </div>
                        </el-popover>
                        <!--                        <span-->
                        <!--                            v-if="!scope.row.uid"-->
                        <!--                            style="padding: 2px 5px; background: #fff0f6; border: #ffacd1 1px solid; color: #cc3794;border-radius: 3px; font-size: 12px;">-->
                        <!--                            已合并-->
                        <!--                        </span>-->
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="ir2指令" width="400">
                <template slot-scope="scope">
                    <div v-for="(item,index) in resolveInstruction(scope.row.ir2instruction)"
                         class="ir2instruction">
                        <span class="ir2-operator">{{ item.split(' ')[0] }}</span>
                        <span class="ir2-operand">{{ item.split(' ')[1] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="ir1:ir2" prop="ir2num" sortable="custom">
                <template slot-scope="scope">
                    <span>1:{{ scope.row.ir2num }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="ir1执行次数" min-width="100" prop="ir1execute" sortable="custom">
                <template slot-scope="scope">
                    <div>{{ toThousand(scope.row.ir1execute) }}</div>
                    <div>({{
                            (scope.row.num / sumir1 * 100) < 0.001 ? '<0.001' : (scope.row.ir1execute / sumir1 * 100).toFixed(3)
                        }}%)
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="ir2执行次数" min-width="100" prop="ir2execute" sortable="custom">
                <template slot-scope="scope">
                    <div>{{ toThousand(scope.row.ir2execute) }}</div>
                    <div>({{
                            (scope.row.ir2execute / sumir2 * 100) < 0.001 ? '<0.001' : (scope.row.ir2execute / sumir2 * 100).toFixed(3)
                        }}%)
                    </div>
                </template>
            </el-table-column>

        </el-table>

        <el-pagination
            v-if="operatorInfo!==''&&patternFilter!==''"
            @current-change="handleCurrentChangeInstructionMaps"
            :current-page.sync="instructionMapsCurrentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="instructionMapsTotal">
        </el-pagination>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "TableSpecific",
    props: ['id', 'instructionTypes'],
    data() {
        return {
            operatorFilter: '',
            patternFilter: '',
            orderFilter: 'desc',
            orderBy: 'ir2execute',
            sumir1: 0,
            sumir2: 0,
            instructionMaps: [],
            instructionMapsCurrentPage: 1,
            instructionMapsTotal: 0,
            pageSize: 10,
            loading: false,
            patterns: [],
            patternInfo: {
                ir1execute: 0,
                ir2execute: 0,
                percentageir1All: 0,
                percentageir1Operator: 0,
                percentageir2All: 0,
                percentageir2Operator: 0,

            },
            operatorInfo: {
                ir1execute: 0,
                ir2execute: 0,
            },
            specificOperator: '',
            specificPattern: '',
        }
    },
    methods: {

        //跳转到绘图
        patternClick(operator, pattern) {
            //绘图operator下所有pattern的分布情况
            this.$emit('drawPatternDistribute', operator, pattern)
        },
        patternPopoverShow(operator, pattern) {
            this.patternInfo = this.getPatternInfo(operator, pattern)
        },
        operatorPopoverShow(operator, pattern) {
            this.operatorInfo = this.getOperatorInfo(operator, pattern)
        },
        getOperatorInfo(operator) {
            let ir1execute = 0
            let ir2execute = 0
            for (let i = 0; i < this.patterns.length; i++) {
                var e = this.patterns[i]
                if (e.operator === operator) {
                    ir1execute = e.sumir1
                    ir2execute = e.sumir2
                    break
                }
            }
            return {
                ir1execute: ir1execute,
                ir2execute: ir2execute,
            }
        },
        getPatternInfo(operator, pattern) {
            let percentageir1All = 0
            let percentageir1Operator = 0
            let percentageir2All = 0
            let percentageir2Operator = 0
            let ir1execute = 0
            let ir2execute = 0
            for (let i = 0; i < this.patterns.length; i++) {
                var e = this.patterns[i]
                if (e.operator === operator && e.pattern === pattern) {
                    ir1execute = e.ir1execute
                    ir2execute = e.ir2execute
                    percentageir1Operator = e.ir1execute / e.sumir1 * 100
                    percentageir1All = e.ir1execute / e.sumir1all * 100
                    percentageir2Operator = e.ir2execute / e.sumir2 * 100
                    percentageir2All = e.ir2execute / e.sumir2all * 100

                    break
                }
            }
            return {
                percentageir1All: percentageir1All.toFixed(8),
                percentageir1Operator: percentageir1Operator.toFixed(8),
                percentageir2All: percentageir2All.toFixed(8),
                percentageir2Operator: percentageir2Operator.toFixed(8),
                ir1execute: ir1execute,
                ir2execute: ir2execute,
            }
        },

        resolveInstruction(instructions) {
            return JSON.parse(instructions)
        },

        handleSort(target) {
            let order = ''
            if (target.order === "ascending") {
                order = 'asc'
            } else {
                order = 'desc'
            }
            this.orderBy = target.prop
            this.orderFilter = order
            this.getInstructionMapsAll()
        },
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
        getInstructionMapsAll() {
            this.loading = true
            let data = {
                operator: this.operatorFilter,
                pattern:this.patternFilter,
                order: this.orderFilter,
                orderby: this.orderBy,
                ltid: this.id,
                currentPage: this.instructionMapsCurrentPage,
                limit: this.pageSize,
            }
            this.$axios.post(basic_url + '/ltlogInstructionMap/getSpecific',
                data
            ).then(e => {
                this.loading = false
                this.instructionMaps = e.data.records
                this.instructionMapsTotal = e.data.total
                this.sumir1 = e.data.sumir1
                this.sumir2 = e.data.sumir2
            })
        },
        getSummaries(param) {
            const {columns, data} = param;
            const sums = [];

            sums[0] = '总计';


            sums[6] = this.toThousand(this.sumir1)
            sums[7] = this.toThousand(this.sumir2)

            return sums;
        },
        handleCurrentChangeInstructionMaps(val) {
            this.instructionMapsCurrentPage = val
            this.getInstructionMapsAll()
        },
        getPatterns() {
            this.$axios.get(basic_url + '/ltlogInstructionMap/getPatterns',
                {
                    params:
                        {
                            ltid: this.id,
                        }
                }
            ).then(e => {
                this.loading = false
                this.patterns = e.data
            })
        },
    },
    mounted() {
        this.getPatterns()
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

.pattern {
    padding: 2px 5px;
    background: #fff0f6;
    border: #ffacd1 1px solid;
    color: #cc3794;
    width: fit-content;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    transition: all 300ms;
    cursor: pointer;
}

.pattern:hover {
    background: #e676a8;
    color: white;
}

.pattern-filter {
    font-size: 14px;
    line-height: 14px;

}

.pattern-filter-operator {
    display: inline-flex;
    padding: 2px 5px;
    background: orange;
    color: white;

}

.pattern-filter-pattern {
    display: inline-flex;
    padding: 2px 5px;

    background: #f466ad;
    color: white;
}

.el-table .warning-row {
    background: oldlace;
}

.table-operator {
    padding: 2px 5px;
    background: #fff0f6;
    border: #ffacd1 1px solid;
    color: #cc3794;
    width: fit-content;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    transition: all 300ms;
    cursor: pointer;

}

.table-operator:hover {

    background: #e676a8;
    color: white;
}

</style>