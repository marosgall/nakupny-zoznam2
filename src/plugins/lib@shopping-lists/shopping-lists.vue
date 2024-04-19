<template>
    <template v-if="!shoppingLists">
		<p>Loading...</p>
	</template>

	<template v-else-if="shoppingLists.error">
		Error: {{ shoppingLists.error }}
	</template>

	<template v-else>
		<button v-if="!showNewListForm" @click="showNewListForm = true" class="mt-2rem">Add new list</button>
		<input v-else v-model="newListTitle" @keydown.enter="addNewList" class="txtInput whiteBackground mt-2rem" type="text" placeholder="Enter list title">
		<div v-for="shoppingList in shoppingLists" :key="shoppingList.id" class="listDiv">
			<a :href="`/shopping-lists/${shoppingList.id}`" @click.prevent="openShoppingListDetail(shoppingList)">
				{{ shoppingList.title }}
			</a>
			<ul v-if="shoppingList.items?.length" class="itemsList">
				<li v-for="item in shoppingList.items.slice(0, itemCount)">
					<div :class="{ 'item-checked': item.is_checked }" class="singleItem">
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