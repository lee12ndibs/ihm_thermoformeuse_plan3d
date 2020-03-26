let dao = require("./dao")
let configuration = {
	"date" : Date.now(),
	"nom" : "conf_de_test",
	"parametre" : {
		"temperature_zone" : [
			100,
			120,
			80,
			105,
			110,
			150
		]
	},
	"detail" : "sans detail"
}


let log = { "date" : Date.now(), "action" : "trainning", "detail" : "preset_trainning" }

dao.saveConfiguration(configuration).catch(e => console.log(e))
dao.saveLog(log).catch(e => console.log(e))
dao.getAllConfiguration().then(e => console.log(e))
dao.getAllLog().then(e => console.log(e))