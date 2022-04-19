<template>
    <div id="tb-analysis">
        <h3>TB块分析</h3>
        <el-table
            border
            size="small"
            :data="tbAnalyses"
            style="width: 100%;margin-top: 10px;font-size: 14px">
            <el-table-column
                label="序号"
                width="50">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="uid" prop="uid"></el-table-column>
            <el-table-column label="ltid" prop="ltid"></el-table-column>
            <el-table-column label="pc" prop="pc"></el-table-column>
            <el-table-column label="endPc" prop="endPc"></el-table-column>
            <el-table-column label="execTimes" prop="execTimes"></el-table-column>
            <el-table-column label="exitTimes" prop="exitTimes"></el-table-column>
            <el-table-column label="runIr1Num" prop="runIr1Num"></el-table-column>
            <el-table-column label="runIr2Num" prop="runIr2Num"></el-table-column>
            <el-table-column label="runExpRate" prop="runExpRate"></el-table-column>
            <el-table-column label="ir1Num" prop="ir1Num"></el-table-column>
            <el-table-column label="ir2Num" prop="ir2Num"></el-table-column>
            <el-table-column label="expRate" prop="expRate"></el-table-column>

        </el-table>
        <el-pagination
            @current-change="handleCurrentChangeTbAnalysis"
            :current-page.sync="tbAnalysesCurrentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="tbAnalysesTotal">
        </el-pagination>
    </div>
</template>

<script>
import {basic_url} from "@/request/request";

export default {
    name: "TBAnalysis",
    props:['id'],
    data() {
        return {
            tbAnalyses: [],
            tbAnalysesCurrentPage: 1,
            tbAnalysesTotal: 0,
            pageSize: 10,
        }
    },
    methods: {
        getTBAnalyses() {
            this.$axios.get(basic_url + '/tbAnalysis/getAll',
                {
                    params:
                        {
                            ltid: this.id,
                            currentPage: this.tbAnalysesCurrentPage,
                            limit: this.pageSize
                        }
                }
            ).then(e => {
                this.tbAnalyses = e.data.records
                this.tbAnalysesTotal = e.data.total
            })
        },

        handleCurrentChangeTbAnalysis(val) {
            // console.log('change')
            this.tbAnalysesCurrentPage = val
            this.getTBAnalyses()
        },

    },
    mounted() {
        this.getTBAnalyses()

    }
}
</script>

<style scoped>

</style>