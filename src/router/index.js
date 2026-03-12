import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '../views/AcceuilView.vue'
import EventDetailsView from '../views/EventDetailsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import BooksView from '../views/BooksView.vue'
import AddBookView from '@/views/AddBookView.vue'
import UpdateBookView from '@/views/UpdateBookView.vue'
import SingleBookView from '@/views/SingleBookView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: EventListView,
    },
    {
      path: '/event/:id',
      name: 'event-details',
      props: true,
      component: EventDetailsView,
    },
    {
      path: '/api/categories',
      name: 'categories',
      component: CategoriesView,
    },
    {
      path: '/category/:id', // Le :id est important, c'est la partie variable
      name: 'category-books', // Ce nom doit être exact pour le lien
      component: () => import('../views/CategoryBooksView.vue'), // Ou via import en haut
    },

    { path: '/books', name: 'books', component: BooksView },
    {
      path: '/addBooks',
      name: 'addBook',
      component: AddBookView,
    },
    {
      path: '/updateBook/:id',
      name: 'updateBook',
      component: UpdateBookView,
    },
    {
      path: '/book/:id',
      name: 'singleBook',
      component: SingleBookView,
      props: true,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
