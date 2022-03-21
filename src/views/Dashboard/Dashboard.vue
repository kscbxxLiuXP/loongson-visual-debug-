<template>
    <div class="main-wrapper">
        <div class="entry" @click="jump('/history')">
            <div class="entry-icon">
                <i class="fa fa-history"></i>
            </div>
            <div class="entry-text">历史调试信息</div>
        </div>
        <div class="entry" @click="jump('/debug/online')">
            <div class="entry-icon">
                <i class="fa fa-code"></i>
            </div>
            <div class="entry-text">在线调试</div>
        </div>
        <div class="entry" @click="jump('/debug/offline')">
            <div class="entry-icon">
                <i class="fa fa-bug"></i>
            </div>
            <div class="entry-text">
                离线调试
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Dashboard",
    methods:{
        jump(target){
            this.$router.push(target)
        }
    }
}
</script>

<style scoped>
.main-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.entry {
    margin-left: 30px;
    width: 300px;
    height: 400px;
    /*border: #ff8d02 1px solid;*/
    border-radius: 10px;
    background-color: #f7f8f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 300ms;
}
.entry-icon{
    text-align: center;
    font-size: 80px;
}
.entry-text{
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
}
.entry:hover{
    background-color: #ff8d02;
    color: white;
    cursor: pointer;
}

</style>