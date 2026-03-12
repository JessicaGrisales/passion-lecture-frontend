<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ id: String })
const booksStore = useBooksStore()
const auth = useAuthStore()

const newComment = ref('')
const rating = ref(0)
const userPreviousRating = ref(null)
const successMessage = ref('')

// Charger le livre au montage
onMounted(async () => {
  await booksStore.fetchBookById(props.id)
  detectUserRating()
})

// Recharger si l'ID change
watch(() => props.id, async (newId) => {
  await booksStore.fetchBookById(newId)
  detectUserRating()
})

// ⭐ Détecter si l'utilisateur a déjà noté
const detectUserRating = () => {
  const evals = booksStore.currentBook?.evaluate || []
  const found = evals.find(e => e.userId === auth.user?.id)
  userPreviousRating.value = found ? found.star : null
  rating.value = found ? found.star : 0
}

// ⭐ Envoyer commentaire + note
const submitAll = async () => {
  try {
    // 1. Commentaire
    if (newComment.value.trim()) {
      await booksStore.addComment(props.id, newComment.value)
      newComment.value = ''
    }

    // 2. Note
    if (rating.value > 0) {
      await booksStore.rateBook(props.id, rating.value)
    }

    // 3. Recharger
    await booksStore.fetchBookById(props.id)
    detectUserRating()

    // // 4. Message de succès
    // successMessage.value = "Merci pour votre avis !"
    // setTimeout(() => successMessage.value = "", 3000)

  } catch (err) {
    console.error("Erreur lors de l’envoi :", err)
  }
}

</script>

<template>
  <div class="info-book">
    <div v-if="booksStore.currentBook">
      <h1>{{ booksStore.currentBook.title }}</h1>

      <p v-if="booksStore.currentBook.writer">
        Auteur :
        {{ booksStore.currentBook.writer.firstname }}
        {{ booksStore.currentBook.writer.lastname }}
      </p>

      <p v-if="booksStore.currentBook.editor">
        Éditeur : {{ booksStore.currentBook.editor }}
      </p>

      <p v-if="booksStore.currentBook.user">
        Vendeur : {{ booksStore.currentBook.user.username }}
      </p>

      <p v-if="booksStore.currentBook.abstract">
        Résumé : {{ booksStore.currentBook.abstract }}
      </p>

      <p v-if="booksStore.currentBook.editionYear">
        Année : {{ booksStore.currentBook.editionYear }}
      </p>

      <!-- ⭐ NOTATION -->
      <h3>Votre avis</h3>

      <!-- Message si déjà noté -->
      <p v-if="userPreviousRating" class="already-rated">
        Vous avez déjà noté :
        <span class="stars-inline">
          <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= userPreviousRating }">★</span>
        </span>
      </p>

      <!-- Étoiles cliquables -->
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= rating }" @click="rating = n">
          ★
        </span>
      </div>

      ⭐ Affichage des étoiles pour la moyenne
      <p v-if="booksStore.currentBook.evaluate?.length">
        Note moyenne :
        <span class="stars-inline">
          <span v-for="n in 5" :key="n" class="star" :class="{
            active: n <= Math.round(
              booksStore.currentBook.evaluate.reduce((s, e) => s + e.star, 0)
              / booksStore.currentBook.evaluate.length
            )
          }">
            ★
          </span>
        </span>
        {{
          (
            booksStore.currentBook.evaluate.reduce((sum, e) => sum + e.star, 0)
            / booksStore.currentBook.evaluate.length
          ).toFixed(1)
        }}/5
      </p>

      <!-- ⭐ Commentaires -->
      <h3>Commentaires</h3>

      <ul>
        <li v-for="c in booksStore.currentBook.comments" :key="c.id">
          {{ c.text }}
        </li>
      </ul>

      <textarea v-model="newComment" placeholder="Écrire un commentaire..."></textarea>

      <!-- ⭐ Bouton unique -->
      <button @click="submitAll" :disabled="booksStore.loading">
        {{ userPreviousRating ? "Modifier mon avis" : "Envoyer" }}
      </button>

      <!-- ⭐ Message de succès -->
      <p v-if="successMessage" class="success-msg">
        {{ successMessage }}
      </p>

      <p v-if="booksStore.error" class="error-msg">
        Erreur : {{ booksStore.error.message }}
      </p>
    </div>

    <div v-else>
      <p>Livre introuvable</p>
    </div>
  </div>
</template>

<style scoped>
/* ====== CONTENEUR PRINCIPAL ====== */
.info-book {
  max-width: 780px;
  margin: 2.5rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: "Inter", Arial, sans-serif;
  line-height: 1.7;
}

/* ====== TITRES ====== */
h1 {
  font-size: 2.4rem;
  margin-bottom: 1rem;
  color: #1f2937;
  font-weight: 700;
}

h3 {
  margin-top: 2.2rem;
  margin-bottom: 1rem;
  color: #111827;
  font-size: 1.35rem;
  font-weight: 600;
  border-left: 4px solid #42b983;
  padding-left: 12px;
}

/* ====== PARAGRAPHES ====== */
p {
  margin: 0.4rem 0;
  color: #4b5563;
  font-size: 1rem;
}

/* ====== ÉTOILES ====== */
.stars {
  font-size: 2.3rem;
  cursor: pointer;
  color: #d1d5db;
  margin-bottom: 1rem;
  user-select: none;
}

.star {
  transition: color 0.2s ease, transform 0.1s ease;
}

.star:hover {
  transform: scale(1.15);
}

.star.active {
  color: #facc15; /* jaune doré */
}

.stars-inline {
  font-size: 1.7rem;
  color: #d1d5db;
}

.stars-inline .star.active {
  color: #facc15;
}

.already-rated {
  color: #374151;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* ====== COMMENTAIRES ====== */
ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f9fafb;
  margin-bottom: 0.8rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: 0.2s ease;
}

li:hover {
  background: #f3f4f6;
}

/* ====== ZONE DE TEXTE ====== */
textarea {
  width: 100%;
  min-height: 90px;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  resize: vertical;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

textarea:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.25);
  outline: none;
}

/* ====== BOUTON ====== */
button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.25s ease, transform 0.1s ease;
}

button:hover:not(:disabled) {
  background-color: #369f6b;
  transform: translateY(-2px);
}

button:disabled {
  background-color: #a7b1ab;
  cursor: not-allowed;
}

/* ====== MESSAGES ====== */
.success-msg {
  margin-top: 1rem;
  color: #16a34a;
  font-weight: 600;
}

.error-msg {
  margin-top: 1rem;
  color: #dc2626;
  font-weight: 600;
}

</style>
