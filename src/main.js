import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/assets/main.scss'
// 引入 element plus 样式
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
