<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/')   // redirection vers l'accueil
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink :to="{ name: 'accueil' }">Accueil</RouterLink> |
        <RouterLink :to="{ name: 'categories' }">Catégories</RouterLink> |

        <!-- Si NON connecté -->
        <template v-if="!auth.user">
          <RouterLink :to="{ name: 'register' }">S'inscrire</RouterLink> |
          <RouterLink :to="{ name: 'login' }">Connexion</RouterLink>
        </template>

        <!-- Si connecté -->
        <template v-else>
          <RouterLink :to="{ name: 'books' }">Mes livres</RouterLink> |
          <RouterLink :to="{ name: 'addBook' }">Ajouter un livre</RouterLink> |
          <a href="#" @click.prevent="handleLogout">Logout</a>
        </template>
      </nav>
    </div>
  </header>
</template>


<style scoped>
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
