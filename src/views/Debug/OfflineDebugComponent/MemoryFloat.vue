<template>
    <div class="mTBWrapper">
        <div class="mTBHeader" @click="collapse">
            内存空间
        </div>
        <div v-show="collapsed" @mouseenter="mouseenter(-2)"
             @mouseleave="mouseleave()" style="position: relative">
            <div style="text-align: center; height: 100%;cursor: pointer;font-size: 14px" class="mTB"
                 @click="$emit('clickHeadM')">
                head
            </div>
            <div v-show="mTipSeen&&mTipSeenId===-2" class="mTBPop">
                head
            </div>
        </div>
        <div v-show="collapsed" @mouseenter="mouseenter(index)"
             @mouseleave="mouseleave()" :key="index" v-for="(item ,index) in simpleTbBlocks"
             style="position: relative">
            <div :style="{height:tbMemHeight}" class="mTB"
                 @click="$emit('jumpTB',item.tbindex)">
            </div>
            <div v-if="mTipSeen&&mTipSeenId===index" class="mTBPop">
                <div>
                    <span style="font-size: 18px">
                        TB{{ item.tbindex }}
                    </span>
                    <span>
                        {{ item.tbaddress }}
                    </span>
                </div>
                <div>
                    IR1起始地址:<span>{{ item.startaddressir1 }}</span>
                </div>
                <div>
                    IR1结束地址:<span>{{ item.endaddressir1 }}</span>
                </div>
                <div>
                    IR2起始地址:<span>{{ item.startaddressir2 }}</span>
                </div>
                <div>
                    IR2结束地址:<span>{{ item.endaddressir2 }}</span>
                </div>
                <div>
                    IR1 num = <span style="color: #8645cb">{{ item.ir1num }}</span>
                </div>
                <div>
                    IR2 num = <span style="color: #8645cb">{{ item.ir2num }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MemoryFloat",
    props: ['simpleTbBlocks', 'tbMemHeight'],
    data() {
        return {
            mTipSeen: false,
            mTipSeenId: -1,
            collapsed: false
        }
    },
    methods: {
        mouseenter(mTipSeenId) {
            this.mTipSeen = true
            this.mTipSeenId = mTipSeenId
        },
        mouseleave() {
            this.mTipSeen = false
            this.mTipSeenId = -1
        },
        collapse() {
            this.collapsed = !this.collapsed
        }
    },
}
</script>

<style scoped>
.mTBWrapper {
    width: 100px;
    border: #96979a 1px solid;
    position: fixed;
    top: 20%;
    right: 35px;
    height: fit-content;
    transition: all 300ms linear;
    z-index: 10;

}


.mTBHeader {
    background-color: white;
    border-bottom: #96979a 1px solid;
    text-align: center;
    transition: all 300ms linear;
    cursor: pointer;

}
.mTBHeader:hover{
    background-color: #6fbff5;
    color: white;
}

.mTB {

    background-color: #f7f8f9;
    color: black;
    transition: all 300ms;
    text-align: center;
}

.mTB:hover {
    background-color: lightcoral;
    color: white;
}

.mTBPop {
    font-size: 14px;
    padding: 10px;
    right: 110px;
    bottom: 0;
    width: 200px;

    background-color: #ffffff;
    position: absolute;
    transition: all 300ms;
    z-index: 999;
    border: #B3C0D1 1px solid;
}

</style>