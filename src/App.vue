<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

  /* 181e35 */

  @import url(https://api.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css);

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #fbfbfc;
    padding-top: 34px;
    background: #212a49;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #app * {
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
  }

  #top-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #101423;
    padding-top: 30px;
  }

  #bottom-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #101423;
    box-shadow: 0px -3px 10px 0px #101423;
  }

  #bottom-panel > ul{
    padding: 0;
    margin: 0;
  }

  #bottom-panel > ul > li{
    display: inline-block;
    margin: 0 10px;
  }

  #bottom-panel > ul > li > a{
    display: block;
    padding: 10px;
    color: #ffffff;
    border-top: 1px solid transparent;
  }

  #bottom-panel > ul > li > a.active{
    border-top-color: #1de4ae;
    color: #1de4ae;
  }
</style>
