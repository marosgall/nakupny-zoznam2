<template>
	<h1>My Lists</h1>

	<template v-if="!shoppingLists">
		<p>Načítavam dáta</p>
	</template>

	<template v-else-if="shoppingLists.error">
		Pri načítaní dát nastala chyba: {{ shoppingLists.error }}
	</template>

	<template v-else>
		<div v-for="shoppingList in shoppingLists" :key="shoppingList.id" class="listDiv">
			<a :href="`/shopping-lists/${shoppingList.id}`" @click.prevent="openShoppingListDetail(shoppingList)">
				{{ shoppingList.title }}
			</a>
			<ul class="itemsList">
				<li v-for="item in shoppingList.items.slice(0, itemCount)">
					<div v-if="item.is_checked" class="item-unchecked singleItem">
                        <span>{{ item.name }}</span>
                        <span class="itemValue">{{ item.value }} {{ item.unit }}</span>
                    </div>
                    <div v-else class="item-checked singleItem">
                        <span>{{ item.name }}</span>
                        <span class="itemValue">{{ item.value }} {{ item.unit }}</span>                
                    </div>
				</li>
				<li v-if="shoppingList.items.length > itemCount">
                    ... and {{ shoppingList.items.length - itemCount }} others
                </li>
			</ul>
		</div>
		<a >Add new list</a>
	</template>
	<shopping-list-detail></shopping-list-detail>
</template>

<script>
    import axios from 'axios'
	
export default {
	data() {
		return {
			shoppingLists: null,
			itemCount: 3
		}
	},
	async mounted() {
		try {
			const { data: { data: shoppingLists} } = await axios.get('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists')
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

<style>
	.item-checked {
        text-decoration: none;
    }

    .item-unchecked {
        text-decoration: line-through;
    }
</style>