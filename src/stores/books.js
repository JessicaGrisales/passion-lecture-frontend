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
        const res = await fetch(`${baseURL}${bookApi}`)
        this.books = await res.json()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },async fetchCategories() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:3333/api/category')
        this.categories = await res.json()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }  
    },
    async fetchWriters() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:3333/api/writers')
        this.writers = await res.json()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }  
    }
    ,

    async fetchBookById(id) {
      this.loading = true
      try {
        const res = await fetch(`http://localhost:3333/api/books/${id}`)
        const data = await res.json()
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
        const res = await fetch(`http://localhost:3333/api/books/${bookId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: content,
          }),
        })

        // if (!res.ok) {
        //   throw new Error('Erreur lors de la sauvegarde du Commentaire')
        // }

        const newCommentData = await res.json()

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
        const res = await fetch(`http://localhost:3333/api/books/${bookId}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ star }),
        })

        if (!res.ok) {
          throw new Error("Erreur lors de l'enregistrement de la note")
        }

        const ratingData = await res.json()

        if (this.currentBook && this.currentBook.id == bookId) {
          if (!this.currentBook.evaluate) {
            this.currentBook.evaluate = []
          }

          const existing = this.currentBook.evaluate.find(
            (e) => e.userId === ratingData.userId
          )

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
