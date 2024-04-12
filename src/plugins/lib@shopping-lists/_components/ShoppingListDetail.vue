<template>
    <div v-if="shoppingList" class="listDiv">
        <input class="listTitleInput" type="text" v-model="shoppingList.title" @keydown.enter="editTitle(shoppingList)" maxlength="20">
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
                            v-if="showTitleEdit === item.id"
                            v-model="newName"
                            @keydown.enter="editItemTitle(item)"
                            @keydown.esc="hideInputs(item)"
                            :data-item-id="item.id"
                        >
                    </div>
                    <span v-if="showEdit !== item.id" class="itemValue" @click="showValueEdit(item.id)">{{item.value}} {{item.unit}}</span>
                    <div v-if="showEdit === item.id" @keydown.esc="hideInputs(item)">
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
    <button @click="deleteList">Delete list</button>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			shoppingList: null,
            id: null,
            newListItemName: '',
            isChecked: null,
            showEdit: null,
            showTitleEdit: null,
            newItemTitle: '',
            newName: '',
            newValue: 1,
            newUnit: "piece"
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
                    this.newListItemName = '',
                    this.noItems = false
                }
			} catch (error) {
				if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Chyba:', error)
                }
			}
		},
        async checkMe(item) {
            this.isChecked = !item.is_checked
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}/items/${item.id}`, {
                    is_checked: this.isChecked
                })
                if (response.status === 200) {
                    item.is_checked = this.isChecked
                    // console.log(item)
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Chyba:', error)
                }
            }
        },
        async editItem(item) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}/items/${item.id}`, {
                    value: this.newValue,
                    unit: this.newUnit
                })
                item.value = this.newValue
                item.unit = this.newUnit
                this.showEdit = null

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async editItemTitle(item) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}/items/${item.id}`, {
                    name: this.newName
                })
                item.name = this.newName
                this.showTitleEdit = null
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async editTitle(shoppingList) {
            try {
                const response = await axios.put(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}`, {
                    title: this.shoppingList.title
                })
                document.querySelector('.listTitleInput').blur()
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Endpoint was not found.')
                } else {
                    console.error('Error:', error)
                }
            }
        },
        async deleteItem(item) {
            try {
                const response = await axios.delete(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.id}/items/${item.id}`)

                if(response.status === 200) {
                    const index = this.shoppingList.items.findIndex(i => i.id === item.id)
                    if (index !== -1) {
                        this.shoppingList.items.splice(index, 1)
                    }
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
                const inputEl = document.querySelector(`input.valueInput[data-item-id="${itemId}"]`)
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
                const inputEl = document.querySelector(`input.txtInput[data-item-id="${itemId}"]`)
                if (inputEl) {
                    inputEl.focus()
                }
            })
        },
        hideInputs(item) {
            this.showTitleEdit = null
            this.showEdit = null
        }
    }
}
</script>