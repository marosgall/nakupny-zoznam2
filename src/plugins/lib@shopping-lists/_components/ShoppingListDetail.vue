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
        <input class="txtInput" v-model="newListItemName" @keydown.enter="addNewItem" placeholder="new item...">
    </div>
    <button @click="deleteList">Delete list</button>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			shoppingList: null,
            id: null,
            newListItemName: ''
		}
	},
    created() {
        this.id = this.$route.params.id
    },
	async mounted() {
        try {
            const { data: { data: shoppingLists } } = await axios.get('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists')
            this.shoppingList = shoppingLists.find(({ id }) => id == this.$route.params.id)
            // console.log(this.shoppingList.items);
            } catch (error) {
                console.error('Error:', error)
                this.shoppingList = { error }
        }
    },
    methods: {
        async deleteList(id) {
            try {
                await axios.delete(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}`)
                this.shoppingLists = null
                this.$router.push({ name: 'Shopping Lists' })
            } catch (error) {
                console.error('Error:', error)
            }
        },
        async addNewItem() {
            try {
				const response = await axios.post(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}/items`, {
                    name: this.newListItemName,
                    value: 1,
                    unit: 'piece',
                    is_checked: false
				})
                const newItem = response.data.data

                if (response && response.data) {
                this.shoppingList.items.push(newItem)
                this.newListItemName = ''
            }
			} catch (error) {
				if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Chyba:', error)
                }
			}
		},
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