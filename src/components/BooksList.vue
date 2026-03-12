<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'

const auth = useAuthStore()
const booksStore = useBooksStore()

// Charger les livres de l'utilisateur connecté
onMounted(async () => {
  const response = await axios.get('http://localhost:3333/api/my-books', {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })

  // On remplit le store avec les livres récupérés
  booksStore.books = response.data
})

// Suppression d’un livre
const confirmSuppression = async (id) => {
  if (confirm('Supprimer ce livre ?')) {
    await booksStore.deleteBook(id)
  }
}
</script>

<template>
  <ul>
    <li v-for="book in booksStore.books" :key="book.id" class="bookContainer">
      <span class="bookTitle">{{ book.title }}</span>
      <span class="bookWriter">{{ book.writer.lastname }}</span>
      <span>{{ book.user.username }}</span>

      <RouterLink :to="{ name: 'updateBook', params: { id: book.id } }">
        <button id="modify-btn">Modifier</button>
      </RouterLink>

      <button @click="confirmSuppression(book.id)" id="del-btn">Supprimer</button>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
}

.bookContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
  padding: 14px 20px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.bookContainer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.bookTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.bookWriter {
  font-weight: 600;
  color: #555;
  margin-right: 20px;
}

.bookContainer span {
  min-width: 120px;
}

/* Boutons */
#modify-btn,
#del-btn {
  padding: 8px 14px;
  margin: 2px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.1s ease;
}

#modify-btn {
  background: #e8e8e8;
  color: #333;
}

#modify-btn:hover {
  background: #dcdcdc;
  transform: scale(1.03);
}

#del-btn {
  background: #42b983;
  color: white;
}

#del-btn:hover {
  background: #369d6d;
  transform: scale(1.03);
}
</style>
