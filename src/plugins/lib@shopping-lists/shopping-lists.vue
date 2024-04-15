<template>
    <template v-if="!shoppingLists">
		<p>Loading...</p>
	</template>

	<template v-else-if="shoppingLists.error">
		Error: {{ shoppingLists.error }}
	</template>

	<template v-else>
		<button v-if="!showNewListForm" class="mt-2rem" @click="showNewListForm = true">Add new list</button>
		<input v-else class="txtInput whiteBackground mt-2rem" type="text" v-model="newListTitle" @keydown.enter="addNewList" placeholder="Enter list title">
		<div v-for="shoppingList in shoppingLists" class="listDiv" :key="shoppingList.id">
			<a :href="`/shopping-lists/${shoppingList.id}`" @click.prevent="openShoppingListDetail(shoppingList)">
				{{ shoppingList.title }}
			</a>
			<ul v-if="shoppingList.items?.length" class="itemsList">
				<li v-for="item in shoppingList.items.slice(0, itemCount)">
					<div class="singleItem" :class="{ 'item-checked': item.is_checked }">
                        <span>{{ item.name }}</span>
                        <span class="itemValue">{{ item.value }} {{ item.unit }}</span>
                    </div>
				</li>
				<li v-if="shoppingList.items.length > itemCount">
                    ... and {{ shoppingList.items.length - itemCount }} others
                </li>
			</ul>
		</div>
	</template>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
			return {
				shoppingLists: null,
				itemCount: 3,
				showNewListForm: false,
                newListTitle: ''
			}
		},
        async mounted() {
			this.getShoppingLists()
		},
		methods: {
			async getShoppingLists() {
				try {
					const { data: { data: shoppingLists} } = await axios.get('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists')

					this.shoppingLists = shoppingLists
				} catch (error) {
					console.error('Error:', error)
					this.shoppingLists = { error }
				}
			},
			async addNewList() {
				try {
					if (!this.newListTitle.trim().length) {
                    	return
                	}
					const response = await axios.post('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists', {
						title: this.newListTitle,
						items: []
					})
					const newList = response.data.data

					this.shoppingLists.unshift(newList)
					this.newListTitle = ''
					this.showNewListForm = false

					this.$router.push({ name: 'Shopping List - Detail', params: { id: newList.id } })
				} catch (error) {
					console.error('Error:', error)
				}
			},
			openShoppingListDetail({ id }) {
				this.$router.push({ name: 'Shopping List - Detail', params: { id } })
			}
		}
    }
</script>

<style>
    .item-checked {
        text-decoration: line-through;
    }

    .item-unchecked {
        text-decoration: none;
    }
</style>