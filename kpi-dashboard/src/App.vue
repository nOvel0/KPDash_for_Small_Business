<template>
  <div id="app">
    <router-view /> 
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Базовые стили для сброса */
body {
  margin: 0;
  background-color: #f0f2f5; /* Легкий фон */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>