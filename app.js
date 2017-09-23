/*
* @Author: lenovo
* @Date:   2017-09-22 17:35:25
* @Last Modified by:   lenovo
* @Last Modified time: 2017-09-23 15:37:27
*/
var express=require('express');
var bodyParser = require('body-parser'); //引入body拿参的中间件模块
var app=express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use(express.static('uploadFile'));  //静态资源访问处理
app.use('/static', express.static('uploadFile'));

//引入路由
var BooksRouter = require('./router/booksRouter');
var uploadRouter = require('./router/uploadRouter');

//拦截所以api接口设置头部信息
app.all('*', function(req, res, next) {
  //跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name");
  //设置前端的这些ajax请求方法'GET,POST,PUT,HEAD,DELETE,OPTIONS'，都有权限调接口
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);

  console.log('图书管理模块前端的请求方法：',req.method);
  console.log(req.url,'图书管理模块前端传进来的参数为===：',req.method == 'GET'?req.query:req.body)

  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
  }
});

app.use('/api', BooksRouter);
app.use('/api', uploadRouter);

app.listen(3000,function(){
    console.log("node服务已启动！端口为3000")
})