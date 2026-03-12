import axios from 'axios'
import api from api.js

// const apiClient = axios.create({
//   baseURL:
//     'https://api-backend-jesdiofra-d9e4fbfcg0czcugz.switzerlandnorth-01.azurewebsites.net/api',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// })

export default {
  getBooks() {
    return api.get('/books')
  },
  getBook(id) {
    return api.get('/books/' + id)
  },
  getCategories() {
    return api.get('/categories')
  },
  getBooksByCategory(categoryId) {
    return api.get(`/category/${categoryId}/books`)
  },
}
