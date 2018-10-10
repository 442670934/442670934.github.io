var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Label = require('../models/Label');
var Content = require('../models/Content');
var md = require('./md5')
var fs = require('fs');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./email-config')
function pageCount(page,count){
    //当前页码
    var page = Number(page) || 1;
    //每页长度
    var limit = 10;
    //跳过前几页数据
    var skip = (page-1)*limit;
    //总页数
    var pages = 0;
    //计算总页数
    pages = Math.ceil(count/limit);
    //页码不能超过pages
    page = Math.min(page,pages)
    //页码不能少于一
    page = Math.max(page,1)
    return {
        page:page,
        limit:limit,
        skip:skip,
        pages:pages,
        count:count
    }
}
//统一返回格式
var responseData;
function errorFn (code,msg) {
    responseData.code = code;
    responseData.data = "";
    responseData.message = msg;
}
router.use( function(req, res, next) {
    responseData = {
        code: 0,
        message: '执行成功'
    }

    next();
} );
//设置邮箱配置
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));
//获取时间
var bandCode = []
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//时间转化
function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}
var clearTimeCode = function(){
    setTimeout(()=>{
        for(var i = 0;i<bandCode.length;i++){
            var timeCode = parseInt(bandCode[i].code,36);
            var time = Date.parse(new Date());
            var timeOut = time - timeCode;
            if(timeOut>=(15*60*1000)){
                bandCode.remove(bandCode[i])
            }
        }
    },15*60*1000);
}
router.get('/getCode',function(req,res,next){
    var username = req.query.username || '';
    if(!username){
        errorFn(1,'用户名为空')
        res.json(responseData)
        return;
    }
    var timeCode = Date.parse(new Date()).toString(36);
    var codData = {
        username:username,
        code:timeCode
    }
    bandCode.push(codData)
    clearTimeCode();
    responseData.message = '获取成功';
    responseData.data = {
        data:timeCode
    };
    res.json(responseData)
})
//邮箱验证码
router.get('/user/emailVerification',(req,res,next)=>{
    var email = req.query.email || '';
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if(!email){
        errorFn(1,'email名为空')
        res.json(responseData)
        return;
    }else if(!reg.test(email)){
        errorFn(6,'邮箱格式错误')
        res.json(responseData)
        return;
    }
    var timeCode = Date.parse(new Date()).toString(36);
    timeCode = timeCode.substr(timeCode.length-5,5)
    var codData = {
        username:email,
        code:timeCode
    }
    smtpTransport.sendMail({

        from: config.email.user,
        to: email,
        subject: '感谢您注册JH博客，这是您账号的验证码',
        html: timeCode+'<br/>验证码有效时间为15分钟,请尽快复制上面代码进行注册'
    }, function (error, response) {
        if (error) {
            errorFn(7,error)
            res.json(responseData)
            return
        }
        responseData.message = '邮件已发送';
        responseData.data = timeCode;
        res.json(responseData)
        bandCode.push(codData)
    });
})
//注册
router.post('/user/register',function(req,res,next){
    var username = req.body.username || '';
    var nickname = req.body.nickname || '';
    var email = req.body.email || '';
    var code = req.body.code || '';
    var md5 = req.body.data || '';
    //用户是否为空
    if (!username) {
        errorFn(1,'用户名不能为空')
        res.json(responseData);
        return;
    }
    //昵称
    if (!nickname) {
        nickname = username;
        return;
    }
    if (!email) {
        errorFn(1,'邮箱不能为空')
        res.json(responseData);
        return;
    }
    if (!code) {
        errorFn(1,'验证码不能为空')
        res.json(responseData);
        return;
    }
    if (!md5) {
        errorFn(1,'密码不能为空')
        res.json(responseData);
        return;
    }

    User.findOne({username:username}).then(function(userInfo){
        if(userInfo){
            //表示数据库中有该记录
            errorFn(2,'用户名已经被注册了')
            res.json(responseData);
            return;
        }
        var timeCode = '';
        for(var i = 0;i<bandCode.length;i++){
            if(bandCode[i].username === email){
                timeCode = bandCode[i].code;
                bandCode.remove(bandCode[i])
                break;
            }
        }
        if(!timeCode || timeCode!==code){
            errorFn(4,'验证码错误')
            res.json(responseData);
            return;
        }
        var user = new User({
            username: username,
            nickname: nickname,
            email:email,
            md5:md5
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.data = "";
        responseData.message = '注册成功'
        res.json(responseData)
    })
})
router.post('/user/login',function(req,res,next){
    var username = req.body.username || '';
    var code = req.body.code || '';
    if(!username){
        errorFn(1,'用户名不能为空')
        res.json(responseData);
        return;
    }
    if(!code){
        errorFn(1,'参数code为空!')
        res.json(responseData);
        return;
    }
    User.findOne({username:username}).then(function(userInfo){
        if(!userInfo){
            //表示数据库中有该记录
            errorFn(3,'用户名或密码错误')
            res.json(responseData);
            return;
        }
        var timeCode = '';
        for(var i = 0;i<bandCode.length;i++){
            if(bandCode[i].username === userInfo.username){
                timeCode = bandCode[i].code;
                bandCode.remove(bandCode[i])
            }
        }
        if(!timeCode){
            errorFn(4,'加密代码错误')
            res.json(responseData);
            return;
        }
        if(userInfo.freeze){
            errorFn(5,'账号已被冻结')
            res.json(responseData);
            return;
        }
        var compared = timeCode + userInfo.md5
        if(md.hex_md5(compared) !== code){
            errorFn(3,'用户名或密码错误')
            res.json(responseData);
            return;
        }
        userInfo.md5 = code;
        fs.readFile('./vfcation.txt','utf-8', function (err, data) {
            if (err) {
                return console.error(err);
            }
            if(data){
                data = JSON.parse(data.toString())
            }else{
                data = [];
            }
            var isAdd = true;
            for(var i = 0;i<data.length;i++){
                if(data[i]._id == userInfo._id){
                    data[i].md5 = code
                    isAdd = false
                }
            }
            if(isAdd){
                data.push(userInfo)
            }
            fs.writeFile('./vfcation.txt',JSON.stringify(data),'utf-8',function(err){
                if(err){
                    return console.error(err);
                }
            })
        })
        req.cookies.set('userInfo', JSON.stringify({
            code: userInfo.md5
        }));
        responseData.data = {
            user:userInfo
        };
        responseData.message = '登陆成功';
        res.json(responseData);
    })
})
router.get('/user/logout', function(req, res) {
    var mdcode = req.query.code || req.userInfo.code
    //获取当前登录用户的类型，是否是管理员
    fs.readFile('./vfcation.txt','utf-8', function (err, data) {
        if (err) {
            return console.error(err);
        }
        if(data){
            data = JSON.parse(data.toString())
        }else{
            data = [];
        }
        for(var i = 0;i<data.length;i++){
            if(data[i].md5 === mdcode){
                req.userInfo = data[i]
                data.remove(data[i])
            }
        }
        fs.writeFile('./vfcation.txt',JSON.stringify(data),'utf-8',function(err){
            if(err){
                return console.error(err);
            }
        })
    })
    req.cookies.set('userInfo', null);
    responseData.message = '退出成功';
    res.json(responseData);
});
router.get('/user/info',function(req,res){
    var userId = req.userInfo._id || req.query.id;
    var userName = req.query.username || "";
    var term ={freeze:false};
    if(userId){
        term._id = userId;
    }else if(userName){
        term.username = userName;
    }
    if(JSON.stringify(term) === "{}"){
        errorFn(1,'缺少用户ID或用户名')
        res.json(responseData);
        return;
    }else{
        User.findOne(term).then(function(userInfo){
            if(!userInfo){
                errorFn(7,'用户名不存在')
                res.json(responseData);
                return;
            }
            responseData.data={
                userInfo : {
                    username:userInfo.username,
                    nickname:userInfo.nickname,
                    addTime:fmtDate(userInfo.addTime),
                    collections:userInfo.collections,
                    avatar:userInfo.avatar,
                    introduction:userInfo.introduction,
                    dynamic:userInfo.dynamic
                }
            }
            res.json(responseData);
        })
    }
})
router.get('/category',function(req,res){
    Category.find({freeze:false}).sort({_id:-1}).then(function(categorys){
        if(!categorys){
            errorFn(7,'分类查询失败')
            res.json(responseData);
            return;
        }
        responseData.data={
            categorys : categorys
        }
        res.json(responseData);
    })
})
router.get('/content',function(req,res){
    var _id = req.query.id || '';
    var search = req.query.search || '';
    var term ={freeze:false};
    if(_id){
        term.category = _id
    }
    if(search){
        term.title = {$regex:new RegExp(req.query.search,'i')};
    }
    Content.countDocuments(term).then(function(count){
        if(!count){
            errorFn(7,'获取文章页码失败')
            res.json(responseData);
            return;
        }
        var pg = pageCount(req.query.page,count)
        Content.find(term).limit(pg.limit).skip(pg.skip).populate(['user','category']).sort({_id:-1}).then(function(contents){
            if(!contents){
                errorFn(7,'获取文章失败')
                res.json(responseData);
                return;
            }
            var contentList = []
            for(var i=0;i<contents.length;i++){
                var conts = {};
                conts._id = contents[i]._id;
                conts.addTime = contents[i].addTime;
                conts.category = contents[i].category.name;
                conts.user = contents[i].user.nickname;
                conts.changeTime = contents[i].changeTime;
                conts.title = contents[i].title;
                conts.description = contents[i].description;
                conts.thumbsUp = contents[i].thumbsUp;
                conts.views = contents[i].views;
                conts.collections = contents[i].collections;
                contentList.push(conts)
            }
            responseData.data={
                page:{
                    index:pg.page,
                    count:pg.count,
                    limit:pg.limit,
                    pages:pg.pages
                },
                contents:contentList
            }
            res.json(responseData);
        })
    })
})
router.get('/content/info', (req, res) => {
    var _id = req.query.id || '';
    var term ={freeze:false};
    if(_id && _id != null){
        term._id = _id
    }else{
        errorFn(1,'文章ID为空')
        res.json(responseData);
        return;
    }
    Content.findOne(term).populate(['user','category']).then(function(content){
        if(!content){
            errorFn(7,'获取文章失败')
            res.json(responseData);
            return;
        }
        var us = content.user
        content.user = {
            avatar:us.avatar,
            nickname:us.nickname,
            _id:us._id
        }
        content.comments = content.comments.length
        responseData.data = {
            content:content
        }
        res.json(responseData);
    })
});
router.get('/content/comment', (req, res) => {
    var _id = req.query.id || '';
    var page = req.query.page||1;
    var term ={freeze:false};
    if(_id && _id != null){
        term._id = _id
    }else{
        errorFn(1,'文章ID为空')
        res.json(responseData);
        return;
    }
    Content.findOne(term).then(function(content){
        if(!content){
            errorFn(7,'获取文章失败')
            res.json(responseData);
            return;
        }
        var pg = pageCount(page,content.comments.length);
        var comments = content.comments.splice((pg.page-1)*pg.limit,pg.page*pg.limit)
        responseData.data = {
            comments:comments
        };
        res.json(responseData);
    })
});
router.post('/content/comment', (req, res) => {
    var _id = req.body.id || '';
    var md5 = req.body.userCode || '';
    var commentText = req.body.content || '';
    var userInfo = "";
    var term ={freeze:false};
    if(!_id){
        errorFn(1,'文章ID不能为空')
        res.json(responseData);
        return;
    }
    if(!md5){
        errorFn(1,'用户信息不能为空')
        res.json(responseData);
        return;
    }
    if(!commentText){
        errorFn(1,'评论内容不能为空')
        res.json(responseData);
        return;
    }
    var fileData = fs.readFileSync('./vfcation.txt','utf-8', function (err){
        if (err) {
            return console.error(err);
        }
    })
    fileData = JSON.parse(fileData.toString())
    for(var i = 0;i<fileData.length;i++){
        if(fileData[i].md5 === md5){
            userInfo = fileData[i]
        }
    }
    if(!userInfo){
        errorFn(8,'登陆已经失效')
        res.json(responseData);
        return;
    }
    term._id = _id
    Content.findOne(term).then((content)=>{
        if(!content){
            errorFn(7,'获取文章失败')
            res.json(responseData);
            return Promise.reject();
        }
        content.comments.push({
            userId:userInfo._id,
            nickname:userInfo.nickname,
            avatar:userInfo.avatar,
            addTime:new Date(),
            comment:commentText
        });
        return content.save();
    }).then((newContent)=>{
        if(!newContent){
            errorFn(9,'评论失败信息失败')
            res.json(responseData);
            return
        }
        User.findOne({_id:userInfo._id}).then((userInfo)=>{
            if(!userInfo){
                errorFn(7,'获取用户信息失败')
                res.json(responseData);
                return
            }
            userInfo.dynamic.push({
                type:'comment',
                id:newContent._id,
                title:newContent.title,
                addTime:new Date(),
                text:commentText
            })
            return userInfo.save();
        }).then((userInfo)=>{
            errorFn(0,'评论成功')
            res.json(responseData);
        })
    })
});
router.post('/content/add', (req, res) => {
    var md5 = req.body.userCode || '';
    var title = req.body.title || '';
    var category = req.body.category || '';
    var description = req.body.description || '';
    var content = req.body.content || '';
    var userInfo = "";
    var term ={freeze:false};
    if(!md5){
        errorFn(1,'用户信息不能为空')
        res.json(responseData);
        return;
    }
    if(!title){
        errorFn(1,'文章标题不能为空')
        res.json(responseData);
        return;
    }
    if(!category){
        errorFn(1,'文章分类不能为空')
        res.json(responseData);
        return;
    }
    var fileData = fs.readFileSync('./vfcation.txt','utf-8', function (err){
        if (err) {
            return console.error(err);
        }
    })
    fileData = JSON.parse(fileData.toString())
    for(var i = 0;i<fileData.length;i++){
        if(fileData[i].md5 === md5){
            userInfo = fileData[i]
        }
    }
    if(!userInfo){
        errorFn(8,'登陆已经失效')
        res.json(responseData);
        return;
    }
    new Content({
        category:category,
        title:title,
        user:userInfo._id,
        description:description,
        content:content,
        addTime:new Date()
    }).save().then(function(rs){
        if(!rs){
            errorFn(9,'创建文章信息失败')
            res.json(responseData);
            return
        }
        User.findOne({_id:userInfo._id}).then((userInfo)=>{
            if(!userInfo){
                errorFn(7,'获取用户信息失败')
                res.json(responseData);
                return
            }
            userInfo.dynamic.push({
                type:'content',
                id:rs._id,
                title:rs.title,
                addTime:new Date(),
                text:rs.description
            })
            return userInfo.save();
        }).then((userInfo)=>{
            errorFn(0,'发布文章成功')
            responseData.data={
                content:rs
            }
            res.json(responseData);
        })
    })
});
router.post('/content/edit', (req, res) => {
    var _id = req.body.id || '';
    var md5 = req.body.userCode || '';
    var title = req.body.title || '';
    var category = req.body.category || '';
    var description = req.body.description || '';
    var content = req.body.content || '';
    var userInfo = "";
    var term ={freeze:false};
    if(!_id){
        errorFn(1,'文章ID不能为空')
        res.json(responseData);
        return;
    }
    if(!md5){
        errorFn(1,'用户信息不能为空')
        res.json(responseData);
        return;
    }
    if(!title){
        errorFn(1,'文章标题不能为空')
        res.json(responseData);
        return;
    }
    if(!category){
        errorFn(1,'文章分类不能为空')
        res.json(responseData);
        return;
    }
    var fileData = fs.readFileSync('./vfcation.txt','utf-8', function (err){
        if (err) {
            return console.error(err);
        }
    })
    fileData = JSON.parse(fileData.toString())
    for(var i = 0;i<fileData.length;i++){
        if(fileData[i].md5 === md5){
            userInfo = fileData[i]
        }
    }
    if(!userInfo){
        errorFn(8,'登陆已经失效')
        res.json(responseData);
        return;
    }
    term._id = _id
    Content.findOne(term).then((contents)=>{
        if(!contents){
            errorFn(7,'获取文章信息失败')
            res.json(responseData);
            return
        }
        if(contents.user.toString() !== userInfo._id.toString()){
            errorFn(10,'权限不足无法修改文章')
            res.json(responseData);
            return Promise.reject();
        }
        
        if(title){
            contents.title = title;
        }
        if(category){
            contents.category = category;
        }
        if(description){
            contents.description = description;
        }
        if(content){
            contents.content = content;
        }
        contents.changeTime = new Date();
        return contents.save();
    }).then((contents)=>{
        User.findOne({_id:userInfo._id}).then((userInfoi)=>{
            if(!userInfoi){
                errorFn(7,'获取用户信息失败')
                res.json(responseData);
                return
            }
            for(var i=0;i<userInfoi.dynamic.length;i++){
                var dynami = userInfoi.dynamic[i]
                if(contents._id == dynami.id.toString() && dynami.type == 'content'){
                    userInfoi.dynamic.remove(userInfoi.dynamic[i])
                }
            }
            userInfoi.dynamic.push({
                type:'content',
                id:contents._id,
                title:contents.title,
                addTime:new Date(),
                text:contents.description
            })
            return userInfoi.save();
        }).then((user)=>{
            errorFn(0,'修改成功')
            responseData.data={
                content:contents
            }
            res.json(responseData);
        })
    })
});
module.exports = router;