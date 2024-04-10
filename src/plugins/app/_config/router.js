import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '',
		name: 'Shopping Lists',
		component: () => import('/src/plugins/lib@shopping-lists/_components/ShoppingLists.vue')
	},
	{
		path: '/shopping-list/:id',
		name: 'Shopping List - Detail',
		component: () => import('/src/plugins/lib@shopping-lists/_components/ShoppingListDetail.vue')
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