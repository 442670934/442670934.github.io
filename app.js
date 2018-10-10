/**
 * Created by JH on 2018/8/1.
 * 应用程序的启动（入口）文件
 */


//加载express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');

var fs = require('fs');
var User = require('./models/User');
//创建app应用 => NodeJS Http.createServer();
var app = express();
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use( '/public', express.static( __dirname + '/public') );
//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');

//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//bodyparser设置
app.use( bodyParser.urlencoded({extended: true}) );

//设置cookie
app.use( function(req, res, next) {
    req.cookies = new Cookies(req, res);
    //解析登录用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            if(!req.userInfo.code){
                req.cookies.set('userInfo', null);
                return next();
            }
            //获取当前登录用户的类型，是否是管理员
            var fileData = fs.readFileSync('./vfcation.txt','utf-8', function (err){
                if (err) {
                    return console.error(err);
                }
            })
            fileData = JSON.parse(fileData.toString())
            for(var i = 0;i<fileData.length;i++){
                if(fileData[i].md5 === req.userInfo.code){
                    req.userInfo = fileData[i]
                }
            }
            if(!req.userInfo._id){
                req.cookies.set('userInfo', null);
                return next();
            }
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                req.userInfo.freeze = Boolean(req.userInfo.freeze);
                if(Boolean(req.userInfo.freeze)){
                    req.cookies.set('userInfo', null);
                    return next();
                }
                next();
            })
        }catch(e){
            next();
        }
    } else {
        next();
    }
} );
app.all('/api/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials",true);
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
/*
* 根据不同的功能划分模块
* */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));
function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}
function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
}
function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
//监听http请求
mongoose.connect('mongodb://127.0.0.1:27018/blog',{ useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(8081);
    }
});