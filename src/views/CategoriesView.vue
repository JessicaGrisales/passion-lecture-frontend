<script setup>
import { ref, onMounted } from 'vue'
import BookServices from '@/services/BookServices.js'

const categories = ref([])

onMounted(() => {
  // On appelle la nouvelle méthode du service
  BookServices.getCategories()
    .then((response) => {
      categories.value = response.data
    })
    .catch((error) => {
      console.log('Erreur:', error)
    })
})
</script>

<template>
  <div class="categories-container">
    <h1 class="main-title">Catégories en ligne</h1>

    <p class="intro-text-categorie">
      Plongez dans un univers riche en histoires, en savoir et en émotions grâce à notre sélection
      de livres soigneusement choisie. Que vous soyez passionné de romans, amateur de thrillers
      captivants, curieux de développement personnel ou en quête de connaissances à travers des
      essais et ouvrages pratiques, vous trouverez ici des livres faits pour vous.
    </p>

    <div class="categories-grid">
      <div v-for="category in categories" :key="category.id">
        <RouterLink
          :to="{ name: 'category-books', params: { id: category.id } }"
          class="category-link"
        >
          <div class="category-card">
            <h3>{{ category.label }}</h3>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style pour coller à la maquette (grille) */
.categories-container {
  padding: 40px;
  text-align: center;
}

.main-title {
  font-family: serif;
  font-size: 2rem;
  margin-bottom: 40px;
  color: #2c3e50;
}

.categories-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.category-card {
  width: 150px;
  height: 100px;
  background-color: #f0f0f0; /* Gris clair */
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.category-card:hover {
  background-color: #e0e0e0;
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}
/* C'est ici qu'on gère les 2/3 de la page */
.intro-text-categorie {
  width: 66%; /* Prend exactement 2/3 de la largeur disponible */
  margin: 0 auto 60px auto; /* "0 auto" centre le bloc horizontalement */
  line-height: 1.5;
  color: #000;
  font-size: 1.1rem;
}
.category-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
