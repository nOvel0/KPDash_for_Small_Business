<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue' // Если вы не используете HelloWorld.vue, удалите эту строку.
// Если DataUploadView.vue еще не создан, можно закомментировать его RouterLink ниже в <template>
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-link">Дашборд</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style>
/* Можно добавить некоторые базовые глобальные стили, если хотите */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: #555;
}

.nav-link.router-link-active {
  background-color: #42b983; /* Активная ссылка */
}
</style>