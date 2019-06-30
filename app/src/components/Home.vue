<template>
  <v-layout v-if="loaded">
    <v-flex xs12 sm6 offset-sm3>
      <v-dialog v-model="showDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Werbung eintragen?</v-card-title>
          <v-card-text>
            Hast Du Werbung gemacht und möchtest diese eintragen?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="showDialog = false">Nein</v-btn>
            <v-btn color="green darken-1" flat @click="showDialog = false; postActivity()">Ja</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card class="mx-auto">
        <v-card-text class="headline font-weight-bold">
          <span class="total-ads">{{ stats.personal }} / {{ stats.total }} Werbungen von Dir</span>
        </v-card-text>
        <v-card-actions>
          <v-list-tile class="grow">
            <v-list-tile-avatar color="grey darken-3">
              <v-img :src="avatarURL"></v-img>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ username }}</v-list-tile-title>
            </v-list-tile-content>
            <v-layout align-center justify-end>
              <v-btn color="primary" @click="showDialog = true">Eintragen</v-btn>
            </v-layout>
          </v-list-tile>
        </v-card-actions>
      </v-card>
      <v-list class="activity-list">
        <v-subheader>Aktivitäten</v-subheader>
        <v-list-tile avatar v-for="activity in activities" :key="activity.id">
          <v-list-tile-avatar>
            <img :src="displayAvatar(activity.username)" alt="Avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ activity.username }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>{{ displayTime(activity.activity_time) }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios';
  import storage from '../utils/storage';

  axios.defaults.withCredentials = true;

  export default {
    data: () => ({
      loaded: false,
      stats: {
        personal: 0,
        total: 0
      },
      username: storage.getValue('username'),
      activities: [],
      showDialog: false
    }),
    computed: {
      avatarURL() {
        return `http://cravatar.eu/avatar/${this.username}`;
      }
    },
    methods: {
      displayTime(timestmap) {
        return this.$root.MomentJS(new Date(timestmap * 1000)).locale('de').fromNow();
      },
      displayAvatar(username) {
        return `https://cravatar.eu/avatar/${username}`;
      },
      postActivity() {
        axios.post('http://127.0.0.1:3003/activities')
          .then(() => this.displayData())
          .catch((err) => {
            console.error(err);
            this.$router.push('/login');
          })
      },
      displayData() {
        axios.get('http://127.0.0.1:3003/stats')
        .then((response) => {
          this.stats = response.data;
          axios.get('http://127.0.0.1:3003/activities')
            .then((response) => {
              this.activities = response.data;
              this.loaded = true;
            })
            .catch((err) => {
              console.error(err);
              this.$router.push('/login');
            });
        })
        .catch((err) => {
          console.error(err);
          this.$router.push('/login');
        })
      }
    },
    mounted() {
      this.displayData();
    }
  }
</script>

<style scoped>
  .mx-auto {
    box-shadow: unset;
  }
  .total-ads {
    padding-left: 16px;
  }
  .activity-list {
    padding: 8px;
  }
</style>