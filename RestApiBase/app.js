let express = require('express')
let bodyparser = require('body-parser')
let cors = require('cors')
let dao = require('./dao')
const fs = require('fs')


let app = express()
let port = 3000

let thermo = new Object();

let configuration_courante = new Object();

let fichier_specfications = fs.readFileSync('./specifications.json');
let specifications_thermo = JSON.parse(fichier_specfications);
//spécifications physiques de la thermoformeuse: nombre de zone, nom des zones...

initThermo(specifications_thermo)
//initialisation de la thermo

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())

//Forme de la requete : ["methode": string, "data":Objet Json]
//Forme de la reponse  : ["code":entier, "data":objet json", infos": string] 

app.post('/', (req, res)=> {
    let body = req.body;
    let reponse = new Array(3);
    reponse[1] = new Object();
    if(body[0]=== "get_temperature"){
        reponse[0] = 100;
        reponse[1].zone_chauffe = getTemperatureThermo();
        reponse[1].ambiante = getTemperatureAmbianteThermo();
        reponse[1].nom_zone_chauffe = specifications_thermo.nom_zone_chauffe
        reponse[2] = "Récuprations des températures!!!^^";
        res.json(reponse);
    }
    else if(body[0] === "get_statut"){
        reponse[0] = 100;
        // reponse[1].statut = getStatutThermo();
        reponse[2] = "Récupération du statut!^^";
        dao.getConfigurationCourante().then(resultat => {
          if(resultat === null){
            reponse[1].statut = 2;
          }
          else {
            reponse[1].statut = getStatutThermo();
          }
          res.json(reponse);
        })
    }
    else if(body[0] === "start"){
        if (startThermo() == 1){
            reponse[0] = 100;
            reponse[2] = "La thermoformeuse a bien démarrée!!!^^";
        }
        else
        {
            reponse[0] = 100;
            reponse[2] = "Un cycle est déja lancé, veuillez patienter la fin de celui-ci!!";
        }
        res.json(reponse);
    }
    else if(body[0] === "get_all_log"){
        dao.getAllLog().then(resultat => {
            reponse[0] = 100;
            reponse[1] = resultat;
            reponse[2] = "Récupérations des logs";
            res.json(reponse);
        });
    }
    else if(body[0] === "save_log"){

        dao.saveLog(body[1].log).then(()=>{
            reponse[0] = 100;
            reponse[2] = "log sauvergardé";
            res.json(reponse);
        });

    }
    else if(body[0] === "get_all_configurations"){
        dao.getAllConfiguration().then(resultat => {
            reponse[0] = 100;
            reponse[1] = resultat;
            reponse[2] = "Récupérations des configurations!!";
            res.json(reponse);
        });

    }
    else if(body[0] === "save_configuration"){
      console.log(body);
        dao.saveConfiguration(body[1]).then(() => {
            reponse[0] = 100;
            reponse[2] = "configuration sauvergardé";
            res.json(reponse);
        });
    }
    else if (body[0] === "modifier_configuration"){
      dao.updateConfiguration(body[1]).then(() => {
          reponse[0] = 100;
          reponse[2] = "configuration sauvergardé";
          res.json(reponse);
      });
    }

    else if (body[0] === "supprimer_configuration"){
      console.log(body[1]);
      dao.deleteConfiguration(body[1]).then(() => {
          reponse[0] = 100;
          reponse[2] = "configuration supprimée";
          res.json(reponse);
      });
    }
    else if (body[0] === "set_configuration_courante"){
        dao.setConfigurationCourante(body[1].item._id)
        let tab = new Array(specifications_thermo.nb_zones);
        for(let i=0; i<specifications_thermo.nb_zones; i++){
          tab[i] = body[1].item[specifications_thermo.nom_zone_chauffe[i]];
        }
        setTemperatureThermo(tab);
        console.log(body[1])
        reponse[2] = "Modification de la configuration active";
        reponse[0] = 100;
        res.json(reponse);
    }
    else if(body[0] === "get_configuration_courante"){
        dao.getConfigurationCourante().then(resultat => {
          reponse[0] = 100;
          reponse[1] = resultat
          reponse[2] = "Récupération de la configuration courante";
          res.json(reponse);
        })

    }

    else if (body[0] === "get_specifications_thermo"){
        reponse[0] = 100;
        reponse[1] = specifications_thermo;
        reponse[2] = "Récupération de la configuration active dans la thermo";
        res.json(reponse);
    }
    else {
        console.log(body);
        reponse[0] = 300;
        reponse[2] = "Veuillez entrer dans le champ \"method\" une action valide !!!";
        res.json(reponse);
    }

})


app.post('/preset')
app.listen(port, ()=>{console.log(`Test app listenning a ${port}!`)});

function getTemperatureThermo(){
    console.log("Récupération des valeurs de température des zones de chauffe")
    return thermo.zone_chauffe
}

function getTemperatureAmbianteThermo(){
    console.log("Récupération de la température ambiante")
    return 3;reponse[0] = 100;
}

function setTemperatureThermo(zone){
    console.log("Modification des températures des zones de chauffe par :" + JSON.stringify(zone));
    configuration_courante.zone_chauffe = zone
    thermo.statut_thermo = 3
    let id_int_tab = new Array();
    for (let index = 0; index < configuration_courante.zone_chauffe.length; index++) {
        id_int_tab[index] = setInterval(burn, 1000);
        function burn(){
            if(thermo.zone_chauffe[index] >= configuration_courante.zone_chauffe[index]){
                clearInterval(id_int_tab[index])
                id_int_tab[index] = 0
                let all_zero = 1
                for (let i = 0; i < id_int_tab.length; i++) {
                    const element = id_int_tab[i];
                    if(element != 0)
                        all_zero = 0
                }
                if(all_zero == 1)
                    thermo.statut_thermo = 0
            }
            else{
                thermo.zone_chauffe[index]+= 15;
            }
        }
    }
}

function getStatutThermo(){
    if (thermo.statut_thermo == 1) {
        console.log("Statut de la machine : Marche");
    } else {
        console.log("Statut de la machine : Stop");
    }
    return thermo.statut_thermo;
}


function startThermo(){
    if(getStatutThermo() == 1)
    {
        return 0;
    }
    else{
        thermo.statut_thermo = 1;
        console.log("Démarrage de la thermo!!");
        let log = new Array()
        let inter = setInterval(log_cycle, 1000)
        function log_cycle(){
            log.push({
                date : Date.now(),
                action : "lancer_cycle",
                zone_chauffe : configuration_courante.zone_chauffe
            }) 
        }
        setTimeout(()=>{
            clearInterval(inter)
            dao.saveLog(Object.assign({},log)).catch(e => console.error(e))
            thermo.statut_thermo = 0;
            console.log("Arrêt de la thermo!!");
        },30000)
        return 1;
    }
}


function initThermo(specifications_thermo){
    thermo.statut = 0
    thermo.zone_chauffe = new Array();
    for (let index = 0; index < specifications_thermo.nb_zones; index++) {
        thermo.zone_chauffe[index] = 0;
    }
}




//sauvegarde des températures dans les logs toutes les x secondes (date, action , reglages courante, tableau)
