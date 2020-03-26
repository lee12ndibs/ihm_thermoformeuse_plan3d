#Forme de la requete : ["methode": string, "data":Objet Json]
#Forme de la reponse  : ["code":entier, "data":objet json", infos": string] 

curl -d '["get_all_log"]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo 
curl -d '["get_temperature"]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo 
curl -d '["start"]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo 
curl -d '["set_temperature", {"zone_chauffe":[252,178,207,259,136,164]}]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo 
# curl -d '["save_log", {"log":{ "date" : "1584053951170", "action" : "trainning", "detail" : "preset_trainning"}}]' -H "Content-Type: application/json" -X POST http://localhost:3000
# echo 
# curl -d '["save_configuration", {"configuration":{ "date" : 1584053527282, "nom" : "conf_de_test", "parametre" : { "temperature_zone" : [ 100, 120, 80, 105, 110, 150 ] }, "detail" : "sans detail" }}]' -H "Content-Type: application/json" -X POST http://localhost:3000 
#echo
curl -d '["get_configuration_courante"]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo 
curl -d '["get_specifications_thermo"]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo
curl -d '["set_configuration_courante", {"config_courante" : {"_id":"5e6ab77f2337780e02017112","date":1584052095531,"nom":"test","parametre":{"temperature_zone":[100,120,80,105,110,150]},"detail":"Configuration de test de la thermoformeuse"}}]' -H "Content-Type: application/json" -X POST http://localhost:3000
echo