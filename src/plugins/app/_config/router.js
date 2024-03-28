import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '',
		name: 'Shopping List - List',
		component: () => import('/src/plugins/lib@shopping-list/shopping-lists/A-shopping-lists.vue')
	},
	{
		path: '/shopping-list/:id',
		name: 'Shopping List - Detail',
		component: () => import('/src/plugins/lib@shopping-list/shopping-list-detail/shopping-list-detail.vue')
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