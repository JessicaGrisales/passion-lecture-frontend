<script setup>
import { onMounted } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// 1. Fonction pour détecter la connexion MSAL d'Azure
const checkAzureUser = async () => {
  try {
    // On appelle la route magique d'Azure
    const response = await fetch('/.auth/me')
    const payload = await response.json()
    const { clientPrincipal } = payload

    // Si Azure confirme qu'on est connecté via Microsoft
    if (clientPrincipal) {
      console.log("Connecté via Azure MSAL:", clientPrincipal.userDetails)
      
      // On met à jour le store Pinia avec les infos d'Azure
      auth.login({ 
        username: clientPrincipal.userDetails, // C'est souvent l'email
        provider: clientPrincipal.identityProvider 
      }, "AZURE_MSAL_TOKEN")
    }
  } catch (error) {
    // En local, cette erreur est normale car /.auth/me n'existe pas
    console.log("Pas de session Azure détectée (normal en local)")
  }
}

onMounted(async () => {
  // A. On charge d'abord les infos du localStorage (ta méthode actuelle)
  auth.loadFromLocalStorage()

  // B. On vérifie SI on vient de se connecter via Microsoft
  await checkAzureUser()
})
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