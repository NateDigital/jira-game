<template>
  <div id="app">
    <b-container>
      <div class="scoreboard">
        <h1>{{ title }}</h1>
        <leaderboard></leaderboard>
      </div>
    </b-container>
  </div>
</template>

<script>

  import Leaderboard from './components/Leaderboard.vue'

  export default {
    components: {
      Leaderboard
    },

    data () {
      return {
        title: 'Sprint Leaderboard',
      }
    },

    methods: {}
  }
</script>

<style>
</style>
