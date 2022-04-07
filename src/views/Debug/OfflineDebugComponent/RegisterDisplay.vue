<template>
    <div class="register-wrapper">
        <ul class="register-row">
            <li><span class="register-name">EAX</span>:<span class="register-value">0x{{ registers.EAX }}</span></li>
            <li><span class="register-name">EBP</span>:<span class="register-value">0x{{ registers.EBP }}</span></li>
            <li><span class="register-name">EBX</span>:<span class="register-value">0x{{ registers.EBX }}</span></li>
            <li><span class="register-name">ECX</span>:<span class="register-value">0x{{ registers.ECX }}</span></li>
            <li><span class="register-name">EFL</span>:<span class="register-value">0x{{ registers.EFL }}</span></li>
        </ul>
        <ul class="register-row">
            <li><span class="register-name">EDI</span>:<span class="register-value">0x{{ registers.EDI }}</span></li>
            <li><span class="register-name">EDX</span>:<span class="register-value">0x{{ registers.EDX }}</span></li>

            <li><span class="register-name">EIP</span>:<span class="register-value">0x{{ registers.EIP }}</span></li>
            <li><span class="register-name">ESI</span>:<span class="register-value">0x{{ registers.ESI }}</span></li>
            <li><span class="register-name">ESP</span>:<span class="register-value">0x{{ registers.ESP }}</span></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "RegisterDisplay",
    props: ['registers']
}
</script>

<style scoped>
ul, li {
    padding: 0;
    margin: 0;
    list-style: none
}

.register-row {
    display: flex;
    margin-top: 5px;


    justify-content: center;
}

.register-row li {
    margin-left: 10px;
}

.register-name {
    font-size: 12px;
    display: inline-block;
    padding: 0 5px;
    background-color: #6ebbef;
    width: 30px;
    color: white;
    text-align: center;
    border-radius: 3px;
    line-height: 18px;
}

.register-value {
    font-size: 14px;
    display: inline-block;
    padding: 2px 5px;
    background-color: #efad5c;
    width: 80px;
    color: white;
    text-align: center;
    border-radius: 3px;
}

.register-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

}

.register-wrapper span {

}

</style>