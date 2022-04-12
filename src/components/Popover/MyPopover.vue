<template>
    <span>
        <transition
            name="fade-in-linear">
            <div v-show="showPopper" ref="popover" @mouseover="onMouseOver" @mouseout="onMouseOut" class="popper">
                {{ title }}
            </div>
        </transition>
        <span ref="trigger">
            <slot></slot>
        </span>
    </span>
</template>

<script>
// import 'vue-popperjs/dist/vue-popper.css';

export default {
    name: "MyPopover",
    props: {
        title: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: "bottom"
        }
    },
    data() {
        return {
            showPopper: false,
            position1: {
                top: 0,
                left: 0
            },
        }
    },
    methods: {

        onMouseOver() {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this.showPopper = true;
            }, 10);
        },

        onMouseOut() {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this.showPopper = false;
            }, 100);
        },

    },
    watch: {
        showPopper: function (val) {
            if (val) {
                const popover = this.$refs.popover;
                const trigger = this.$refs.trigger.children[0];
                if (this.position==='bottom'){
                    // 通过placement计算出位子
                    this.position1.top = trigger.offsetTop + trigger.offsetHeight;
                    popover.style.top = this.position1.top +5+ 'px';
                }else if(this.position==='top'){
                    this.position1.top = trigger.offsetTop - trigger.clientHeight-23;
                    popover.style.top = this.position1.top + 'px';
                }

            }
        }
    },
    mounted() {
        this.referenceElm = this.$slots.default[0].elm;
        this.referenceElm.onmouseover = this.onMouseOver
        this.referenceElm.onmouseout = this.onMouseOut
    }

}
</script>

<style scoped>
.popper {
    width: auto;
    background-color: #ffffff;
    color: #212121;
    text-align: center;
    display: inline-block;
    border-radius: 5px;
    position: absolute;
    font-size: 14px;
    border: 1px #ebeef5 solid;
    z-index: 200000;
    padding: 10px 20px;
    line-height: normal;
    -moz-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    -webkit-box-shadow: 6px 5px 2px -9px white, 5px 6px 2px -9px white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);


}
</style>