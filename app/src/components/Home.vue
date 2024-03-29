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
      <v-dialog v-model="$root.settingsBtnClicked" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Gehaltseinstellung</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Fix-Gehalt" required type="number" v-model="revenueObj.salary"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Faktor" required type="number" v-model="revenueObj.factor"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Gewinn" required type="number" v-model="revenueObj.profit"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="$root.settingsBtnClicked = false">Abbruch</v-btn>
            <v-btn color="green darken-1" flat @click="$root.settingsBtnClicked = false; updateRevenue()">Speichern</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card class="mx-auto">
        <v-card-text class="headline font-weight-bold">
          <span class="total-ads">{{ stats.personal }} / {{ stats.total }} Werbungen von Dir</span>
          <p class="caption text-xs-center last-ad">{{ lastAd }}</p>
        </v-card-text>
        <v-card-actions>
          <v-list class="action-list">
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
          </v-list>
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
            <v-list-tile-sub-title>{{ revenue(activity.username) }}</v-list-tile-sub-title>
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
  import { clearInterval, setInterval } from 'timers';

  axios.defaults.withCredentials = true;

  export default {
    data: () => ({
      refreshInterval: 0,
      loaded: false,
      stats: {
        personal: 0,
        total: 0
      },
      lastActivity: {
        username: '',
        activity_time: 0
      },
      revenueObj: {
        salary: 0,
        factor: 0,
        profit: 0
      },
      username: storage.getValue('username'),
      activities: [],
      showDialog: false
    }),
    computed: {
      avatarURL() {
        return `https://cravatar.eu/avatar/${this.username}`;
      },
      lastAd() {
        return `Letzte Werbung ${this.$root.MomentJS(new Date(this.lastActivity.activity_time * 1000)).locale('de').fromNow()} von ${this.lastActivity.username}`;
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
      revenue(username) {
        const self = this;
        const totalThisWeek = self.activities.filter((activity) => {
          const timestamp = new Date(activity.activity_time * 1000);

          return self.$root.MomentJS(timestamp).isAfter(self.$root.MomentJS().subtract(7, 'd'));
        });
        const fromUser = totalThisWeek.filter((activity) => activity.username === username);
        const salary = parseInt(this.revenueObj.salary + fromUser.length / totalThisWeek.length * this.revenueObj.factor * this.revenueObj.profit) || 0;

        if (!storage.getValue('administrator')) return `Woche: ${fromUser.length}`;
        return `Woche: ${fromUser.length} / ${totalThisWeek.length} [${salary}KAD]`;
      },
      updateRevenue() {
        axios.post('http://127.0.0.1:3003/revenue', this.revenueObj)
          .then(() => this.displayData())
          .catch((err) =>{
            console.error(err);
            this.$router.push('/login');
          })
      },
      displayData() {
        axios.get('http://127.0.0.1:3003/stats')
        .then((response) => {
          this.stats = response.data;
          return axios.get('http://127.0.0.1:3003/activities')
            .then((response) => {
              this.activities = response.data;
              return axios.get('http://127.0.0.1:3003/activities/last')
                .then((response) => {
                  this.lastActivity = response.data;
                  return axios.get('http://127.0.0.1:3003/revenue')
                    .then((response) => {
                      this.revenueObj = response.data;
                      this.loaded = true;
                    })
                })
            })
        })
        .catch((err) => {
          console.error(err);
          this.$router.push('/login');
        })
      }
    },
    mounted() {
      this.refreshInterval = setInterval(this.displayData, 30000);
      this.displayData();
    },
    beforeDestroy() {
      clearInterval(this.refreshInterval);
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
  .action-list {
    width: 100%;
  }
  .activity-list .v-list__tile__action-text {
    text-align: right;
  }
  .last-ad {
    margin-bottom: -16px;
  }
</style>