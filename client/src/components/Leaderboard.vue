<template>
  <div class="board">
    <b-alert show v-if="loading">Loading scores, please wait, this may take a while...</b-alert>
    <b-alert show v-if="hasError" variant="danger">Error Loading Scores: {{errorMessage}}</b-alert>

    <template>
      <b-table 
        v-if="!loading"
        striped 
        hover 
        :items="items" 
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template slot="show_details" slot-scope="row">
          <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
          <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>


        <!-- SHOW DETAILS SECTION : TODO:  MOVE TO ANOTHER COMPONENT?? -->        
        <template slot="row-details" slot-scope="row">
          <b-table 
            striped 
            hover 
            :items="row.item.scoring"
            :fields="detailFields"
          >

            <!-- TODO: show JQL - fix span.title or maybe slick a button to show -->
            <span slot="name" slot-scope="query" v-html="`<span title='${row.jql}'>${query.value}</span>`"></span>
            <span slot="issueKeys" slot-scope="issueKeyData" v-html="formatIssueKeys(issueKeyData.value)"></span>
          </b-table>
        </template>
        
      </b-table>

      <p v-if="!loading">
        Sorting By: <b>{{ sortBy }}</b>,
        Sort Direction: <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
      </p>
    </template>
  </div>
</template>

<script>

import { Card, Table } from 'bootstrap-vue/es/components'
import { setTimeout } from 'timers';
// import * as _ from 'lodash'

export default {
  data() {
    return {
      loading: true,
      scores: [],
      items: [],
      fields: [
        { key: 'name', sortable: true },
        { key: 'points', sortable: true },
        { key: 'show_details', sortable: false },
      ],
      detailFields: [
        // { key: 'jql', sortable: true },
        { key: 'name', sortable: true },
        { key: 'type', sortable: true },
        { key: 'numberOfIssues', sortable: true },
        { key: 'pointMultiplier', sortable: true },
        { key: 'userPointsForIssues', sortable: true },
        { key: 'issueKeys', sortable: false },
      ],
      hasError: false,
      errorMessage: '',
      sortBy: 'points',
      sortDesc: true,
    }
  },

  components: {
  },

  props: [
  ],

  methods: {
    formatIssueKeys(issueKeys) {
      return issueKeys
        .map(issueKey => `
          <a title="See the JIRA Issue" 
             href="https://jira.redacted.com/browse/${issueKey}">
            ${issueKey}</a>`)
        .join('<br />')
    },

    async loadScores() {
      try {
        // // TODO: use vue router ?
        // // https://router.vuejs.org/api/
        // const team = window.location.hash || 'deafult_teamn ame'
        
        // // const fetchScores = await fetch('http://localhost:3000/scores/' + team)
        // const fetchScores = await fetch('/scores/' + team)

        // support for multiple teams was dropped!

        const fetchScores = await fetch('/scores')
        
        
        const scoreData = await fetchScores.json()
        this.hasError = false
        this.loading = false
        this.scores = scoreData
        this.items = scoreData.map(item => {
          return {
            name: item.name,
            points: item.points,
            username: item.username,
            scoring: item.scoring,
          }
        })

      } catch (err) {
        this.hasError = true
        this.loading = false
        this.errorMessage = err
      }
    },
  },

  async created() {
    this.loadScores()
    const refreshDelay = 600 * 1000
    // setTimeout(this.loadScores, refreshDelay)
    setInterval(() => {
      window.location.reload()
    }, refreshDelay)
  },
}

</script>

<style>

</style>
