import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getBooks() {
    return apiClient.get('/books')
  },
  getBook(id) {
    return apiClient.get('/books/' + id)
  },
  getCategories() {
    return apiClient.get('/categories')
  },
  getBooksByCategory(categoryId) {
    return apiClient.get(`/category/${categoryId}/books`)
  },
}
