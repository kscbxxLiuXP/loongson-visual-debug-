<template>
    <div>
        <div style="margin-top: 10px">
            <span>Operator:</span>
            <el-select v-model="operatorFilter" clearable filterable placeholder="请选择" size="small"
                       @change="changeOperator">
                <el-option
                    v-for="item in instructionTypes"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>

        </div>
        <div style="margin-top: 5px">
            已合并：
            <el-tag v-if="comboed.length===0">
                无
            </el-tag>
            <el-tag
                v-for="tag in comboed"
                :key="tag.flag"
                :disable-transitions="false"
                closable
                style="margin-left: 5px"
                @close="cancelCombo(tag.operator,tag.pattern)">
                {{ tag.operator }} {{ tag.pattern }}
            </el-tag>
        </div>
        <div style="margin-top: 5px">
            已隐藏Operator：
            <el-tag v-if="hiddenOperator.length===0">
                无
            </el-tag>
            <el-tag
                v-for="tag in hiddenOperator"
                :key="tag"
                :disable-transitions="false"
                closable
                style="margin-left: 5px"
                @close="cancelHiddenOperator(tag)">
                {{ tag }}
            </el-tag>
        </div>
        <div style="margin-top: 5px">
            已隐藏Pattern：
            <el-tag v-if="hidden.length===0">
                无
            </el-tag>
            <el-tag
                v-for="tag in hidden"

                :key="tag.flag"
                :disable-transitions="false"
                closable
                style="margin-left: 5px"
                @close="cancelHidden(tag.operator,tag.pattern)">
                {{ tag.operator }} {{ tag.pattern }}
            </el-tag>
        </div>
        <el-table
            v-loading="loading"
            :data="instructionMaps"
            :row-class-name="tableRowClassName"
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
                            <el-button v-if="operatorFilter===''" size="mini" type="text"
                                       @click="hideOperator(scope.row.operator)">隐藏{{ scope.row.operator }}
                            </el-button>

                            <div slot="reference" class="table-operator"
                                 @click="()=>{operatorFilter=scope.row.operator;$emit('operatorClick',scope.row.operator);changeOperator()}">
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
                            <el-button v-if="comboBtnVisible(scope.row.operator,scope.row.pattern)"
                                       size="mini"
                                       type="text"
                                       @click="comboPattern(scope.row.operator,scope.row.pattern)">合并此类型
                            </el-button>
                            <el-button v-if="!comboBtnVisible(scope.row.operator,scope.row.pattern)" size="mini"
                                       type="text"
                                       @click="cancelCombo(scope.row.operator,scope.row.pattern)">取消合并
                            </el-button>
                            <el-button size="mini" type="text"
                                       @click="hidePattern(scope.row.operator,scope.row.pattern)">隐藏这一类指令
                            </el-button>

                            <div slot="reference" class="pattern"
                                 @click="patternClick(scope.row.operator,scope.row.pattern)">
                                {{ scope.row.pattern }}
                            </div>
                        </el-popover>
                        <span
                            v-if="!scope.row.uid"
                            style="padding: 2px 5px; background: #fff0f6; border: #ffacd1 1px solid; color: #cc3794;border-radius: 3px; font-size: 12px;">
                            已合并
                        </span>
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
            :current-page.sync="instructionMapsCurrentPage"
            :page-size="pageSize"
            :total="instructionMapsTotal"
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChangeInstructionMaps">
        </el-pagination>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "TableAll",
    props: ['id', 'instructionTypes'],
    data() {
        return {
            operatorFilter: '',
            orderFilter: 'desc',
            orderBy: 'ir2execute',
            sumir1: 0,
            sumir2: 0,
            instructionMaps: [],
            instructionMapsCurrentPage: 1,
            instructionMapsTotal: 0,
            pageSize: 10,
            loading: false,
            comboed: [],
            hidden: [],
            hiddenOperator: [],
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
            }
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {

            if (row.uid === "") {
                return 'warning-row';
            }
            return '';
        },
        //跳转到绘图
        patternClick(operator, pattern) {
            //绘图operator下所有pattern的分布情况
            this.$emit('drawPatternDistribute', operator, pattern)
            this.$emit('patternClick', operator, pattern)

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
        comboBtnVisible(operator, pattern) {
            let flag = operator + "|" + pattern
            let visible = true
            this.comboed.forEach(e => {
                if (e.flag === flag) {
                    visible = false
                }
            })
            return visible;
        },
        resolveInstruction(instructions) {
            return JSON.parse(instructions)
        },
        cancelCombo(operator, pattern) {
            let flag = operator + "|" + pattern
            var index
            for (let i = 0; i < this.comboed.length; i++) {
                if (this.comboed[i].flag === flag) {
                    index = i
                    break;
                }
            }

            this.comboed.splice(index, 1);
            this.getInstructionMapsAll()
        },
        cancelHiddenOperator(operator) {
            let flag = operator
            var index
            for (let i = 0; i < this.hiddenOperator.length; i++) {
                if (this.hiddenOperator[i] === flag) {
                    index = i
                    break;
                }
            }

            this.hiddenOperator.splice(index, 1);
            this.getInstructionMapsAll()
        },
        cancelHidden(operator, pattern) {
            let flag = operator + "|" + pattern
            var index
            for (let i = 0; i < this.hidden.length; i++) {
                if (this.hidden[i].flag === flag) {
                    index = i
                    break;
                }
            }

            this.hidden.splice(index, 1);
            this.getInstructionMapsAll()
        },
        //组合一种pattern的数据
        comboPattern(operator, pattern) {
            this.comboed.push(
                {
                    flag: operator + "|" + pattern,
                    operator: operator,
                    pattern: pattern
                }
            )
            this.getInstructionMapsAll()
        },
        //隐藏一种pattern
        hidePattern(operator, pattern) {
            this.hidden.push(
                {
                    flag: operator + "|" + pattern,
                    operator: operator,
                    pattern: pattern
                }
            )
            this.getInstructionMapsAll()

        },
        hideOperator(operator) {
            this.hiddenOperator.push(operator)
            this.getInstructionMapsAll()

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
        changeOperator(val) {
            this.hidden = []
            this.comboed = []
            this.instructionMapsCurrentPage = 1
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
                order: this.orderFilter,
                orderby: this.orderBy,
                ltid: this.id,
                currentPage: this.instructionMapsCurrentPage,
                limit: this.pageSize,
                comboed: this.comboed,
                hidden: this.hidden,
                hiddenOperator: this.hiddenOperator

            }
            this.$axios.post(basic_url + '/ltlogInstructionMap/getAll',
                data
            ).then(e => {
                this.loading = false
                this.instructionMaps = e.data.records
                this.instructionMapsTotal = e.data.total
                this.sumir1 = e.data.sumir1
                this.sumir2 = e.data.sumir2
            })
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
        getSummaries(param) {
            const {columns, data} = param;
            const sums = [];

            sums[0] = '总计';


            sums[6] = this.toThousand(this.sumir1)
            sums[7] = this.toThousand(this.sumir2)

            return sums;
        },
        handleCurrentChangeInstructionMaps(val) {
            // console.log('change')
            this.instructionMapsCurrentPage = val
            this.getInstructionMapsAll()
        },
    },
    mounted() {
        this.getInstructionMapsAll()
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