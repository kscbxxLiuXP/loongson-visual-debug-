<template>
    <div>
        <el-row>
            <el-col :span="12">
                <h3>Translation buffer state:</h3>
                <div class="tb-description">
                    <span class="description-title">gen code size</span>
                    <span class="description-data">{{ toThousand(ltlog.genCodeSize1) }} </span>/
                    <span class="description-data"> {{ toThousand(ltlog.genCodeSize2) }}</span>
                </div>
                <div class="tb-description">
                    <span class="description-title">TB count</span>
                    <span class="description-data">{{ toThousand(ltlog.tbCount ) }}</span>
                </div>
                <div class="tb-description">
                    <span class="description-title">TB avg target size</span>
                    <span class="description-data">{{ ltlog.tbAvgTargetSize }}</span>
                    max = <span class="description-data">{{ toThousand(ltlog.tbAvgTargetSizeMax)  }}</span> bytes
                </div>
                <div class="tb-description">
                    <span class="description-title">TB avg host size</span>
                    <span class="description-data">{{ toThousand(ltlog.tbAvgHostSize ) }} </span>
                    bytes (expansion ratio:
                    <span class="description-data"> {{ ltlog.tbAvgHostSizeExpansionRatio }}</span> )
                </div>
                <div class="tb-description">
                    <span class="description-title">cross page TB count</span>
                    <span class="description-data">{{ ltlog.crossPageTbCount }}</span>
                    (<span class="description-data"> {{ ltlog.crossPageTbCountPercent }}</span> %)
                </div>
                <div class="tb-description">
                    <span class="description-title">direct jump count </span>
                    <span class="description-data">{{ toThousand(ltlog.directJumpCount)  }}</span>
                    (<span class="description-data"> {{ ltlog.directJumpCountPercent }} </span>%)
                    (2 jumps=<span class="description-data">{{ toThousand(ltlog.directJumpCount2Jumps)  }}</span>
                    <span class="description-data"> {{ ltlog.directJumpCount2JumpsPercent }}</span>%)
                </div>
            </el-col>
            <el-col :span="12">
                <h3>-- Summary:</h3>
                <div class="tb-description">
                    <span class="description-title">tb run times </span>
                    <span
                        class="description-data">{{toThousand(ltlog.tbRunTimes)  }} </span>
                </div>
                <div class="tb-description">
                    <span class="description-title">tb exit times</span>
                    <span
                        class="description-data">{{ toThousand(ltlog.tbExitTimes ) }}</span>
                </div>
                <div class="tb-description">
                    <span class="description-title">TB hash buckets</span>
                    <span class="description-data">{{ ltlog.tbHashBuckets1 }} </span>
                    /<span class="description-data"> {{ ltlog.tbHashBuckets2 }}</span>
                    ( <span class="description-data">{{ ltlog.tbHashBucketsPercent }}</span> % head buckets used)
                </div>
                <div class="tb-description">
                    <span class="description-title">TB hash occupancy</span>
                    <span class="description-data">{{ ltlog.tbHashOccupancy }} </span> % avg chain occ.
                </div>
                <div class="tb-description">
                    <span class="description-title">TB hash avg chain</span>
                    <span class="description-data">{{ ltlog.tbHashAvgChain }}</span> buckets. Histogram: 1|█▁|2
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "DataAnalysisBasicInfo",
    props: ['ltlog'],
    methods:{
        toThousand(num = 0) {
            return num.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            })
        },
    },

}
</script>

<style scoped>
.tb-description {
    font-size: 14px;
    margin-top: 5px;
}
.description-title{
    display: inline-block;
    width: 180px;
}
.description-data {
    color: #0076b5;
}
</style>