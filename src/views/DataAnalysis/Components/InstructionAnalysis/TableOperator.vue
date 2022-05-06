<template>
    <el-table
        key="2222"
        v-loading="loading"
        :data="instructionMapsCombo"
        border
        size="small"
        style="margin-top: 10px;font-size: 14px">
        <el-table-column
            label="序号"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
        </el-table-column>
        <el-table-column label="operator" prop="operator">

        </el-table-column>
        <el-table-column label="ir1nums">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ toThousand(scope.row.sumir1) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="ir2nums">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ toThousand(scope.row.sumir2) }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: "TableOperator",
    props: ['loading', 'instructionMapsCombo'],
    methods: {
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
    },

}
</script>

<style scoped>

</style>