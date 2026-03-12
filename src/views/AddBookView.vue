<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
const router = useRouter()
//Chargement des Catégories et écrivains de la DB
const categories = ref([])
const writers = ref([])
//Variable pour ajouter un livre dans la DB
const newBook = ref({
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

//Charge les données des catégories et ecrivains avant des les mettres dans les tableau
//Catégories 
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3333/api/category')
    categories.value = response.data
  } catch (error) {
    console.error("Erreur lors du chargement des catégories", error)
  }
})
//Ecrivains
onMounted(async () => {
  try {
    const response = axios.get('http://localhost:3333/api/writers')
    writers.value = (await response).data
  } catch (error) {
    console.error("Erreur lors du chargement des écrivains", error)
  }
})

//Envoie le livre au backend pour ajout dans la db
const submitBook = async () => {
  try {
    const response = await axios.post('http://localhost:3333/api/books', newBook.value)
    alert('Livre ajouté avec succès  !')

    console.log('Livre ajouté avec succès !', response.data)
    router.push('/books')
  } catch (error) {
    console.error('Erreur lors de l\'envoi :', error)
  }


}
</script>

<template>
  <div class="addContainer">
    <h2>Ajouter un nouvel ouvrage</h2>

    <form @submit.prevent="submitBook" class="addContainer">
      <div class="formBox">
        <label for="title">Titre: </label>
        <input type="text" id="title" v-model="newBook.title" required>
      </div>

      <!-- Par manque de temps l'auteur est selectionné déja inserer dans la DB  -->
      <!-- Amélioration future: Mettre un champ ou l'user peut ecrire l'auteur et les vérifs pour eviter doublons  -->
      <div class="formBox">
        <label for="writer">Auteur: </label>
        <select id="writer" v-model.number="newBook.writerId" required>
          <option value="" disabled>Choisir un Auteur</option>
          <option v-for="writ in writers" :key="writ.id" :value="writ.id">
            {{ writ.lastname }}
          </option>
        </select>
      </div>

      <div class="formBoxNumber">
        <label for="pages">Nombre de pages:</label>
        <input type="number" id="numberOfPages" v-model="newBook.numberOfPages" required>
      </div>

      <div class="formBox">
        <label for="link">Lien:</label>
        <input type="text" id="pdfLink" v-model="newBook.pdfLink" required>
      </div>

      <div class="formBox">
        <label for="description">Description:</label>
        <input type="text" id="abstract" v-model="newBook.abstract" required>
      </div>

      <div class="formBox">
        <label for="editor">Editeur:</label>
        <input type="text" id="editor" v-model="newBook.editor" required>
      </div>

      <div class="formBoxNumber">
        <label for="editionYear">Année d'édition:</label>
        <input type="number" id="editionYear" v-model="newBook.editionYear">
      </div>

      <div class="formBox">
        <label for="image">Image:</label>
        <input type="text" id="imagePath" v-model="newBook.imagePath">
      </div>

      <div class="formBox">
        <label for="category">Catégorie :</label>
        <select id="category" v-model.number="newBook.categoryId" required>
          <option value="" disabled>Choisir une catégorie</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <button type="submit">Ajouter l'ouvrage</button>
    </form>
  </div>
</template>

<style scoped>
.addContainer {
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

.formBoxNumber {
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
  box-sizing: border-box;
  /* Pour que le padding ne sorte pas de la largeur */
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  /* Couleur de Vue.js */
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