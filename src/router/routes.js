const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/HomePage.vue')
      },
      {
        name: 'credits',
        path: 'credits',
        component: () => import('pages/CreditsPage.vue')
      },
      {
        name: 'privacy',
        path: 'privacy',
        component: () => import('pages/PrivacyPage.vue')
      },
      {
        name: 'login',
        path: 'profile',
        component: () => import('pages/LoginPage.vue'),
        props: route => route.query,
        meta: {
          requiresAuth: false
        }
      },
      {
        name: 'eventCreation',
        path: 'events/new',
        component: () => import('pages/EventCreationPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'eventView',
        path: 'events/:id',
        component: () => import('pages/EventViewPage.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
