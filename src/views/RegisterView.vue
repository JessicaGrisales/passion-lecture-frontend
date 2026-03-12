<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthServices from '@/services/AuthServices.js'
import { useAuthStore } from '@/stores/auth' 
const auth = useAuthStore()
const router = useRouter()
const form = ref({
  username: '',
  email: '',
  hashPassword: '', // Correspond au validateur backend
  hashPassword_confirmation: '', // Correspond au .confirmed() du backend
})
const errorMessage = ref('')

const handleRegister = () => {
  AuthServices.register(form.value)
    .then((response) => {
      // Gestion du token
      const tokenValue =
        response.data.token.value || response.data.token.token || response.data.token

      localStorage.setItem('token', tokenValue)
      localStorage.setItem('user', JSON.stringify(response.data))
      auth.login(response.data, tokenValue)

      alert('Bienvenue ' + form.value.username + ' !')
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
      if (error.response && error.response.status === 422) {
        // Affiche souvent les erreurs de validation précises
        console.log(error.response.data)
        errorMessage.value = 'Données invalides. Vérifiez que les mots de passe sont identiques.'
      } else {
        errorMessage.value = "Erreur technique lors de l'inscription."
      }
    })
}
</script>

<template>
  <div class="auth-page">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="field">
        <label>Pseudo</label>
        <input v-model="form.username" type="text" required />
      </div>

      <div class="field">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input v-model="form.hashPassword" type="password" required />
      </div>

      <div class="field">
        <label>Confirmer le mot de passe</label>
        <input v-model="form.hashPassword_confirmation" type="password" required />
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit">S'inscrire</button>
    </form>

    <p style="text-align: center; margin-top: 20px">
      <RouterLink to="/login">J'ai déjà un compte</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.field {
  display: flex;
  flex-direction: column;
}
input {
  padding: 10px;
  font-size: 1rem;
}
button {
  padding: 10px;
  background: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  text-align: center;
}
</style>
