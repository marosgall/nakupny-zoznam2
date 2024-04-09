<template>
    <h2>Type new list name</h2>
    <input type="text" v-model="listName" v-focus>
</template>

<script>
    export default {
        data() {
            return {
                listName: ''
            }
        }
    }
</script>

<script setup> 
    const vFocus = {
        mounted: (el) => el.focus()
    }
</script>