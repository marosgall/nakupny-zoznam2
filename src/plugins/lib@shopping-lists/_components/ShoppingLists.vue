<template>
    <template v-if="!shoppingLists">
		<p>Loading...</p>
	</template>

	<template v-else-if="shoppingLists.error">
		Error: {{ shoppingLists.error }}
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
	</template>
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
                console.log(shoppingLists)
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