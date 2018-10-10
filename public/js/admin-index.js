(function (){
    //菜单栏相关
    $('.navbar-nav .nav-item>a').on('click',function(){
        $(this).parent().addClass('item-active').siblings('.nav-item').removeClass('item-active').siblings('.item-list').find('.item-active').removeClass('item-active')
    })
    //二级菜单
    $('.item-active.item-list li').on('click',function(){
        $(this).addClass('item-active').siblings('.item-active').removeClass('item-active')
    })
    //获取url参数部分
    var url = location.toString()
    function GetUrlPara(){
        var arrUrl = url.split('?')
        var para = arrUrl[1];
        return para
    }
    //获取指定参数
    function GetUrlParam(paraName) {
        var arrObj = url.split("?");

        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;
            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        }else {
            return "";
        }
    }
    //替换指定参数的值
    function changeURLArg(arg,arg_val){
        var pattern=arg+'=([^&]*)';
        var replaceText=arg+'='+arg_val; 
        if(url.match(pattern)){
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        }else{ 
        if(url.match('[\?]')){ 
                return url+'&'+replaceText; 
            }else{ 
                return url+'?'+replaceText; 
            } 
        }
    }
    if(!GetUrlPara()){
        $('.previous a').attr('href',url+'?page='+window.page-1)
        $('.next a').attr('href',url+'?page='+window.page+1)
    }else if(!GetUrlParam('page')){
        $('.previous a').attr('href',url+'&page='+window.page-1)
        $('.next a').attr('href',url+'&page='+window.page+1)
    }else{
        $('.previous a').attr('href',changeURLArg('page',window.page-1))
        $('.next a').attr('href',changeURLArg('page',window.page+1))
    }
    $('.previous.disabled a').removeAttr('href');
    $('.next.disabled a').removeAttr('href')
})()