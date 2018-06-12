<template>
    <div class="blured" :class="classes" :style="style">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'blured',
        props: {
            pos: {
                type: String,
                required: false,
            } ,
            el: {
                type: String,
                required: false,
                default: 'before'
            },
            img: {
                type: String,
                required: false,
            },
            px: {
                type: Number,
                required: false,
                default: 5
            }
        },
        data() {
            
            var d = {
                classes: [],
                style: {

                }           
            };

            ( this.pos ) && ( d.classes.push( `pos-${this.pos}` ) );

            ( this.el ) && ( d.classes.push( `el-${this.el}` ) );

            ( this.img ) && ( d.style['--img'] = `url('${this.img}')` );

            ( this.px && +this.px ) && ( d.style['--px'] = `blur(${this.px}px)` );            

            return d
        }
    }
</script>

<style scoped>

.blured.pos-fixed {
    position: fixed;
}

.blured.pos-absolute {
    position: absolute;
}

.blured.pos-relative {
    position: relative;
}

.blured.el-before:before {

    content: "";
    display: block;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom:0;
    z-index: -1;

    background-image: var(--img);
    background-size: cover;

    -webkit-filter: var(--px);
    -moz-filter: var(--px);
    -o-filter: var(--px);
    -ms-filter: var(--px);
    filter: var(--px);

    transform: scale(1.05);
}

.blured.el-after:after {

    content: "";
    display: block;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom:0;
    z-index: -1;

    background-image: var(--img);
    background-size: cover;

    -webkit-filter: var(--px);
    -moz-filter: var(--px);
    -o-filter: var(--px);
    -ms-filter: var(--px);
    filter: var(--px);

    transform: scale(1.05);
}

</style>
