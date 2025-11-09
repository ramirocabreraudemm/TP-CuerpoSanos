<template>
  <div id="app">
    <Header />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>
