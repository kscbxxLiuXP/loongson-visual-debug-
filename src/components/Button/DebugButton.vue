<template>
    <i style="height:  26px;" v-bind:class="{'debug-button-forbidden-wrapper':disabled}" class="debug-button">
        <i v-bind:class="classArray"
           class="fa debug-button fa-fw" @click="clicked"/>
    </i>

</template>

<script>

export default {
    name: "DebugButton",
    props: {
        icon: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        },
        click: {
            type: Function,
            default: null
        },
        color: {
            type: String,
            default: "blue"
        },
        selected: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            // : []
        }
    },
    methods: {
        clicked() {
            if (!this.disabled) {
                this.click()
            }
        }
    },
    computed: {
        classArray: function () {
            var array = [
                this.icon
            ]
            if (this.disabled) {
                array.push('debug-button-forbidden')
            } else {
                array.push('interact')
                array.push('debug-color-' + this.color)
            }
            if (this.selected) {
                array.push('debug-button-selected')
            }
            return array

        }
    }
}
</script>

<style scoped>
.debug-button-forbidden {
    color: #cbcbcb;

    pointer-events: none;
}

.debug-button-forbidden-wrapper {
    cursor: not-allowed;
}
.debug-button-selected{
    background-color: #dfdfdf;
}

.debug-color-blue {
    color: #20a7ff;
}

.debug-color-green {
    color: #59a869;
}

.debug-color-red {
    color: #db5860;
}

.debug-color-gray {
    color: #89898c;
}

.debug-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-left: 2px;
    transition: all 300ms;
    width: 25px;
    height: 26px;
}

.interact:hover {
    background-color: #dfdfdf;
}

.interact:active {
    background-color: #c2bfbf;

}

</style>