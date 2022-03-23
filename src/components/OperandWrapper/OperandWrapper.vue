<template>
    <div style="width: 200px;display: flex;" v-if="cons.length!==0">
        <div :key="'operand'+index" v-for="(item,index) in cons">
            <span style="margin-right: 10px" v-if="index!==0">,</span>
            <span style="color: #232323" v-if="item.type===1">{{ item.content }}</span>
            <span style="color: lightcoral" v-if="item.type===2">{{ item.content }}</span>
            <span class="operand-address" @click="callback(item.content)" style="color: #ff8d02"
                  v-if="item.type===3">{{ item.content }}</span>
            <span style="color: lightseagreen;word-wrap:break-word ;" v-if="item.type===4">{{ item.content }}</span>

        </div>
    </div>
</template>

<script>
export default {
    name: "OperandWrapper",
    props: ['contents', 'callback'],
    data() {
        return {
            cons: []
        }
    },
    watch: {
        contents: function (newVal, oldVal) {
            var sp = newVal.split(",")
            var cons = []
            sp.forEach(e => {

                var cc = {
                    type: -1,
                    content: e
                }
                var f=e.trim()
                if (f[0] === '$') {
                    cc.type = 1
                } else if (f[0] === 'i') {
                    cc.type = 2
                } else if (f.length > 2 && f[0] === '0' && f[1] === 'x') {
                    cc.type = 3
                } else {
                    cc.type = 4
                }
                cons.push(cc)
            })
            this.cons = cons
        }
    },
    mounted() {
        var sp = this.contents.split(",")
        var cons = []
        sp.forEach(e => {
            var cc = {
                type: -1,
                content: e
            }
            var f=e.trim()
            if (f[0] === '$') {
                cc.type = 1
            } else if (f[0] === 'i') {
                cc.type = 2
            } else if (f.length > 2 && f[0] === '0' && f[1] === 'x') {
                cc.type = 3
            } else {
                cc.type = 4
            }
            cons.push(cc)
        })
        this.cons = cons

    }
}
</script>

<style scoped>
.operand-address {

}

.operand-address:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>