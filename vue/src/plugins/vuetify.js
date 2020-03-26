import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueI18n from 'vue-i18n';

Vue.use(Vuetify);
Vue.use(VueI18n);

const messages = {
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        pageText: '{0}-{1} of {2}',
      },
    },
  },
  fr: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Element per sida:',
        pageText: '{0}-{1} sur {2}',
        noResultsText: "Aucune donnée trouvée",
      },
      dataTable: {
        itemsPerPageText: 'Élements par page',
        ariaLabel: {
          sortNone:""
        }
      },
      dataFooter: {
        pageText: '{0}-{1} sur {2}',
        itemsPerPageAll: 'Afficher les tous !',
        prevPage: "Page précédente",
        nextPage: "Page suivant",
      },
      noDataText:"Aucune donné trouvé"
    },
  },
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'fr', // set locale
  messages, // set locale messages
})

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
})
