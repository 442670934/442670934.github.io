var urls = 'http://www.wujianhua.xyz/'
//var urls = 'http://127.0.0.1:8081/'
var errorStatus = false;
formatMsgTime =function(timespan) {
	timespan = (new Date(timespan)).getTime();
	var dateTime = new Date(timespan);
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth() + 1;
	var day = dateTime.getDate();
	var hour = dateTime.getHours();
	var minute = dateTime.getMinutes();
	var second = dateTime.getSeconds();
	var now = new Date().getTime();
	var milliseconds = 0;
	var timeSpanStr;
	milliseconds =now - timespan;
	if(milliseconds <= 1000 * 60 * 1) {
		timeSpanStr = '刚刚';
	} else if(1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
		timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
	} else if(1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
		timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
	} else if(1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
		timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
	} else if(milliseconds > 1000 * 60 * 60 * 24 * 15 && year == new Date().getFullYear()) {
		timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
	} else {
		timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
	}
	return timeSpanStr;
};
(function(){
	window.GetQueryString = function(name){
	    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
	    if(r!=null)return  unescape(r[2]); return null;
	}
    window.errorAnima = function(text){
        if(!text){
            return
        }
        var errBox = document.querySelector('.error-box');
        errBox.children[0].innerHTML = text;
        errorStatus = !errorStatus;
        errBox.className = 'error-box show';
        var errorTime=window.setTimeout(function(){
            window.clearInterval(errorTime);
            errBox.className = 'error-box';
        },3000);
    } 
    var initUser = function(){
        var userAvatar = document.querySelector('.user-avatar')
        var userInfoBox = document.querySelector('.nav-item.user-info')
        var buttonItem = document.querySelectorAll('.nav-item.button-item')
        var userInfo = '';
        if(localStorage.userInfo){
            userInfo = localStorage.userInfo;
            userInfo = JSON.parse(userInfo);
            if(userInfo.avatar){
                userAvatar.setAttribute("src",userInfo.avatar)
            }
        }
        if(!userInfo){
            userInfoBox.parentNode.removeChild(userInfoBox)
            return
        }else{
        	$.ajax({
				type:"get",
				url:urls+"api/user/info?id="+userInfo._id,
				success:function(d){
					if(d.code !== 0){
						errorAnima('登陆失效')
						localStorage.removeItem('userInfo')
						setTimeout(function(){
							location.reload()
						},2000)
					}
				}
			});
			$(userInfoBox).find(".editor").attr('href','./editor.html')
			$(userInfoBox).find('.user-index').attr('href','./user.html?username='+userInfo.username)
            buttonItem[0].parentNode.removeChild(buttonItem[0])
            buttonItem[1].parentNode.removeChild(buttonItem[1])
        }
        $(userInfoBox).find('.user-avatar').on('click',function(){
            var operating = $('.user-operating');
            if(operating.hasClass('show')){
                operating.removeClass('show');
            }else{
                operating.addClass('show');
            }
        })
        //logo
        $('.navbar-nav .logo').attr('href','http://'+location.host)
        $('.navbar-nav .text-item .nav-link').attr('href','http://'+location.host)
        //退出登录
        $('.user-operating .login-out').on('click',function(){
        	$.ajax({
        	    type:'get',
        	    url:urls+'api/user/logout',
        	    success:function(data){
        	    	console.log(data)
        	    }
        	}).then(function(data){
        	    if(data.code != 0){
        	        errorAnima(data.message)
        	        return
        	    }
        	    localStorage.removeItem('userInfo')
        	    location.href = 'http://'+location.host
        	});
        })
    }
    initUser();
})()
