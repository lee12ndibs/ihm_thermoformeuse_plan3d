<template>
  <v-app>
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <img alt="Graphe temp" src="./assets/logo.png" height=80%/>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
        <Main v-if="activePage === 'Main'"/>
        <Logs v-else-if="activePage === 'Logs'"/>
        <Config v-else-if="activePage === 'Config'"/>

    </v-content>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group active-class="green--text text--accent-4">
          <v-list-item v-on:click="activePage = 'Main'" v-model="active[0]">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item>

          <v-list-item v-on:click="activePage = 'Config'" v-model="active[1]">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Configuration</v-list-item-title>
          </v-list-item>

          <v-list-item @click="activePage = 'Logs'" v-model="active[2]">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logs</v-list-item-title>
          </v-list-item>
          <v-list-item @click="activePage = ''" v-model="active[3]">
            <v-list-item-icon>
              <v-icon>mdi-account-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Changer le mot de passe</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>
<script>
import Main from './components/Main';
import Logs from './components/Logs';
import Config from './components/Config'
export default {
  name: 'App',

  components: {
    Main,
    Logs,
    Config
  },

  data: () => ({
    active: [false, false, false, false],
    drawer: false,
    activePage: 'Main',
  }),
  watch: {
    activePage: function() {
      this.drawer = false;
    },
    drawer: function(){
      this.active[0] = false;
      this.active[1] = false;
      this.active[2] = false;
      this.active[3] = false;
    }
  },
};
</script>
