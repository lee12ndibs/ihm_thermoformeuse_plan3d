<template>
  <svg id="histogramme_temp">
  </svg>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'vue-line-chart',
  data: () => ({
      data: undefined,
      timer: undefined,
      nb_zones: undefined,
      temp_seuils: undefined,
      margeX: 30,
      margeY: 20,
      Largeur_graphe: undefined,
      Hauteur_graphe: undefined,
      Espacement_barres: 10,
      Largeur_barres: undefined,
      tab_zones: undefined,
    }),
  mounted() {
    this.get_config();
  },
  destroyed: function(){
    clearInterval(this.timer);
  },
  watch:{
    data: function(){
      // this.createGraph();
      this.update();
    },
    tab_zones: function(){
      this.get_temp_seuil();
    },
    temp_seuils: function(){
      this.Largeur_graphe = this.nb_zones*100 + this.margeX;
      this.Hauteur_graphe = d3.max(this.temp_seuils) + 100;
      this.Largeur_barres = this.Largeur_graphe/this.nb_zones;
      this.changeData();
      this.timer = setInterval(this.changeData, 1000);
    }
  },
  methods: {
    get_temp_seuil(){
      let data_to_send = ["get_configuration_courante"];
      let headers = {'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
      fetch("http://localhost:3000", {
        method: 'post',
        headers,
        body: JSON.stringify(data_to_send)
      })
      .then(res=> res.json())
      .then(data => {
        if(data[1] === null){
          this.temp_seuils = new Array(this.nb_zones);
          for(let i=0; i<this.nb_zones; i++){
            this.temp_seuils[i] = 100;
          }
        }
        else{
          console.log(data[1]);
          this.temp_seuils = new Array(this.nb_zones);
          for (let i=0; i<this.nb_zones; i++){
            this.temp_seuils[i] = data[1][this.tab_zones[i]];
          }
        }
      });
    },
    get_config(){
      let data_to_send = ["get_specifications_thermo"];
      let headers = {'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
      fetch("http://localhost:3000", {
        method: 'post',
        headers,
        body: JSON.stringify(data_to_send)
      })
      .then(res=> res.json())
      .then(data => {
        this.nb_zones = data[1].nb_zones;
        this.tab_zones = data[1].nom_zone_chauffe;
      });
    },
    changeData(){

      let data_to_send = ["get_temperature"];
      let headers = {'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
      fetch("http://localhost:3000", {
        method: 'post',
        headers,
        body: JSON.stringify(data_to_send)
      })
      .then(res=> res.json())
      .then(data => {
        this.data = data[1].zone_chauffe;
      });
    },
    dessiner_histogramme(){
      var nb_zones = this.data.length;
      var margeX = this.margeX;
      var margeY = this.margeY;
      var Largeur_graphe = nb_zones*this.Largeur_barres + margeX;
      var Hauteur_graphe = d3.max(this.temp_seuils)*1.5 + margeY;
      var Espacement_barres = this.Espacement_barres;
      var Largeur_barres = (Largeur_graphe / nb_zones);

      var tab_zones = this.tab_zones;

      var AxeY = d3.scaleLinear()
          .domain([Hauteur_graphe,0])
          .range([0,Hauteur_graphe])

      var AxeX = d3.scaleBand()
          .domain(tab_zones)
          .range([0,Largeur_graphe])

      var svg = d3.select('#histogramme_temp')
          .attr("width", Largeur_graphe+margeX)
          .attr("height", Hauteur_graphe);

      var temp_ok = this.temp_bleues();
      var temp_pas_ok = this.temp_rouges();

      svg
      .append("g")
      .attr("transform", "translate("+margeX+","+ -margeY +")")
      .call(d3.axisLeft(AxeY));

      svg
      .append("g")
      .attr("transform", "translate("+ margeX +","+(Hauteur_graphe-margeY)+")")
      .call(d3.axisBottom(AxeX));


      svg.selectAll("graphe_rouge")
                  .data(temp_pas_ok)
                  .enter()
                  .append("rect")
                  .attr("fill", "red")
                  .attr("y", function(d) {
                      return Hauteur_graphe - d;
                  })
                  .attr("x", function() {
                      return Espacement_barres;
                  })
                  .attr("height", function(d) {
                      return d;
                  })
                  .attr("width", Largeur_barres - Espacement_barres)
                  .attr("transform", function (d, i) {
                      var translate = [(Largeur_barres * i) + margeX, -margeY];
                      return "translate("+ translate +")";
                  });

      svg.selectAll("graphe_bleu")
                  .data(temp_ok)
                  .enter()
                  .append("rect")
                  .attr("fill", "steelblue")
                  .attr("y", function(d) {
                      return Hauteur_graphe - d;
                  })
                  .attr("x", function() {
                      return Espacement_barres;
                  })
                  .attr("height", function(d) {
                      return d;
                  })
                  .attr("width", Largeur_barres - Espacement_barres)
                  .attr("transform", function (d, i) {
                      var translate = [(Largeur_barres * i) + margeX, -margeY];
                      return "translate("+ translate +")";
                  });

    },
    temp_bleues(){
    var tab = [];
    for(var i = 0; i < this.nb_zones; i++){
        if(this.data[i] <= this.temp_seuils[i]){
            tab.push(this.data[i]);
        }
        else{
            tab.push(this.temp_seuils[i]);
        }
    }
    return tab;
    },
    temp_rouges(){
      var tab = [];
      for(var i = 0; i < this.nb_zones; i++){
          if(this.data[i] > this.temp_seuils[i]){
              tab.push(this.data[i]);
          }
          else{
              tab.push(0);
          }
      }
      return tab;
    },
    update(){
      var svg = d3.select("svg");
      svg.selectAll("*").remove();
      this.dessiner_histogramme();
    }
  },
};
</script>

<style scoped>
  svg{
    margin: 25px;
  }
  path{
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
  }
</style>
