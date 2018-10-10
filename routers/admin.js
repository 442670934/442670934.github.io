var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Label = require('../models/Label');
var Content = require('../models/Content');
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
router.use(function(req, res, next) {
    // console.log(req.userInfo)
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});
router.get('/user', function(req, res, next) {
    var term ={};
    if(req.query.username){
        term.username = req.query.username
    }
    if(req.query.email){
        term.email = req.query.email
    }
    User.countDocuments(term).then(function(count){
        var pg = pageCount(req.query.page,count)
        User.find(term).limit(pg.limit).skip(pg.skip).sort({_id:-1}).then(function(users){
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                router:'/admin/user',
                users:users,
                page:pg.page,
                count:pg.count,
                limit:pg.limit,
                pages:pg.pages
            });
        })
    })
});
router.post('/user/edit',function(req,res,next){
    var _id = req.body.id || '';
    var username = req.body.username || '';
    var nickname = req.body.nickname || '';
    var email = req.body.email || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取用户ID失败'
        })
        return;
    }
    if(!username){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'用户名不能为空'
        })
        return;
    }
    User.findOne({username:username}).nor({_id:_id}).then(function(userInfo){
        if(userInfo){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户名已被占用'
            })
            return Promise.reject();
        }
        return User.update({_id:_id},{
            username:username,
            nickname:nickname,
            email:email
        })
    }).then(function(userInfo){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/user'
        })
    })
})
router.post('/user/freeze',function(req,res,next){
    var _id = req.body.freezeUserId || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取用户ID失败'
        })
        return;
    }
    User.findOne({_id:_id}).then(function(userInfo){
        if(!userInfo){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户不存在'
            })
            return Promise.reject();;
        }else{
            console.log(userInfo)
            freeze = false;
            if(userInfo.freeze){
                freeze = false;
            }else{
                freeze = true;
            }
            return User.update({
                _id:_id
            },{
                freeze:Boolean(freeze)
            })
        }
    }).then(function(userInfo){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/user'
        })
    })
})
router.get('/category', function(req, res, next) {
    var term ={};
    if(req.query.category){
        term.name = {$regex:new RegExp(req.query.category,'i')};
    }
    function categoryNext(){
        Category.countDocuments(term).then(function(count){
            var pg = pageCount(req.query.page,count)
            Category.find(term).limit(pg.limit).skip(pg.skip).sort({_id:-1}).populate('createrUser').then(function(categorys){
                res.render('admin/category_index', {
                    userInfo: req.userInfo,
                    router:'/admin/category',
                    categorys:categorys,
                    page:pg.page,
                    count:pg.count,
                    limit:pg.limit,
                    pages:pg.pages
                });
            })
        })
    }
    if(req.query.username){
        User.findOne({username:req.query.username}).then(function(userInfo){
            if(userInfo){
                term.createrUser = userInfo._id
            }
            categoryNext()
        })
    }else{
        categoryNext()
    }

});
router.post('/category/add',function(req,res,next){
    var name = req.body.name || '';
    if(!name){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空'
        })
        return;
    }
    Category.find({name:name}).then(function(category){
        if(category.length){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已存在'
            })
            return Promise.reject();
        }else{
            return new Category({
                name:name,
                createrUser:req.userInfo._id.toString()
            }).save();
        }
    }).then(function(category){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类创建成功',
            url:'/admin/category'
        })
    })
})
router.post('/category/edit',function(req,res,next){
    var _id = req.body.id || '';
    var name = req.body.name || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取分类ID失败'
        })
        return;
    }
    if(!name){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名不能为空'
        })
        return;
    }
    Category.findOne({name:name}).nor({_id:_id}).then(function(category){
        if(category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名已被占用'
            })
            return Promise.reject();
        }
        return Category.update({_id:_id},{
            name:name,
        })
    }).then(function(category){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })
})
router.post('/category/freeze',function(req,res,next){
    var _id = req.body.freezeId || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取分类ID失败'
        })
        return;
    }
    Category.findOne({_id:_id}).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类不存在'
            })
            return Promise.reject();;
        }else{
            freeze = false;
            if(category.freeze){
                freeze = false;
            }else{
                freeze = true;
            }
            return Category.update({
                _id:_id
            },{
                freeze:Boolean(freeze)
            })
        }
    }).then(function(category){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })
})
router.get('/label', function(req, res, next) {
    var term ={};
    if(req.query.label){
        term.name = {$regex:new RegExp(req.query.label,'i')};
    }
    function labelNext(){
        Label.countDocuments(term).then(function(count){
            var pg = pageCount(req.query.page,count)
            Label.find(term).limit(pg.limit).skip(pg.skip).sort({_id:-1}).populate('createrUser').then(function(labels){
                res.render('admin/label_index', {
                    userInfo: req.userInfo,
                    router:'/admin/label',
                    labels:labels,
                    page:pg.page,
                    count:pg.count,
                    limit:pg.limit,
                    pages:pg.pages
                });
            })
        })
    }
    if(req.query.username){
        User.findOne({username:req.query.username}).then(function(userInfo){
            if(userInfo){
                term.createrUser = userInfo._id
            }
            labelNext();
        })
    }else{
        labelNext();
    }
});
router.post('/label/add',function(req,res,next){
    var name = req.body.name || '';
    if(!name){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标签名称不能为空'
        })
        return;
    }
    Label.find({name:name}).then(function(labels){
        if(labels.length){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'标签已存在'
            })
            return Promise.reject();
        }else{
            return new Label({
                name:name,
                createrUser:req.userInfo._id.toString()
            }).save();
        }
    }).then(function(label){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'标签创建成功',
            url:'/admin/label'
        })
    })
})
router.post('/label/edit',function(req,res,next){
    var _id = req.body.id || '';
    var name = req.body.name || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取分类ID失败'
        })
        return;
    }
    if(!name){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名不能为空'
        })
        return;
    }
    Label.findOne({name:name}).nor({_id:_id}).then(function(labels){
        if(labels){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名已被占用'
            })
            return Promise.reject();
        }
        return Label.update({_id:_id},{
            name:name,
        })
    }).then(function(label){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/label'
        })
    })
})
router.post('/label/freeze',function(req,res,next){
    var _id = req.body.freezeId || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取分类ID失败'
        })
        return;
    }
    Label.findOne({_id:_id}).then(function(labels){
        if(!labels){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类不存在'
            })
            return Promise.reject();;
        }else{
            freeze = false;
            if(labels.freeze){
                freeze = false;
            }else{
                freeze = true;
            }
            return Label.update({
                _id:_id
            },{
                freeze:Boolean(freeze)
            })
        }
    }).then(function(labels){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/label'
        })
    })
})
router.get('/content', (req, res) => {
    var username = req.query.username || '';
    var label = req.query.label || '';
    var category = req.query.category || '';
    var term ={};
    if(label){
        term.label = label;
    }
    if(category){
        term.category = category;
    }
    function contentNext(){
        Category.find().then((categorys)=>{
            Label.find().then((labels)=>{
                Content.countDocuments(term).then((count)=>{
                    var pg = pageCount(req.query.page,count)
                    Content.find(term).limit(pg.limit).skip(pg.skip).sort({_id:-1}).populate(['user','category']).then((contents)=>{
                        res.render('admin/content_index', {
                            userInfo: req.userInfo,
                            router:'/admin/content',
                            contents:contents,
                            labels:labels,
                            categorys:categorys,
                            page:pg.page,
                            count:pg.count,
                            limit:pg.limit,
                            pages:pg.pages
                        });
                    })
                })
            })
        })
    }
    if(req.query.username){
        User.findOne({username:req.query.username}).then(function(userInfo){
            if(userInfo){
                term.user = userInfo._id
            }
            contentNext();
        })
    }else{
        contentNext();
    }
});
router.get('/content/add', (req, res) => {
    Category.find().sort({_id:-1}).then((categorys)=>{
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            router:'/admin/content/add',
            categorys:categorys,
        });
    })
});
router.post('/content/add', (req, res) => {
    var category = req.body.category || '';
    var title = req.body.title || '';
    var description = req.body.description || '';
    var content = req.body.content || '';
    if(!category){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取分类ID失败'
        })
        return;
    }
    if(!title){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章标题不能为空'
        })
        return;
    }
    if(!description){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章简介不能为空'
        })
        return;
    }
    if(!content){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章内容不能为空'
        })
        return;
    }
    new Content({
        category:category,
        title:title,
        user:req.userInfo._id.toString(),
        description:description,
        content:content,
        addTime:new Date()
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章新建成功',
            url:'/admin/content'
        })
    })
});
router.get('/content/edit',function(req,res){
    var id = req.query.id || '';
    var categorys = [];
    Category.find().sort({_id:-1}).then(function(category){
        categorys = category;
        return Content.findOne({_id:id}).populate(['user','category']).then(function(content){
            if(!content){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'文章不存在'
                })
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    categorys:categorys,
                    router:'/admin/content',
                    content:content
                })
            }
        })
    })
})
router.post('/content/edit',function(req,res){
    var id = req.body.id || '';
    var category = req.body.category || '';
    var title = req.body.title || '';
    var description = req.body.description || '';
    var content = req.body.content || '';
    if(!id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取文章ID失败',
        })
        return
    }
    if(!category){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章分类不能为空',
        })
        return
    }
    if(!title){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章标题不能为空',
        })
        return
    }
    if(!description){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章简介不能为空',
        })
        return
    }
    if(!content){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章内容不能为空',
        })
        return
    }
    Content.update({_id:id},{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        changeTime:new Date()
    }).then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章修改成功',
            url:'/admin/content/edit?id='+id
        })
    })
})
router.post('/content/freeze',function(req,res,next){
    var _id = req.body.freezeId || '';
    if(!_id){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'获取文章ID失败'
        })
        return;
    }
    Content.findOne({_id:_id}).then(function(content){
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'文章不存在'
            })
            return Promise.reject();;
        }else{
            freeze = false;
            if(content.freeze){
                freeze = false;
            }else{
                freeze = true;
            }
            return Content.update({
                _id:_id
            },{
                freeze:Boolean(freeze)
            })
        }
    }).then(function(content){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/content'
        })
    })
})
module.exports = router;