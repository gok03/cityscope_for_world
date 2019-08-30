var mongo = require('mongodb');
var bson = require("bson");
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = bson.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cityio', server);

var cityscope_server = "http://cityscope.gok03.com";

db.open(function(err, db) {
    if(!err) {
        db.collection('this_is_first_time_testing_for_db', {strict:true}, function(err, collection) {
            if(err) {
                console.log("collection doesn't exist");
                createdb();
            }
            else{
                console.log("Connected to 'cityio' database");
            }
        });
    }
});

exports.findbyname = function(req, res) {
    var name = req.params.name;
    db.collection(name, function(err, collection) {
        collection.find().limit(1).sort({$natural:-1}).toArray(function(err, item) {
            if(item.length == 0){
                res.send({'error':'Invalid User'});
            } else{
                var timestamp = Math.floor(new Date() / 1000);
                var meta = {"apiv":"2.1","hashes":{"grid":"183328026e5e52c6b95fd1ae49bde4db83c49ccb031ec351efbbdb61403e8e35","header":"6f4fb213af90af98a32185f8b3ef4ec50c609b091cdb053f0eb74b19b1a87566","id":"12ae32cb1ec02d01eda3581b127c1fee3b0dc53572ed6baf239721a03d82e126","objects":"274c7275f8943d17ca906467b58bdd866aad1d3ef962d5f148d3360962194f00"},"id":"a51757daaa00435779d73bd08d2989beca11aa3e5baced7edf9d78c214f2780f","timestamp":timestamp};
                item[0]["meta"] = meta;
                res.send(item[0]);
            }
        });
    });
};

exports.showall = function(req, res) {
    db.listCollections().toArray(function(err, collInfos) {
            var list_to_send = []
            for(var i in collInfos){
                list_to_send.push(cityscope_server+"/api/table/"+collInfos[i]["name"])
            }
            res.send(list_to_send);
        });
};

exports.updatebyname = function(req, res) {
    var name = req.params.name;
    var log_data = req.body;
    console.log('Updating cityio db: ' + name);
    db.collection(name, function(err, collection) {
        collection.insert(log_data, {safe:true}, function(err, result) {
            if (err) {
                res.send({'data':'0'});
                console.log('error in updating');
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({'data':'1'});
            }
        });
    });
}

function createdb(){
    var demo_test = {"test":"success"};
    db.collection('this_is_first_time_testing_for_db', function(err, collection) {
        collection.insert(demo_test, {safe:true}, function(err, result) {
            if (err) {
                console.log(result);
            }
            else{
                console.log("Connected to 'cityio' database and inserted");
            }
        });
    });
}

