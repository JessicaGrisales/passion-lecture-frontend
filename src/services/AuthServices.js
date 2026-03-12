import axios from 'axios'

// On crée une instance axios spécifique
const apiClient = axios.create({
  baseURL: 'http://localhost:3333', // Attention : vérifie si tes routes Auth ont "/api" ou non
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  // Inscription
  register(credentials) {
    // credentials = { username: '...', email: '...', password: '...' }
    // Note : vérifier si ta route backend est '/register' ou '/user/register' ou '/api/user/register'
    // D'après tes routes précédentes, c'était préfixé par 'user'
    return apiClient.post('/api/user/register', credentials)
  },

  // Connexion
  login(credentials) {
    return apiClient.post('/api/user/login', credentials)
  },

  // Déconnexion (il faut envoyer le token pour savoir qui déconnecter)
  logout() {
    const token = localStorage.getItem('token')
    return apiClient.post(
      '/api/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  },
}
