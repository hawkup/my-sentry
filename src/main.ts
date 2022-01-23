import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import { RenderHtml } from './sentry/integrations/renderhtml'

import App from './App.vue'
import About from './pages/About.vue'
import Home from './pages/Home.vue'
import Form from './pages/Form.vue'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/form', component: Form }
  ]
})

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', /^\//],
    }),
    new RenderHtml()
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

app.use(router)
app.mount('#app')
