<script setup>
import { useBooksStore } from '@/stores/books';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import {  useRoute, useRouter } from 'vue-router';

  const route = useRoute()
  const router = useRouter()
  const bookStore = useBooksStore()
  const {categories, writers, loading} = storeToRefs(bookStore)
  //Recupere un livre dans la DB 
  const Book = ref({
    title: '',
    writer: '',
    numberOfPages: null,
    pdfLink: '',
    abstract: '',
    editor: '',
    editionYear: null,
    imagePath: '',
    userId: 1,
    categoryId: null,
    writerId: null
  })

  onMounted(async () => {
    //Charge la liste des categories et des writers
    await bookStore.fetchCategories()
    await bookStore.fetchWriters()

    const ID = route.params.id 

    try {
      const res = await bookStore.fetchBookById(ID)
      Book.value = res
    } catch (err) {
      console.error("Impossible de charger le livre", err)
    }
    
  })

  const confirmUpdate = async (id) => {
    if(confirm('Mettre à jour ?')) {
      await bookStore.updateBook(id, Book.value)
      router.push('/books') // redirection vers la liste après modification 
    }
  }
</script>

<template>
  <div class="editContainer">
    <h2>Modifier le livre</h2>

    <div v-if="loading">
      <p>Chargement des données...</p>
    </div>

    <form v-else-if="Book" @submit.prevent="confirmUpdate" >
      <div class="formBox">
        <label for="title">Titre: </label>
        <input type="text" id="title" v-model="Book.title" required>
      </div>

      <!-- Par manque de temps l'auteur est selectionné déja inserer dans la DB  -->
      <!-- Amélioration future: Mettre un champ ou l'user peut ecrire l'auteur et les vérifs pour eviter doublons  -->
      <div class="formBox">
        <label for="writer">Auteur: </label>
        <select id="writer" v-model.number="Book.writerId" required>
          <option value="" disabled>Choisir un Auteur</option>
          <option v-for="writ in writers" :key="writ.id" :value="writ.id">
            {{ writ.lastname }}
          </option>
        </select>
      </div>

      <div class="formBoxNumber">
        <label for="pages">Nombre de pages:</label>
        <input type="number" id="numberOfPages" v-model="Book.numberOfPages" required>
      </div>

      <div class="formBox">
        <label for="link">Lien:</label>
        <input type="text" id="pdfLink" v-model="Book.pdfLink" required>
      </div>
      
      <div class="formBox">
        <label for="description">Description:</label>
        <input type="text" id="abstract" v-model="Book.abstract" required>
      </div>

      <div class="formBox">
        <label for="editor">Editeur:</label>
        <input type="text" id="editor" v-model="Book.editor" required>
      </div>

      <div class="formBoxNumber">
        <label for="editionYear">Année d'édition:</label>
        <input type="number" id="editionYear" v-model="Book.editionYear">
      </div>

      <div class="formBox">
        <label for="image">Image:</label>
        <input type="text" id="imagePath" v-model="Book.imagePath">
      </div>

      <div class="formBox">
        <label for="category">Catégorie :</label>
        <select id="category" v-model.number="Book.categoryId" required>
          <option value="" disabled>Choisir une catégorie</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <button type="submit" :disabled="loading">Enregistrer les modifications</button>
    </form>
    
    <div v-else>
      <p>Impossible de trouver ce livre</p>
    </div>
  </div>
</template>

<style scoped>
.editContainer {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.formBox {
  margin-bottom: 15px;
}

.formBoxNumber{
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Pour que le padding ne sorte pas de la largeur */
}

button {
  padding: 10px 15px;
  background-color: #42b983; /* Couleur de Vue.js */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3aa873;
}
</style>