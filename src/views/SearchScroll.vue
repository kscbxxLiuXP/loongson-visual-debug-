<template>
    <div id="app">

        <!--        <header>-->
        <!--            <h3>搜索</h3><input type="text" v-model="rs">-->
        <!--            <button @click="toTarget('#' + rs)">确定</button>-->
        <!--        </header>-->

        <!--        <div v-for="d in ds" :key="d" :id="d">-->
        <!--            {{ d }}-->
        <!--        </div>-->
        <div>
            <div data-v-44643bad="" id="TB-0-ir2-1" style="display: flex;">
                <div data-v-44643bad="" style="color: rgb(255, 141, 2);">0xffe8<em name="selecthighlight"
                                                                                     style="background-color: #ffff00;color: black">00</em>0540
                </div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">slli.d</div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">itmp0,$s5,0</div>
            </div> <div data-v-44643bad="" id="TB-0-ir2-2" style="display: flex;">
                <div data-v-44643bad="" style="color: rgb(255, 141, 2);">0xffe8<em name="selecthighlight"
                                                                                     style="background-color: #ffff00;color: black">00</em>0540
                </div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">slli.d</div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">itmp0,$s5,0</div>
            </div> <div data-v-44643bad="" id="TB-0-ir2-3" style="display: flex;">
                <div data-v-44643bad="" style="color: rgb(255, 141, 2);">0xffe8<em name="selecthighlight"
                                                                                     style="background-color: #ffff00;color: black">00</em>0540
                </div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">slli.d</div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">itmp0,$s5,0</div>
            </div> <div data-v-44643bad="" id="TB-0-ir2-4" style="display: flex;">
                <div data-v-44643bad="" style="color: rgb(255, 141, 2);">0xffe8<em name="selecthighlight"
                                                                                     style="background-color: #ffff00;color: black">00</em>0540
                </div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">slli.d</div>
                <div data-v-44643bad="" style="width: 100px; margin-left: 20px;">itmp0,$s5,0</div>
            </div>
        </div>
    </div>
</template>
<script>
import {basic_url} from "@/request/request";

export default {
    name: 'SearchScroll',
    data() {
        return {
            rs: '',
            ds: ['home', 'team', 'contact', 'join']
        }
    },
    mounted() {

        this.loading = true
        this.$axios.get(basic_url + '/debug', {params: {id: 27}}).then(e => {
            this.loading = false
            this.tbBlocks = e.data.tbBlocks
            this.simpleTbBlocks = e.data.simpleTbBlocks
            this.head = e.data.head
            this.ltlog = e.data.lt


        })


    },
    methods: {
        toTarget(target) {
            console.log(target)
            const toElement = document.querySelector(target) // 获取文档中 id="demo" 的元素：
            toElement.scrollIntoView()
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll, true)
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

#app {
    position: relative;
    width: 100%;
    height: 100vh;
}

header {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1;
    background: #fff;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
}

header a {
    width: 200px;
    height: 60px;
    display: block;
    text-align: center;
    line-height: 60px;
    color: #333333;
    text-decoration: none;
}

header a:hover, header a.active {
    color: dodgerblue;
}

#home, #team, #contact, #join {
    width: 100%;
    height: 500px;
    color: #FFFF;
    font-size: 30px;
    text-align: center;
    line-height: 500px;
}

#home {
    background: tomato;
}

#team {
    background: deepskyblue;
}

#contact {
    background: orange;
}

#join {
    height: 1000px;
    background: lightgreen;
}

</style>