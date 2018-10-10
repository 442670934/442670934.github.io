
(function(){
	var categorys = '';
    if(localStorage.categories){
        categorys = localStorage.categories;
        categorys = JSON.parse(categorys);
    }
    var navTab = $('#nav-tab')
    var navItem = navTab.find('a').clone().eq(0);
    var tabContent = $('#nav-tabContent');
    var tabPane = tabContent.find('.tab-pane').eq(0).clone();
    var tabMedia = tabContent.find('.media').eq(0).clone();
    tabContent.find('.media').eq(0).remove();
    var nowTime = Math.abs((new Date()).getTime()-categorys.time)
    categorys = categorys.categorys
    //获取文章列表
	function getContentClass(theDom,page){
		$(theDom).attr('first',false)
		var name = $(theDom).attr('href') || "";
		var id = $(theDom).attr('_id') || "";
		var url = urls+"api/content";
		var search = GetQueryString('s') || '';
		var data = {}
		if(id && id!='all'){
			data.id = id;
		}
		if(page != undefined && page != ""){
			data.page =page
		}
		if(search != undefined && search != ""){
			data.search = search
			$('.input-group.search .form-control').val(search)
		}
		
		$.ajax({
			type:"get",
			url:url,
			data:data
		}).then(function(d){
			var contents = d.data.contents;
			var page = d.data.page;
			$(name).find('.media-box').html("")
			for (var i=0;i<contents.length;i++) {
				var mediaDom = tabMedia.clone();
				domIndex = (page.index-1)*page.limit+i+1
				mediaDom.attr('_id',contents[i]._id);
				mediaDom.find('.media-index').text(domIndex);
				mediaDom.find('h4').text(contents[i].title);
				mediaDom.find('p').text(contents[i].description);
				mediaDom.find('.body-author').text(contents[i].user);
				mediaDom.find('.body-time').text(formatMsgTime(contents[i].addTime));
				$(name).find('.media-box').append(mediaDom)
			}
			$(name).find('.media').on('click',function(){
				location.href = '/main/content?id='+$(this).attr('_id')
			})
			//渲染页码
			var pageList;
			pageList = $(name).find('.pagination');
			var firstp = pageList.find('.page-item').eq(0).clone();
			var pagep = pageList.find('.page-item').eq(0).clone().removeClass('disabled');
			var lastp = pageList.find('.page-item').eq(pageList.children().length-1).clone();
			pageList.html("");
			firstp.attr('page',page.index-1)
			lastp.attr('page',page.index+1)
			if(page.index<=1){
				firstp.addClass('disabled')
			}else{
				firstp.removeClass('disabled')
			}
			if(page.index>=page.pages){
				lastp.addClass('disabled')
			}else{
				lastp.removeClass('disabled')
			}
			pageList.append(firstp)
			for (var i=0;i<page.pages;i++) {
				var pageDom = pagep.clone();
				pageDom.attr('page',i+1)
				pageDom.find('a').text(i+1)
				pageList.append(pageDom)
			}
			pageList.append(lastp)
			pageList.find('.page-item').eq(page.index).addClass('active disabled')
			//页码点击事件
			pageList.find('.page-item').on('click',function(){
				if($(this).hasClass('disabled')){
					return
				}
				getContentClass($(theDom),$(this).attr('page'))
			})
		});
	}
	//获取分类列表
	function getClassList(){
		for (var i = 0;i<categorys.length;i++) {
			var category = categorys[i]
			var navDom = navItem.clone()
			navDom.attr({"href":'#nav-'+category.name,"_id":category._id,'first':true}).text(category.name)
			navTab.append(navDom)
			var tabDom = tabPane.clone()
			tabDom.attr({id:'nav-'+category.name})
			tabContent.append(tabDom)
		}
		navTab.find('a').click(function(e){
			e.preventDefault()
			$(this).tab('show')
			if($(this).attr('first') == 'true'){
				getContentClass($(this),1)
			}
		})
		navTab.find('a').eq(0).addClass('active')
		tabContent.find('.tab-pane').eq(0).addClass('show active')
	}
    if(categorys && nowTime<60000){
    	getClassList()
    }else{
    	$.ajax({
    		type:"get",
    		url:urls+"api/category"
    	}).then(function(d){
    		if(d.code !== 0){
    			if(!categorys){
    				errorAnima(d.message)
    			}else{
    				errorAnima('更新分类失败')
    			}
    		}
    		categorys = d.data.categorys
    		getClassList()
    		var categories = {
    			time:(new Date()).getTime(),
    			categorys:categorys
    		}
    		localStorage.categories = JSON.stringify(categories)
    	});
    }
	getContentClass($('#nav-tab a').eq(0),1);
})()