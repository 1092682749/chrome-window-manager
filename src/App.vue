<template>
  <div id="app">
    <PluginContent></PluginContent>
  </div>
</template>

<script>
import PluginContent from './components/PluginContent.vue'

export default {
  name: 'App',
  components: {
    PluginContent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
