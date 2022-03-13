

export default [{
  path: '/',
  name: 'index',
  component: () => import('@/views/main.vue')
},
{
  path: '/:pathMatch(.*)',
  component: () => import('@/views/error/404/index.vue')
}
]