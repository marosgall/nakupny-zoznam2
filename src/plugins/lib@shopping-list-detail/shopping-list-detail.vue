<template>
    <template v-if="!shoppingList">
		<p>Loading...</p>
	</template>

	<template v-else-if="shoppingList.error">
		Error: {{ shoppingLists.error }}
	</template>

    <template v-else>
        <div v-if="shoppingList" class="listDiv">
            <input v-model="shoppingList.title" @keydown.enter="editTitle(shoppingList)" class="listTitleInput" ref="listTitleInput" type="text" maxlength="20">
            <ul>
                <li v-for="item in shoppingList.items" :key="item.id">
                    <div class="singleItem">
                        <div class="itemName">
                            <input @change="checkMe(item)" :checked="item.is_checked" class="checkbx" type="checkbox">
                            <span v-if="showTitleEdit !== item.id" @click="showTitleInput(item.id)">{{ item.name }}</span>
                            <input
                                v-else
                                v-model="newName"
                                :ref="`txtInput-${item.id}`"
                                :data-item-id="item.id"
                                @keydown.enter="editItemTitle(item)"
                                @keydown.esc="hideInputs(item)"
                                class="txtInput"
                            >
                        </div>
                        <span v-if="showEdit !== item.id" @click="showValueEdit(item.id)" class="itemValue">
                            {{item.value}} {{item.unit}}
                        </span>
                        <div v-else @keydown.esc="hideInputs(item)">
                            <input
                                v-model.number="newValue"
                                :ref="`valueInput-${item.id}`"
                                :data-item-id="item.id"
                                @keydown.enter="editItem(item)" 
                                class="valueInput" type="number"
                            >
                            <select v-model="newUnit" @keydown.enter="editItem(item)" class="unitInput">
                                <option value="grams">grams</option>
                                <option value="kilograms">kilograms</option>
                                <option value="piece">piece</option>
                                <option value="package">packages</option>
                            </select>
                            <button @click="deleteItem(item)" class="delBtn">Del</button>
                        </div>
                    </div>
                </li>
                <li>
                    <input v-model="newListItemName" @keydown.enter="addNewItem" class="txtInput addingInput" placeholder="new item..." autofocus>
                </li>
            </ul>
        </div>
        <button @click="deleteList(shoppingList.id)" class="mb-2rem">Delete list</button>
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
        async deleteList(shoppingListId) {
            try {
                await axios.delete(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${shoppingListId}`)

                this.shoppingList = null
                this.$router.push({ name: 'Shopping Lists' })
            } catch (error) {
                console.error('Error:', error)
            }
        },
        async addNewItem() {
            try {
				if (!this.newListItemName.trim().length) {
                    return
                }
                const response = await axios.post(`https://shoppinglist.wezeo.dev/cms/api/v1/shopping-lists/${this.$route.params.id}/items`, {
                    name: this.newListItemName,
                    value: 1,
                    unit: 'piece',
                    is_checked: false
				})

                const newItem = response.data.data

                this.shoppingList.items.push(newItem)
                this.newListItemName = ''
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
                if (!this.newName.trim().length) {
                    return
                }
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
                if (!this.shoppingList.title.trim().length) {
                    return
                }
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
            this.newValue = item ? item.value : ''
            this.showTitleEdit = null

            this.$nextTick(() => {
                const inputEl = this.$refs[`valueInput-${itemId}`]
                if (inputEl) {
                    inputEl[0].focus()
                }
            })
        },
        showTitleInput(itemId) {
            this.showTitleEdit = itemId
            const item = this.shoppingList.items.find(i => i.id === itemId)
            this.newName = item ? item.name : ''
            this.showEdit = null
            
            this.$nextTick(() => {
                const inputEl = this.$refs[`txtInput-${itemId}`]
                if (inputEl) {
                    inputEl[0].focus()
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

<style scoped>
    .listTitleInput {
        background-color: #FFFDD1;
        border: none;
        border-bottom: 1px solid darkgrey;
        text-align: center;
        width: 100%;
        font-size: 2em;
        font-weight: bold;
    }

    .checkbx {
        margin-right: 0.25rem;
    }

    .valueInput,
    .unitInput {
        border: none;
        background-color: #FFFDD1;
        border-bottom: 1px solid darkgray;
        margin-left: 0.5rem;
        max-width: fit-content;
    }

    .valueInput {
        width: 2.8rem;
    }

    .delBtn {
        color: red;
        padding: 2px;
        margin-bottom: 0;
        font-size: small;
    }

    .addingInput {
        width: 100%;
        text-align: center;
    }

</style>