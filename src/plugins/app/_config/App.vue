<template>
	<div id="app">
		<header>
			<TheNavigation />
		</header>

		<main class="content">
			<RouterView />
		</main>
	</div>
</template>

<script>
  import TheNavigation from '/src/plugins/lib@shopping-lists/_components/TheNavigation.vue'

  export default {
		components: {
			TheNavigation
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