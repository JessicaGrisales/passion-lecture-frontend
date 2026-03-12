// src/services/api.js
import axios from 'axios'

// 1. On récupère l'URL depuis l'environnement (Azure),
// et on garde localhost:3333 comme solution de secours pour le local.
// Note : J'ai mis les deux syntaxes courantes (Vue CLI et Vite) pour être sûr.
/*const apiUrl =
  process.env.VUE_APP_API_URL || import.meta.env?.VITE_API_URL || 'http://localhost:3333'*/
//const apiUrl = import.meta.env.VITE_API_URL || 'http://jess:3333'
// const apiUrl2 = 'https://api-backend-jesdiofra-d9e4fbfcg0czcugz.switzerlandnorth-01.azurewebsites.net'

// 2. On configure axios avec cette URL dynamique
/*const api = axios.create({
  baseURL: apiUrl,
})

export default api*/

// On récupère l'URL de l'API (Azure ou local)
// Note : On ajoute /api ici pour ne pas avoir à le répéter partout
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3333') + '/api'

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export default api
