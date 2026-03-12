import axios from 'axios'
import { defineStore } from 'pinia'
import api from '@/services/api'

const baseURL = api.defaults.baseURL
const bookApi = '/api/books/'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    categories: [],
    writers: [],
    currentBook: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBooks() {
      this.loading = true
      try {
        const res = await api.get('/books')
        this.books = await res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchCategories() {
      this.loading = true
      try {
        const res = await api.get('/category')
        this.categories = await res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchWriters() {
      this.loading = true
      try {
        const res = await api.get('/writers')
        this.writers = await res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchBookById(id) {
      this.loading = true
      try {
        const res = await api.get(`/books/${id}`)
        const data = await res.data
        this.currentBook = data
        return data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async addComment(bookId, content) {
      this.loading = true
      const token = localStorage.getItem('token')

      try {
        const res = await api.post(
          `/books/${bookId}/comments`,
          { text: content },
          { headers: { Authorization: `Bearer ${token}` } },
        )

        // if (!res.ok) {
        //   throw new Error('Erreur lors de la sauvegarde du Commentaire')
        // }

        const newCommentData = await res.data

        if (this.currentBook && this.currentBook.id == bookId) {
          if (!this.currentBook.comments) {
            this.currentBook.comments = []
          }
          this.currentBook.comments.push(newCommentData)
        }

        return newCommentData
      } catch (error) {
        this.error = error
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async rateBook(bookId, star) {
      this.loading = true
      const token = localStorage.getItem('token')

      try {
        const res = await api.post(
          `/books/${bookId}/rate`,
          { star },
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (!res.ok) {
          throw new Error("Erreur lors de l'enregistrement de la note")
        }

        const ratingData = await res.data

        if (this.currentBook && this.currentBook.id == bookId) {
          if (!this.currentBook.evaluate) {
            this.currentBook.evaluate = []
          }

          const existing = this.currentBook.evaluate.find((e) => e.userId === ratingData.userId)

          if (existing) {
            existing.star = ratingData.star
          } else {
            this.currentBook.evaluate.push(ratingData)
          }
        }

        return ratingData
      } catch (error) {
        this.error = error
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
