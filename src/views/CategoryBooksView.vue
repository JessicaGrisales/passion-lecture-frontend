<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BookServices from '@/services/BookServices.js'
// 1. On importe votre composant visuel
import BookCard from '@/components/BookCard.vue'

const route = useRoute()
const books = ref([])
const loading = ref(true)

onMounted(() => {
  // 2. On récupère l'ID de la catégorie dans l'URL (ex: 5)
  const categoryId = route.params.id

  // 3. On appelle le service spécifique (pas tous les livres, juste ceux de la catégorie)
  BookServices.getBooksByCategory(categoryId)
    .then((response) => {
      books.value = response.data
      loading.value = false
    })
    .catch((error) => {
      console.log('Erreur:', error)
      loading.value = false
    })
})
</script>

<template>
  <div class="category-books-page">
    <h1 class="main-title">Livres de la catégorie</h1>

    <p v-if="loading">Chargement...</p>

    <div v-else-if="books.length === 0" class="empty-message">
      <p>Aucun livre trouvé dans cette catégorie pour le moment.</p>
    </div>

    <div v-else class="books-grid">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<style scoped>
.category-books-page {
  padding: 40px;
  text-align: center;
}

.main-title {
  font-family: serif;
  font-size: 2rem;
  margin-bottom: 40px;
  color: #2c3e50;
}

/* On reprend le style de grille pour que les BookCard soient bien alignées */
.books-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.empty-message {
  color: #777;
  font-style: italic;
  margin-top: 20px;
}
</style>
