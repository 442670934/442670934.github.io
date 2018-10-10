var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({

    //分类名称
    name: String,
    //分类创建人
    createrUser:{
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //冻结
    freeze:{
        type:Boolean,
        default:false
    },
    //分类创建时间
    time:{
        type:Date,
        default:new Date()
    }

});