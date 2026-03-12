<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthServices from '@/services/AuthServices.js'

const router = useRouter()
const auth = useAuthStore()
// On utilise les mêmes noms que dans le validateur Backend
const form = ref({
  username: '',
  hashPassword: '',
})

const errorMessage = ref('')

const handleLogin = () => {
  AuthServices.login(form.value)
    .then((response) => {
      // 1. On récupère le token (Adonis renvoie souvent response.data.token.value)
      // On prévoit les différents cas possibles pour être sûr
      const tokenValue =
        response.data.token.value ||
        response.data.token.token ||
        response.data.token

      // 2. On sauvegarde le token et l'utilisateur dans le navigateur
      localStorage.setItem('token', tokenValue)
      localStorage.setItem('user', JSON.stringify(response.data))

      //  Mise à jour du store Pinia
      auth.login(response.data, tokenValue)
      alert('Bienvenue ' + form.value.username + ' !')

      // 3. Redirection vers l'accueil (ou "Mes livres" plus tard)
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
      // Si erreur 400 (Bad Request), c'est souvent "Identifiants invalides"
      if (error.response && (error.response.status === 400 || error.response.status === 422)) {
        errorMessage.value = 'Pseudo ou mot de passe incorrect.'
      } else {
        errorMessage.value = 'Erreur de connexion. Vérifiez votre serveur.'
      }
    })
}
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
</style>
