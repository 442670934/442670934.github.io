var mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({
    //内容标题
    title: String,

    //关联字段 - 内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //关联字段 - 用户id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    
    //简介
    description: {
        type: String,
        default: ''
    },
    
    //内容
    content: {
        type: String,
        default: ''
    },
    
    //评论
    comments: {
        type: Array,
        default: []
    },
    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //收藏量
    collections:{
        type: Number,
        default: 0
    },
    //赞数量
    thumbsUp:{
        type: Number,
        default: 0
    },
    //冻结
    freeze:{
        type:Boolean,
        default:false
    },
    //关联字段 - 标签id
    label: [{
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Label'
    }],
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //修改时间
    changeTime: {
        type: Date,
        default: new Date()
    }

},{usePushEach: true});
//usePushEach解决数据库push一个新建的对象，之后保存，就会报错