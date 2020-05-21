rs.initiate({
    _id: "mongors1conf",
    configsvr: true, 
    members: [{ 
        _id : 0, 
        host : "mongocfg1" 
    },
    { 
        _id : 1, 
        host : "mongocfg2" 
    }, 
    { 
        _id : 2, 
        host : "mongocfg3"
    }]
})

// config_replica_set.js
// eslint-disable-next-line max-len
// docker exec -it mongocfg1 bash -c "echo 'rs.initiate({_id: \"mongors1conf\",configsvr: true, members: [{ _id : 0, host : \"mongocfg1\" },{ _id : 1, host : \"mongocfg2\" }, { _id : 2, host : \"mongocfg3\" }]})' | mongo"

// docker exec -it mongocfg1 bash -c "mongo < ./mongo/config_replica_set.js"