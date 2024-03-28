<template>
    <h1 v-if="shoppingList">{{ shoppingList.title }}</h1>
    <ul v-if="shoppingList">
        <li v-for="item in shoppingList.items" :key="item.id">
            <div class="singleItem">
                <input type="checkbox"
                :checked="item.is_checked"
                >
                <span>{{ item.name }}</span>
                <span>{{ `${item.value} ${item.unit}` }}</span>
            </div>
            
        </li>
    </ul>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			shoppingList: null
		}
	},

	async mounted() {
	try {
		const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists')
		this.shoppingList = shoppingLists.find(({ id }) => id == this.$route.params.id)
        console.log(this.shoppingList);
	} catch (error) {
		console.error('Error:', error)
		this.shoppingList = { error }
	}
}
}
</script>