<template>
    <div class="faded-bg" :class="classes" :style="style.wrapper">
        <div class="faded-bg-fade" :style="style.fade"></div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'faded-bg',
        props: {
            pos: {
                type: String,
                required: false,
            } ,
            bg: {
                type: String,
                required: false,
            },
            fade_bg: {
                type: String,
                required: false,
                default: 'rgb(255, 255, 255)'
            },
            opacity: {
                type: Number,
                required: false,
                default: 0.5
            }
        },
        data() {
            
            var d = {
                classes: [],
                style: {
                    wrapper: {},
                    fade: {},
                }           
            };

            ( this.pos ) && ( d.classes.push( `pos-${this.pos}` ) );

            ( this.bg ) && ( d.style.wrapper['background-image'] = `url('${this.bg}')` );

            ( this.fade_bg ) && ( d.style.fade.background = `${this.fade_bg}` );

            ( this.opacity ) && ( d.style.fade.opacity = this.opacity )

            return d
        }
    }
</script>

<style scoped>

.faded-bg.pos-fixed {
    position: fixed;
}

.faded-bg.pos-absolute {
    position: absolute;
}

.faded-bg.pos-relative {
    position: relative;
}

.faded-bg{

    background-size: cover;
}

.faded-bg > .faded-bg-fade {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom:0;
    z-index: -1;
}

</style>
