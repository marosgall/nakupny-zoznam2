import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '',
		redirect: '/shopping-lists'
	},
	{
		path: '/shopping-lists',
		name: 'Shopping Lists',
		component: () => import('/src/plugins/lib@shopping-lists/shopping-lists.vue')
	},
	{
		path: '/shopping-list/:id',
		name: 'Shopping List - Detail',
		component: () => import('/src/plugins/lib@shopping-list-detail/shopping-list-detail.vue')
	},
	{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: () => import('/src/plugins/app/views/not-found.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory('/'),
	routes
})

export default router