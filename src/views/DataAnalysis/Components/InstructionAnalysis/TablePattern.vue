<template>
    <div>
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

        </div>
        <div style="margin-top: 5px">
            已隐藏Pattern：
            <el-tag v-if="hidden.length===0">
                无
            </el-tag>
            <el-tag
                style="margin-left: 5px"

                :key="tag.flag"
                v-for="tag in hidden"
                closable
                :disable-transitions="false"
                @close="cancelHidden(tag.operator,tag.pattern)">
                {{ tag.operator }} {{ tag.pattern }}
            </el-tag>
        </div>
        <div style="margin-top: 5px">
            已隐藏Operator：
            <el-tag v-if="hiddenOperator.length===0">
                无
            </el-tag>
            <el-tag
                style="margin-left: 5px"
                :key="tag"
                v-for="tag in hiddenOperator"
                closable
                :disable-transitions="false"
                @close="cancelHiddenOperator(tag)">
                {{ tag }}
            </el-tag>
        </div>
        <el-table
            v-loading="loading"
            size="small"
            :summary-method="getSummaries"
            border
            show-summary
            :data="instructionMaps"
            @sort-change="handleSort"
            :row-class-name="tableRowClassName"
            style="width: 100%;margin-top: 10px;font-size: 14px">
            <el-table-column
                fixed
                label="序号"
                width="80">
                <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            {{ (instructionMapsCurrentPage - 1) * pageSize + scope.$index + 1 }}
                        </span>
                </template>
            </el-table-column>
            <el-table-column label="ir1指令(eg.)" header-align="center">
                <el-table-column label="operator" prop="operator" width="100">
                    <template slot-scope="scope">
                        <el-popover @show="operatorPopoverShow(scope.row)" placement="top"
                                    trigger="hover">
                            <div class="pattern-filter">
                                <span class="pattern-filter-pattern">{{ scope.row.operator }}</span>
                            </div>
                            <div style="margin-top: 5px">
                                ir1总计：{{ toThousand(scope.row.sumir1) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator" style="font-size: 12px">本类指令占</span> :
                                    {{ (scope.row.ir1execute / scope.row.sumir1 *100).toFixed(6)}}%
                                </div>

                            </div>
                            <div style="margin-top: 5px">
                                ir2总计：{{ toThousand(scope.row.sumir2) }}
                            </div>
                            <div style="margin-top: 5px">
                                <div><span class="pattern-filter-operator" style="font-size: 12px">本条指令占</span> :
                                    {{ (scope.row.ir2execute / scope.row.sumir2 *100).toFixed(6) }}%
                                </div>
                            </div>
                            <el-button type="text" size="mini" v-if="operatorFilter===''"
                                       @click="hideOperator(scope.row.operator)">隐藏{{scope.row.operator}}
                            </el-button>

                            <div class="table-operator" slot="reference"
                                 @click="()=>{operatorFilter=scope.row.operator;changeOperator()}">{{
                                    scope.row.operator
                                }}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="operand" prop="operand" min-width="200"></el-table-column>
                <el-table-column label="pattern" prop="pattern" min-width="200">
                    <template slot-scope="scope">
                        <el-popover @show="patternPopoverShow(scope.row)" placement="top"
                                    trigger="hover">
                            <div class="pattern-filter">
                                <span class="pattern-filter-operator">{{ scope.row.operator }}</span>
                                <span class="pattern-filter-pattern">{{ scope.row.pattern }}</span>
                            </div>
                            <div style="margin-top: 5px">
                                ir1总计：{{ toThousand(scope.row.ir1execute) }}
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
                            <el-button type="text" size="mini"
                                       @click="hidePattern(scope.row.operator,scope.row.pattern)">隐藏这一类指令
                            </el-button>

                            <div class="pattern" slot="reference"
                                 @click="patternClick(scope.row.operator,scope.row.pattern)">
                                {{ scope.row.pattern }}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="ir2指令(eg.)" width="400">
                <template slot-scope="scope">
                    <div class="ir2instruction" :key="index"
                         v-for="(item,index) in resolveInstruction(scope.row.ir2instruction)">
                        <span class="ir2-operator">{{ item.split(' ')[0] }}</span>
                        <span class="ir2-operand">{{ item.split(' ')[1] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="ir1:ir2" sortable="custom" prop="ir2num">
                <template slot-scope="scope">
                    <span>1:{{ scope.row.ir2num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="ir1执行次数" fixed="right" min-width="100" sortable="custom" prop="ir1execute">
                <template slot-scope="scope">
                    <div>{{ toThousand(scope.row.ir1execute) }}</div>
                    <div> {{ scope.row.operator }}中:
                        {{
                            (scope.row.num / sumir1 * 100) < 0.001 ? '<0.001' : (scope.row.ir1execute / scope.row.sumir1 * 100).toFixed(3)
                        }}%
                    </div>
                    <div>总：
                        {{
                            (scope.row.num / sumir1 * 100) < 0.001 ? '<0.001' : (scope.row.ir1execute / sumir1 * 100).toFixed(3)
                        }}%
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="ir2执行次数" fixed="right" min-width="100" sortable="custom" prop="ir2execute">
                <template slot-scope="scope">
                    <div>{{ toThousand(scope.row.ir2execute) }}</div>
                    <div>
                        {{ scope.row.operator }}中:
                        {{
                            (scope.row.num / sumir1 * 100) < 0.001 ? '<0.001' : (scope.row.ir2execute / scope.row.sumir2 * 100).toFixed(3)
                        }}%
                    </div>
                    <div>
                        总:
                        {{
                            (scope.row.ir2execute / sumir2 * 100) < 0.001 ? '<0.001' : (scope.row.ir2execute / sumir2 * 100).toFixed(3)
                        }}%
                    </div>

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
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "TablePattern",
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
        },
        patternPopoverShow(row) {
            this.patternInfo = this.getPatternInfo(row)
        },
        operatorPopoverShow(row) {
            this.operatorInfo = this.getOperatorInfo(row)
        },
        getOperatorInfo(row) {

                   let ir1execute = row.sumir1
                   let ir2execute = row.sumir2

            return {
                ir1execute: ir1execute,
                ir2execute: ir2execute,
            }
        },
        getPatternInfo(row) {
            let ir1execute = row.ir1execute
            let ir2execute = row.ir2execute
            let percentageir1Operator = row.ir1execute / row.sumir1 * 100
            let percentageir1All = row.ir1execute / row.sumir1all * 100
            let percentageir2Operator = row.ir2execute / row.sumir2 * 100
            let percentageir2All = row.ir2execute / row.sumir2all * 100

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
        cancelHiddenOperator(operator){
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
                hiddenOperator:this.hiddenOperator


            }
            console.log(data)
            this.$axios.post(basic_url + '/ltlogInstructionMap/getAllPatterned',
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
            // console.log('change')
            this.instructionMapsCurrentPage = val
            this.getInstructionMapsAll()
        },
    },
    mounted() {
        this.getInstructionMapsAll()

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


</style>