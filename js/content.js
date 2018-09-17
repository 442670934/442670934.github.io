(function(){
    $.fn.markdown.messages.zh = {
    	'Bold': "粗体",
    	'Italic': "斜体",
    	'Heading': "标题",
    	'URL/Link': "链接",
    	'Image': "图片",
    	'List': "列表",
    	'Unordered List': "无序列表",
    	'Ordered List': "有序列表",
    	'Code': "代码",
    	'Quote': "引用",
    	'Preview': "预览",
    	'strong text': "粗体",
    	'emphasized text': "强调",
    	'heading text': "标题",
    	'enter link description here': "输入链接说明",
    	'Insert Hyperlink': "URL地址",
    	'enter image description here': "输入图片说明",
    	'Insert Image Hyperlink': "图片URL地址",
    	'enter image title here': "在这里输入图片标题",
    	'list text here': "这里是列表文本",
    	'code text here': "这里输入代码",
    	'quote here': "这里输入引用文本"
    };
	var contentId = GetQueryString('id') || undefined
	var userInfo = '';
	var commentPage = 1;
    if(localStorage.userInfo){
        userInfo = localStorage.userInfo;
        userInfo = JSON.parse(userInfo);
        if(userInfo.avatar){
            userAvatar.setAttribute("src",userInfo.avatar)
        }
    }
    if(!userInfo){
    	$('.comment-list .is-loding').remove()
    }else{
    	$('.comment-list .not-loding').remove()
//  	$('.comment-list .is-loding .comment-text').markdown({
//			autofocus: true,
//			savable: false,
//			language: 'zh',
//			fullscreen: false,
//			iconlibrary:'fa'
//		})
    }
    $.ajax({
    	type:"get",
    	url:urls+"api/content/info?id="+contentId
    }).then(function(d){
    	if(d.code !== 0){
    		errorAnima(d.message)
    		return
    	}
    	var contInfo = d.data.content;
    	var user = contInfo.user;
    	var mediaUser = $('.content .media');
    	var contentBox = $('.content .content-body');
    	mediaUser.find('.user-name').text(user.nickname)
    	mediaUser.find('.addTime').text(formatMsgTime(contInfo.addTime))
    	mediaUser.find('.comment-num').text(contInfo.comments+'条评论')
    	contentBox.find('.content-title').text(contInfo.title)
    	contentBox.find('.content-main').html(markdown.toHTML(contInfo.content))
    	var taglist = contentBox.find('.tag-list');
    	taglist.append('<span>'+contInfo.category.name+'</span>')
    	//此处待标签完善
    });
    $.ajax({
    	type:"get",
    	url:urls+"api/content/comment?id="+contentId+'&page='+commentPage
    }).then(function(d){
    	var comments = d.data.comments
    	if(comments.length<=0){
    		return
    	}
    	var commentList = $('.content .comment-list')
    	var commentItem = commentList.find('.comment-item.hide').clone().removeClass('hide');
    	commentList.find('.comment-item.hide').remove();
    	for (var i=0;i<comments.length;i++) {
    		var commen = comments[i];
    		var commenDom = commentItem.clone();
    		//头像待完善
    		commenDom.find('.user-name').text(commen.nickname);
    		commenDom.find('.date').text(formatMsgTime(commen.addTime))
    		commenDom.find('.comment-text').text(commen.comment)
//  		commenDom.find('.comment-text').html(markdown.toHTML(commen.comment))
    		commentList.children('div').eq(0).after(commenDom)
    	}
    });
    $('.submit-btn').on('click',function(){
    	var commentText = $('.is-loding .comment-text').val();
    	if(!commentText){
    		errorAnima('评论不能为空')
    		return
    	}
    	$.ajax({
    		type:"post",
    		url:urls+"api/content/comment",
    		data:{
    			id:contentId,
    			userCode:userInfo.md5,
    			content:commentText
    		}
    	}).then(function(d){
    		console.log(d)
    		if(d.code != 0){
    			errorAnima(d.message)
    			return
    		}
    		var commentList = $('.content .comment-list')
	    	var commentItem = commentList.find('.comment-item').eq(0).clone().removeClass('hide');
	    	commentItem.find('.user-name').text(userInfo.nickname);
			commentItem.find('.date').text('刚刚')
			commentItem.find('.comment-text').text(commentText)
			commentList.children('div').eq(0).after(commentItem)
			$('.is-loding .comment-text').val("")
    	});
    })
})()
