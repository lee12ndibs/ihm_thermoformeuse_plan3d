var MongoClient = require('mongodb').MongoClient;
var MongoObjectID = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/";
var nomdb = "test_db";


async function saveConfiguration(conf){

    const client = new MongoClient(url);

    await client.connect();

    await client.db(nomdb).collection("configurations").insertOne(conf, function(err, res) {
        if (err) throw err;
        console.log("configuration bien enregistrée !!");
        client.close();
    });
}

async function updateConfiguration(conf){
    let id = conf._id;
    const client = new MongoClient(url);

    await client.connect();
    console.log(id);
    delete conf._id;
    await client.db(nomdb).collection("configurations").updateOne({_id:new MongoObjectID(id)}, {$set: conf}, function(err, res) {
        if (err) throw err;
        console.log("configuration bien Mise à jour !!");
        client.close();
    });
}

async function deleteConfiguration(conf){
  console.log(conf);
    let id = conf._id;
    const client = new MongoClient(url);

    await client.connect();
    console.log(id);
    await client.db(nomdb).collection("configurations").deleteOne({_id:new MongoObjectID(id)}, function(err, res) {
        if (err) throw err;
        console.log("configuration bien Supprimé !!");
        client.close();
    });
}

async function getConfigurationByNom(nom){

    const client = new MongoClient(url);

    try {
        await client.connect();

        return await client.db(nomdb).collection("configurations").findOne({'nom' : nom}) ;

    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

async function getAllConfiguration(){
    const client = new MongoClient(url);
    try {
        await client.connect();

        return await client.db(nomdb).collection("configurations").find().toArray() ;

    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}


async function saveLog(log){

    const client = new MongoClient(url);

    await client.connect();

    await client.db(nomdb).collection("logs").insertOne(log, function(err, res) {
        if (err) throw err;
        console.log("log bien enregistrée!!");
        client.close();
    });
}

async function getAllLog(){
    const client = new MongoClient(url);
    try {
        await client.connect();

        return await client.db(nomdb).collection("logs").find().toArray() ;

    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

async function setConfigurationCourante(id_config){
    const client = new MongoClient(url);
    try {
        await client.connect();
        let config_active = await getConfigurationCourante()
        if (config_active != null ){
            await client.db(nomdb).collection("configurations").updateOne({_id:config_active._id}, {$set:{active:false}})
        }

        await client.db(nomdb).collection("configurations").updateOne({_id:new MongoObjectID(id_config)}, {$set:{active:true}})

    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

async function getConfigurationCourante(){
    const client = new MongoClient(url);
    try {
        await client.connect();

        return await client.db(nomdb).collection("configurations").findOne({active: true});

    } catch (e) {
        throw (e);
    } finally {
        await client.close();
    }
}

exports.getAllConfiguration = getAllConfiguration
exports.getConfigurationByNom = getConfigurationByNom
exports.saveConfiguration = saveConfiguration
exports.getAllLog = getAllLog
exports.saveLog = saveLog
exports.getConfigurationCourante = getConfigurationCourante
exports.setConfigurationCourante = setConfigurationCourante
exports.updateConfiguration = updateConfiguration
exports.deleteConfiguration = deleteConfiguration
