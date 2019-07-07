<template>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Warp</span>
        <span class="font-weight-light">Hornbach</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="authorized" @click="$root.settingsBtnClicked = true">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
</template>

<script>
  import storage from '../utils/storage';
  
  export default {
    computed: {
      authorized() {
        return this.$route.name !== 'login' && storage.getValue('administrator');
      }
    } 
  }
</script>

