<template>
    <template v-if="!shoppingList">
		<p>Loading...</p>
	</template>

	<template v-else-if="shoppingList.error">
		Error: {{ shoppingLists.error }}
	</template>

    <template v-else>
        <div v-if="shoppingList" class="listDiv">
            <input class="listTitleInput" ref="listTitleInput" type="text" v-model="shoppingList.title" @keydown.enter="editTitle(shoppingList)" maxlength="20">
            <ul>
                <li v-for="item in shoppingList.items" :key="item.id">
                    <div class="singleItem">
                        <div class="itemName">
                            <input class="checkbx" type="checkbox"
                            :checked="item.is_checked" @change="checkMe(item)"
                            >
                            <span v-if="showTitleEdit !== item.id" @click="showTitleInput(item.id)">{{ item.name }}</span>
                            <input
                                class="txtInput"
                                :ref="`txtInput-${item.id}`"
                                v-else
                                v-model="newName"
                                @keydown.enter="editItemTitle(item)"
                                @keydown.esc="hideInputs(item)"
                                :data-item-id="item.id"
                            >
                        </div>
                        <span v-if="showEdit !== item.id" class="itemValue" @click="showValueEdit(item.id)">{{item.value}} {{item.unit}}</span>
                        <div v-if="showEdit === item.id" :ref="`txtInput-${item.id}`" @keydown.esc="hideInputs(item)">
                            <input class="valueInput" type="number" v-model.number="newValue" @keydown.enter="editItem(item)" :data-item-id="item.id">
                            <select class="unitInput" v-model="newUnit" @keydown.enter="editItem(item)">
                                <option value="grams">grams</option>
                                <option value="kilograms">kilograms</option>
                                <option value="piece">piece</option>
                                <option value="package">packages</option>
                            </select>
                            <button class="delBtn" @click="deleteItem(item)">Del</button>
                        </div>
                    </div>
                </li>
                <li>
                    <input class="txtInput addingInput" v-model="newListItemName" @keydown.enter="addNewItem" placeholder="new item..." autofocus>
                </li>
            </ul>
        </div>
        <button class="mb-2rem" click="deleteList">Delete list</button>
    </template>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			shoppingList: null,
            showEdit: null,
            showTitleEdit: null,
            newListItemName: '',
            newItemTitle: '',
            newName: '',
            newValue: 1,
            newUnit: "piece"
		}
	},
	async mounted() {
        try {
            const { data: { data: shoppingList } } = await axios.get('https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists')

            this.shoppingList = shoppingList.find(({ id }) => id == this.$route.params.id)
            } catch (error) {
                console.error('Error:', error)
                this.shoppingList = { error }
        }
    },
    methods: {
        async deleteList() {
            try {
                await axios.delete(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}`)

                this.shoppingList = null
                this.$router.push({ name: 'Shopping Lists' })
            } catch (error) {
                console.error('Error:', error)
            }
        },
        async addNewItem() {
            try {
				const response = await axios.post(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items`, {
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
				if (error.response?.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Chyba:', error)
                }
			}
		},
        async checkMe(item) {
            const isChecked = !item.is_checked
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`, {
                    is_checked: isChecked
                })

                item.is_checked = isChecked
            } catch (error) {
                if (error.response?.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Chyba:', error)
                }
            }
        },
        async editItem(item) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`, {
                    value: this.newValue,
                    unit: this.newUnit
                })

                item.value = this.newValue
                item.unit = this.newUnit
                this.showEdit = null

            } catch (error) {
                if (error.response?.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async editItemTitle(item) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`, {
                    name: this.newName
                })

                item.name = this.newName
                this.showTitleEdit = null
            } catch (error) {
                if (error.response?.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async editTitle(shoppingList) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}`, {
                    title: this.shoppingList.title
                })
                
                this.$refs.listTitleInput.blur()
            } catch (error) {
                if (error.response?.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async deleteItem(item) {
            try {
                const response = await axios.delete(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`)

                const index = this.shoppingList.items.findIndex(i => i.id === item.id)
                if (index !== -1) {
                    this.shoppingList.items.splice(index, 1)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        },
        showValueEdit(itemId) {
            this.showEdit = itemId
            const item = this.shoppingList.items.find(i => i.id === itemId)
            this.newName = item ? item.name : ''
            this.showTitleEdit = null

            this.$nextTick(() => {
                const inputEl = this.$refs[`valueInput-${itemId}`]
                if (inputEl) {
                    inputEl.focus()
                }
            })
        },
        showTitleInput(itemId) {
            this.showTitleEdit = itemId
            const item = this.shoppingList.items.find(i => i.id === itemId)
            this.newValue = item ? item.value : ''
            this.showEdit = null
            
            this.$nextTick(() => {
                const inputEl = this.$refs[`txtInput-${itemId}`]
                if (inputEl) {
                    inputEl.focus()
                }
            })
        },
        hideInputs() {
            this.showTitleEdit = null
            this.showEdit = null
        }
    }
}
</script>