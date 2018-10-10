(function(){
	var userInfo = '';
    if(localStorage.userInfo){
        userInfo = localStorage.userInfo;
        userInfo = JSON.parse(userInfo);
    }
	var userId = GetQueryString('username') || undefined
	if(!userId){
		history.go(-1)
	}
	$.ajax({
		type:"get",
		url:urls+"api/user/info?username="+userId
	}).then(function(d){
		console.log(d)
		if(d.code != 0){
			errorAnima(d.message)
		}
		var dUserInfo = d.data.userInfo;
		var userBox = $('.card-header');
		var dynamicBox = $('.dynamic-list');
		userBox.find('.user-name').text(dUserInfo.nickname)
		userBox.find('.time').text(dUserInfo.addTime)
		userBox.find('.introduction').text('简介:'+dUserInfo.introduction)
		if(dUserInfo.avatar){
			userBox.find('img').attr('src',dUserInfo.avatar)
		}
		for (var i=dUserInfo.dynamic.length-1;i>=0;i--){
			var dynamic = dUserInfo.dynamic[i]
			var dynamicDom = dynamicBox.find('.card.hide').clone().removeClass('hide')
			dynamicDom.find('.alert-info a').text(dynamic.title).attr('href','content?id='+dynamic.id)
			dynamicDom.find('.alert-info i').text(formatMsgTime(dynamic.addTime))
			dynamicDom.find('.card-body').text(dynamic.text)
			dynamicDom.attr('id',dynamic.id)
			if(dynamic.type == "content" && userInfo.username === userId){
				dynamicDom.append('<i class="btn btn-info">修改</i>')
			}
			dynamicBox.append(dynamicDom)
			
		}
		dynamicBox.find('i.btn.btn-info').on('click',function(){
			location.href = '/main/editor?id='+$(this).parent().attr('id')
		})
		$('.dynamic-list .card.hide').remove();
	});
})()
