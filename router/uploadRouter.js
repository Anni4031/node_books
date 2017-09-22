var db=require('./../global/global.js');
var express = require('express');
var booksList=require('./../global/booksList.js');

var xlsx = require('node-xlsx');
var fs = require('fs');

var formidable = require('formidable'); //提供上传文件的模块
var path = require("path"); //提供获取获取后缀名的方法

var router = express.Router();


// 数据导入 post
router.post('/importFinancialExcel',function(req,res){
    console.log("进来了-----");
    //1.先处理上传
        // 第一步：new一个实例
        var form = new formidable.IncomingForm();
        // 第二步：设置我们的上传路径
        form.uploadDir = "./uploadFile";

        // 第三步：设置全部上传完毕后的执行函数
        form.parse(req, function(n,filename,files){ 
            console.log('--------arguments:',arguments)
            console.log('--------filename:',filename,'--------path:',files.file.path)

            var oldpath = files.file.path;
            var extname = path.extname(files.file.name);
            var newpath =   oldpath + extname;
            
            fs.rename(oldpath,newpath); //默认重命名
           
            console.log('-------文件路径为：',newpath)
            //定义返回的模拟json数据
            let jsonData = {
                    url: newpath
                }
            excel2json(res,newpath)
            
            
        });


    //2.上传成后解析excel文件成json，
        
    //3.连接数据库，并把数据存入
});

let arr = booksList[1];

function excel2json(res,excelPath){
    //读取文件内容
    var obj = xlsx.parse(__dirname+'./../'+excelPath);
    var excelObj=obj[0].data;
    console.log('解析的json--------',excelObj);
   
    for(var i = 1, len = excelObj.length;i < len; i++) {
        //定义提交入参
        let insertData = {};
        let item = excelObj[i];

        for(j in item){
            
            insertData[arr[j]] = item[j]
        }
        
        console.log('=====',insertData)
       
        financialInsert(res,insertData)
        
    }
    //定义返回的数据json
    let resData = {
          "resultCode": "0",
          "resultMsg": "插入成！",
          "data": {
            
          }
        };
    setTimeout(function(){
    	res.json(resData );
    },1000)
    	

    function financialInsert(res,insertData){
        insertData.financialDateDate = new Date(insertData.financialDate);
        
        db.insertOne('financialManage',insertData,function(err,result){
            if (err) {
                console.log('报错啦====',err)
            };
           
        }) 
    }

   
    
}
function excel2json2(res,excelPath){
    //第二种解析excel表格，
    var ejsExcel=require('ejsexcel');
    var fs=require('fs');
    let exBuf=fs.readFileSync(__dirname+'./../'+excelPath);
    let workSheets;

    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        console.log("************  read success:getExcelArr");
        let workBook=exlJson;
        workSheets=workBook[0];
        console.log('解析的json--------',workSheets);

        workSheets.forEach((item,index)=>{
                console.log((index+1)+" row:"+item.join('    '));
        })
    }).catch(error=>{
        console.log("************** had error!");
        console.log(error);

        //出错给接口返回错误信息
        res.json(error)
    });

}

module.exports = router;