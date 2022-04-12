<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
.g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
.g6-minimap {
    position: absolute;
    right: 10px;
    top: 6px;
    padding: 2px;
    border: #B3C0D1 1px solid;
    background-color: #fff;
}


.html{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}
::-webkit-scrollbar {
    width: 6px
}

::-webkit-scrollbar-corner {
    background: unset
}

::-webkit-scrollbar-thumb {
    background: hsla(0, 0%, 53%, .4);
    border-radius: 6px
}

::-webkit-scrollbar-track {
    background: hsla(0, 0%, 53%, .1);
    background-color: #fff
}

::-webkit-scrollbar {
    width: 5px;
    height: 5px
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, .2);
    -webkit-border-radius: 6px
}

::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: hsla(0, 0%, 49%, .7);
    -webkit-border-radius: 6px
}

::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: hsla(0, 0%, 49%, .7);
    -webkit-border-radius: 6px
}

</style>
