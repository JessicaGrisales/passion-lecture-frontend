import HeaderComponent from "./HeaderComponent.js"
import FooterComponent from "./FooterComponent.js"

const app = Vue.createApp({
  data() {
    return {
      product: "Socks"
    }
  }
})

app.component("header-component", HeaderComponent)
app.component("footer-component", FooterComponent)

app.mount("#app")
