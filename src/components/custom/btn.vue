<template>
    <v-touch tag="button" class="btn" v-on="listenner">
        <slot></slot>
    </v-touch>
</template>

<script>
    export default {
        name: 'btn',
        data() {

            const self = this

            return {

                listenner: {

                    tap() { self.$emit('tap') }
                }
            }
        }
    }
</script>

<style scoped>

    .btn.faded:before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        opacity: 0.2;
    }

    .btn.red {
        color: #f44336;
        background-color: transparent;
        border-color: #ccc
    }

    .btn.red.outline {
        color: #f44336;
        background-color: transparent;
        border: 1px solid #f44336
    }

    .btn.red.full {
        color: #fff;
        background-color: #f44336;
        border: 1px solid #f44336
    }

    .btn.theme {
        color: #1de4ae;
        background-color: transparent;
        border-color: #181e35
    }

    .btn.theme.outline {
        color: #1de4ae;
        background-color: transparent;
        border: 1px solid #1de4ae
    }

    .btn.theme.full {
        color: #181e35;
        background-color: #1de4ae;
        border: 1px solid #1de4ae
    }

</style>
