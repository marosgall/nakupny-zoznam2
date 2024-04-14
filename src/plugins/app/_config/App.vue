<template>
		<header>
			<A-navigation />
		</header>

		<main class="content">
			<RouterView />
		</main>
</template>

<script>
  import ANavigation from '/src/plugins/app/_layout/a-navigation.vue'

  export default {
		components: {
			ANavigation
		}
	}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>