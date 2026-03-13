<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthServices from '@/services/AuthServices.js'

const router = useRouter()
const auth = useAuthStore()

// 1. DÉCLARATION DES REFS (Toujours en haut !)
const errorMessage = ref('') 

const form = ref({
  username: '',
  hashPassword: '',
})

// --- FONCTION 1 : CONNEXION CLASSIQUE ---
const handleLogin = () => {
  AuthServices.login(form.value)
    .then((response) => {
      const tokenValue = response.data.token.value || response.data.token.token || response.data.token
      localStorage.setItem('token', tokenValue)
      localStorage.setItem('user', JSON.stringify(response.data))
      auth.login(response.data, tokenValue)
      alert('Bienvenue ' + form.value.username + ' !')
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
      if (error.response && (error.response.status === 400 || error.response.status === 422)) {
        errorMessage.value = 'Pseudo ou mot de passe incorrect.'
      } else {
        errorMessage.value = 'Erreur de connexion. Vérifiez votre serveur.'
      }
    })
}

// --- FONCTION 2 : CONNEXION MICROSOFT ---
/*const handleMSALClick = async () => {
  try {
    const user = await loginWithMicrosoft();
    
    // On simule une connexion dans Pinia
    const msalUser = { username: user.name, email: user.username };
    auth.login(msalUser, "MSAL_TOKEN");
    
    alert("Connecté en tant que : " + user.name);
    router.push('/');
  } catch (err) {
    console.error("Erreur dans handleMSALClick:", err);
    errorMessage.value = "La connexion Microsoft a échoué.";
  }
}*/
const handleMSALClick = () => {
  // Cette route est gérée automatiquement par Azure Static Web Apps
  // Elle utilise les infos (Tenant, Client ID, Secret) configurées côté serveur
  window.location.href = "/.auth/login/aad";
};
</script>

<template>
  <div class="auth-page">
    <h1>Connexion</h1>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="field">
        <label>Pseudo</label>
        <input v-model="form.username" type="text" required placeholder="Votre pseudo" />
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input v-model="form.hashPassword" type="password" required placeholder="Votre mot de passe" />
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit">Se connecter</button>

      <div class="separator">OU</div>

      <button type="button" @click="handleMSALClick" class="btn-msal">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" width="18" alt="MS Logo" />
        Se connecter avec Microsoft
      </button>
      </form>

    <div class="switch-auth">
      <p>Pas encore de compte ?</p>
      <RouterLink to="/register" class="link">Créer un compte</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  /* Petit cadre gris */
  border-radius: 8px;
  background-color: white;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #34495e;
}

.error {
  color: red;
  text-align: center;
  font-weight: bold;
}

.switch-auth {
  text-align: center;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.link {
  color: #2980b9;
  text-decoration: none;
  font-weight: bold;
}
.separator {
  text-align: center;
  margin: 10px 0;
  color: #888;
  font-size: 0.9rem;
}

.btn-msal {
  background-color: #ffffff !important; /* Fond blanc */
  color: #5e5e5e !important;           /* Texte gris foncé */
  border: 1px solid #8c8c8c !important; /* Bordure grise */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-msal:hover {
  background-color: #f3f3f3 !important;
}
</style>
