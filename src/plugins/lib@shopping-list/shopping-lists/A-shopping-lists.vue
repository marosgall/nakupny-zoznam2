<template>
	<h1>Lists</h1>

	<template v-if="!shoppingLists">
		<p>Načítavam dáta</p>
	</template>

	<template v-else-if="shoppingLists.error">
		Pri načítaní dát nastala chyba: {{ shoppingLists.error }}
	</template>

	<template v-else>
		<div v-for="shoppingList in shoppingLists" :key="`shopping-list-cart-${shoppingList.id}`">
			<a :href="`/shopping-lists/${shoppingList.id}`" @click.prevent="openShoppingListDetail(shoppingList)">
				{{ shoppingList.title }}
			</a>
		</div>
	</template>
</template>

<script>
    import axios from 'axios'

export default {
	data() {
		return {
			shoppingLists: null
		}
	},
	async mounted() {
		try {
			const { data: { data: shoppingLists} } = await axios.get('/api/v1/shopping-lists')
			this.shoppingLists = shoppingLists
		} catch (error) {
			console.error('Error:', error)
			this.shoppingLists = { error }
		}
	},
	methods: {
		openShoppingListDetail({ id }) {
			this.$router.push({ name: 'Shopping List - Detail', params: { id } })
		}
	}
}
</script>