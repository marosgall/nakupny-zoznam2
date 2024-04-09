<template>
    <div v-if="shoppingList" class="listDiv">
        <h1 class="listHeading">{{ shoppingList.title }}</h1>
        <ul>
            <li v-for="item in shoppingList.items" :key="item.id">
                <div class="singleItem">
                    <div class="itemName">
                        <input class="checkbx" type="checkbox"
                        :checked="item.is_checked"
                        >
                        <span>{{ item.name }}</span>
                    </div>
                    <span class="itemValue">{{item.value}} {{item.unit}}</span>
                </div>
            </li>
        </ul>
        <input class="txtInput" type="text" placeholder="new item..">
    </div>
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
            const { data: { data: shoppingLists } } = await axios.get('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists')
            this.shoppingList = shoppingLists.find(({ id }) => id == this.$route.params.id)
            console.log(this.shoppingList);
            } catch (error) {
                console.error('Error:', error)
                this.shoppingList = { error }
        }
    },
    methods: {

    }
}
</script>

<style scoped>
    .txtInput {
        background-color: #FFFDD1;
        border: none;
        position: relative;
        right: 100px;
    }
</style>