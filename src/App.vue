<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { useAuthStore } from '@/stores/auth'

// Charger l'utilisateur dès que l'app démarre
const auth = useAuthStore()
auth.loadFromLocalStorage()
</script>

<template>
  <div id="layout">
    <HeaderComponent />
    <RouterView />
    <FooterComponent />
  </div>
</template>

<style>
#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
h2 {
  font-size: 20px;
}
</style>