<script setup>
import { ref, onMounted, computed } from 'vue'
import BookServices from '@/services/BookServices.js'
import BookCard from '@/components/BookCard.vue'

const books = ref([])

onMounted(() => {
  BookServices.getBooks()
    .then((response) => {
      books.value = response.data
    })
    .catch((error) => {
      console.log('Erreur API:', error)
    })
})

const latestBooks = computed(() => {
  return books.value.slice(0, 5)
})
</script>

<template>
  <div class="home-container">
    <h1 class="main-title">5 derniers ouvrages</h1>

    <p class="intro-text">
      Passion Lecture est un site dédié aux amoureux des livres. Il permet aux utilisateurs
      d’ajouter de nouveaux ouvrages dans une bibliothèque en ligne, ainsi que de modifier les
      livres déjà enregistrés. Chaque livre est présenté avec son auteur et sa catégorie, ce qui
      facilite la recherche et l’organisation. Le site offre ainsi un espace simple et pratique pour
      gérer et découvrir des lectures.
    </p>

    <div class="books-grid">
      <BookCard v-for="book in latestBooks" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 40px 20px;
  text-align: center;
  font-family: sans-serif; /* Police propre comme sur l'image */
}

.main-title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #000; /* Noir pur comme sur l'image */
  font-weight: 500;
}

/* C'est ici qu'on gère les 2/3 de la page */
.intro-text {
  width: 66%; /* Prend exactement 2/3 de la largeur disponible */
  margin: 0 auto 60px auto; /* "0 auto" centre le bloc horizontalement */
  line-height: 1.5;
  color: #000;
  font-size: 1.1rem;
}

/* Responsive : Sur mobile, on repasse à une largeur presque complète pour que ce soit lisible */
@media (max-width: 768px) {
  .intro-text {
    width: 90%;
  }
}

.books-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Espace entre les carrés */
}
</style>
