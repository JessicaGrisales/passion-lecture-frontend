<script setup>
import { onMounted } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { useAuthStore } from '@/stores/auth'
import { msalInstance } from '@/services/msalService' // On importe l'instance MSAL

const auth = useAuthStore()

// 1. Vérifier si un compte est déjà connecté dans MSAL
const checkMsalAccount = async () => {
  try {
    // Indispensable en MSAL 3.0 : initialiser avant d'interroger les comptes
    await msalInstance.initialize();

    // Regarder si MSAL a des comptes en mémoire (localStorage)
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      const account = accounts[0]; // On prend le premier compte trouvé
      console.log("Compte MSAL détecté au démarrage :", account.name);

      // On connecte Pinia avec les infos MSAL
      auth.login({
        username: account.name,
        email: account.username
      }, account.homeAccountId);
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du compte MSAL :", error);
  }
}

onMounted(async () => {
  // A. On charge les infos locales habituelles
  auth.loadFromLocalStorage()

  // B. On vérifie la session MSAL (si l'utilisateur revient après un refresh)
  await checkMsalAccount()
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
  text-align: center;
  color: #2c3e50;
}
</style>