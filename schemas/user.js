var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username:String,
    nickname:String,
    email:String,
    md5:String,
    //创建时间
    addTime: {
        type: Date,
        default:new Date()
    },
    //头像
    avatar:{
        type:String,
        default:''
    },
    //是否管理员
    isAdmin:{
        type:Boolean,
        default:false
    },
    //冻结
    freeze:{
        type:Boolean,
        default:false
    },
    //收藏
    collections:{
        type:Array,
        default:[]
    },
    //用户简介
    introduction:{
        type:String,
        default:''
    },
    //动态
    dynamic:{
        type:Array,
        default:[]
    }
},{usePushEach: true});