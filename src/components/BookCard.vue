<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink :to="{ name: 'singleBook', params: { id: book.id } }" class="book-card">
    <div class="image-placeholder">
      <img v-if="book.image_path" :src="book.image_path" alt="Couverture du livre">
    </div>

    <div class="book-info">
      <h3 class="title">{{ book.title }}</h3>

      <p class="author" v-if="book.writer">
        {{ book.writer.lastname }}
      </p>

      <p class="seller" v-if="book.user">Vendeur : {{ book.user.username }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.book-card {
  width: 200px;
  /* Largeur fixe pour ressembler à la maquette */
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  padding: 10px;
  background-color: white;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 180px;
  /* Hauteur du carré gris */
  background-color: #9e9e9e;
  /* Gris foncé de la maquette */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: #555;
  margin-bottom: 10px;
}

.book-info {
  text-align: center;
  width: 100%;
}

.title {
  font-size: 1.1rem;
  margin: 5px 0;
  color: #2c3e50;
  font-weight: bold;
  /* Pour couper le texte s'il est trop long */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author {
  font-size: 0.95rem;
  color: #555;
  margin: 2px 0;
}

.seller {
  font-size: 0.8rem;
  color: #888;
  margin-top: 8px;
  font-style: italic;
}
</style>
