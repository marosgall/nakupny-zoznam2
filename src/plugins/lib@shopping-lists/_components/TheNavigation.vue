<template>
    <template v-if="mainpage">
        <h1>My Shopping Lists</h1>
        <div class="navigation">
            <router-link to="/">My lists</router-link>
            <router-link to="add-new-list">Add new list</router-link>
        </div>
    </template>
    <template v-else>
        <h1>My Shopping Lists</h1>
        <div class="navigation">
            <router-link to="/">My lists</router-link>
        </div>
    </template>
</template>

<script>
    export default {
        data() {
            return {
                mainpage: false
            }
        }
    }
</script>