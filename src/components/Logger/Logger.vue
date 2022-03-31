<template>
    <div style="min-height: 100px; max-height: 100px;overflow-y: auto;padding-left: 10px" id="console">


    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "Logger",
    data() {
        return {
            num: 1
        }
    },
    methods: {
        log(content) {
            var div = document.getElementById('console');
            var contentel = `<span style="margin-left: 15px">${content}</span>`
            var logg = `<div style="margin-top: 5px">[<div style="min-width: 25px;text-align: right;display: inline-block">${this.num}</div>]${moment().format("yyyy-MM-DD HH:mm:ss")}<span style="color: #067d17;margin-left: 15px">INFO</span>${contentel} </div>`
            div.innerHTML = div.innerHTML + logg;
            div.scrollTop = div.scrollHeight;
            this.num++
        }
    }
}
</script>

<style scoped>

</style>