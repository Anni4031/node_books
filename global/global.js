var MongoClient =require('mongodb').MongoClient;

//封装成为内部函数
function _connent(callback) {
     var url='mongodb://127.0.0.1:27017/booksdb';
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

// 插入数据
exports.insertOne=function(collectionName,data,callback){
    //置入数据创建时间
    data.createDate = new Date();

    _connent(function(err,db){
        db.collection(collectionName).insert(data,function(err,result){
            callback(err,result);
            db.close();
        })
    })
}

// 查找数据
// collectionName, 表名
// queryJson,     查询语句，直接塞find里面
// callback       回调函数
exports.find = function (collectionName, querySql,callback) {
    var result = [];    //结果数组
    //定义返回的数据json
    let resData = {
          "resultCode": "0",
          "resultMsg": "",
          "data": {
            "total": null,
            "data": result    
          }
        };

    //连接数据库，连接之后查找所有
    _connent(function (err, db) {
        let queryResult;                //查询结果
        queryResult = db.collection(collectionName).find(querySql);
        queryResult.each(function (err, doc) {
            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                console.log('查询图书表数据：',result)
                resData.data.total = result.length;
                //遍历结束，没有更多的文档了
                //截取对应多少条到多少条 给前端送回
                callback(null, resData);
                db.close(); //关闭数据库
            }
        });
    });
}


// 查找单条数据
exports.findItem = function (collectionName, json, callback) {
    var result = [];    //结果数组
    console.log('单条查找传参为======',json);
    //返回的数据对象
    let resData = {
          "resultCode": "0",
          "resultMsg": "",
          "data": null
        };
    //连接数据库，连接之后查找所有
    _connent(function (err, db) {
        db.collection(collectionName).findOne(json,function (err, items){
            console.log('单条查找到的数据：',items);
            resData.data = items;
            callback(null, resData);
            db.close()
        }); 
    });
}

//删除
exports.deleteMany = function (collectionName, json, callback) {
    console.log('删除传参为,',json)
    _connent(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany( json,
            function (err, results) {
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connent(function (err, db) {
        db.collection(collectionName).updateMany(
            json1, json2,
            function (err, results) {
                callback(err, results);
                db.close();
            });
    })
}


