var s=document.body.clientWidth;
window.onresize=function(){
//	获取浏览器当前宽度,根据宽度选择
	s=document.body.clientWidth;
	if(s<768){
		$("#carousel-example-generic")[0].className+=" container";
	}else{
		$("#carousel-example-generic")[0].className="carousel slide";
	}
	if(s<992){
		$(".page>div")[0].className="home"
	}
	if(s<450){
		$(".tcol ul").addClass("smul");
		$(".tcolBody li").addClass("smli");
	}else{
		$(".tcol ul").removeClass("smul");
		$(".tcolBody li").removeClass();
	}
}
	if(s<768){
		$("#carousel-example-generic")[0].className+=" container";
	}
	if(s<992){
		$(".page>div")[0].className="home"
	}
	if(s<450){
		$(".tcol ul").addClass("smul");
		$(".tcolBody li").addClass("smli");
	}
	var img= $(".carousel-inner>div").length;
//	动态创建小圆点
	for (i=0;i<img;i++) {
		$("<li data-target='#carousel-example-generic' data-slide-to="+i+"></li>").appendTo("#carousel-example-generic .carousel-indicators");
	}
	$("#carousel-example-generic .carousel-indicators li")[0].className="active";
	var lun=0;
	var spotlight=$(".spotlight img").length;
//	右边简单左右轮播
	$(".newsleft").click(function(){
		$(".cend img")[lun].className=" ";
		if(lun<spotlight){
			if(lun==0){
				lun=spotlight-1;
			}else if(lun>0&&lun<spotlight){
				lun--;
			}
		}
		$(".cend img")[lun].className="light";
	})	
	$(".newsright").click(function(){
		$(".cend img")[lun].className=" ";
			 if(lun<spotlight-1){
				lun++;
			}
		    else{
				lun=0;
			}
		$(".cend img")[lun].className="light";
	})	
//	移动端轮播事件触发
    var lunbo=$("#carousel-example-generic");
	var startX;
	var endX;
	var lindex;
	lunbo.on("touchstart",function(){
		startX=event.changedTouches[0].clientX;
	}).on("touchend",function(){
		endX=event.changedTouches[0].clientX;
		sun=startX-endX;
		var kuan=$("#carousel-example-generic")[0].clientWidth/4;
		if(sun<-kuan){
			$(".left").click();
		}else if(sun>kuan){
			$(".right").click();
		}
	});
//	动态生成商品信息
	$.ajax({
		type:"get",
		url:"js/ajax.json",
		datatype:"json",
		success:function(data){
			$(".tcolBody").html("");
			for (i=0;i<10;i++) {
				var name=data.dateid[i].name;
				var money=data.dateid[i].money;
				var clas=data.dateid[i].clas;
				var icon=data.dateid[i].icon;
				var strs=" ";
				var tags=" ";
				for(a=0;a<icon.length;a++){
					var str="<img src='images/icon-"+icon[a]+".png'/>";
					strs=strs+str
				}
				for(a=0;a<clas.length;a++){
					var tag="<span>"+clas[a]+"</span>";
					tags=tags+tag
				}
				var img="<img src='images/data/"+name+"/head.jpg'/>";
				var h3="<h3>"+name+"</h3>";
				var h4="<h4>"+strs+"</h4>";
				var h5="<h5>"+tags+"</h5>";
				var h6="<h6><b>￥</b>"+money+"</h6>";
				$("<li>"+img+h6+"<div class='txt'>"+h3+h4+h5+"</div></li>").appendTo(".tcolBody");
			}
		if(s<450){
		$(".tcol ul").addClass("smul");
		$(".tcolBody li").addClass("smli");
	}
		}
	});
//	点击热门,热销,推荐显示相应商品信息
$(".tcolNav li").click(function(){
	$(".tcolNav li").removeClass("fouch");
	$(this).addClass("fouch");
	var index=$(this).index();
	$.ajax({
		type:"get",
		url:"js/ajax.json",
		datatype:"json",
		success:function(data){
			$(".tcolBody").html("");
			for (i=index*10;i<index*10+10;i++) {
				var name=data.dateid[i].name;
				var money=data.dateid[i].money;
				var clas=data.dateid[i].clas;
				var icon=data.dateid[i].icon;
				var strs=" ";
				var tags=" ";
				for(a=0;a<icon.length;a++){
					var str="<img src='images/icon-"+icon[a]+".png'/>";
					strs=strs+str
				}
				for(a=0;a<clas.length;a++){
					var tag="<span>"+clas[a]+"</span>";
					tags=tags+tag
				}
				var img="<img src='images/data/"+name+"/head.jpg'/>";
				var h3="<h3>"+name+"</h3>";
				var h4="<h4>"+strs+"</h4>";
				var h5="<h5>"+tags+"</h5>";
				var h6="<h6><b>￥</b>"+money+"</h6>";
				$("<li>"+img+h6+"<div class='txt'>"+h3+h4+h5+"</div></li>").appendTo(".tcolBody");
			}
		if(s<450){
		$(".tcol ul").addClass("smul");
		$(".tcolBody li").addClass("smli");
	}
		}
	});
});
//“新品”随机生成3个
		$.ajax({
		type:"get",
		url:"js/ajax.json",
		datatype:"json",
		success:function(data){
			var p= $(".page div ul li");
			for (i=0;i<p.length-1;i++) {
				var pindex=p.eq(i);
				$(pindex).html("");
			var dataid=data.dateid;
			var num = parseInt(10*Math.random());
			var headname=data.dateid[num+(i*10)].name;
			var headmoney=data.dateid[num+(i*10)].money;
			var headimg="<img src='images/data/"+headname+"/head.jpg'/>";
			var headp="<p class='game_n'>"+headname+"</p>";
			var headp2="<p class='game_m'><b>￥</b>"+headmoney+"</p>";
			$(headimg+headp+headp2).appendTo(pindex);
			}
			$(".tcolBody").html("");
			for (i=0;i<10;i++) {
				var name=data.dateid[i].name;
				var money=data.dateid[i].money;
				var clas=data.dateid[i].clas;
				var icon=data.dateid[i].icon;
				var strs=" ";
				var tags=" ";
				for(a=0;a<icon.length;a++){
					var str="<img src='images/icon-"+icon[a]+".png'/>";
					strs=strs+str
				}
				for(a=0;a<clas.length;a++){
					var tag="<span>"+clas[a]+"</span>";
					tags=tags+tag
				}
				var img="<img src='images/data/"+name+"/head.jpg'/>";
				var h3="<h3>"+name+"</h3>";
				var h4="<h4>"+strs+"</h4>";
				var h5="<h5>"+tags+"</h5>";
				var h6="<h6><b>￥</b>"+money+"</h6>";
				$("<li>"+img+h6+"<div class='txt'>"+h3+h4+h5+"</div></li>").appendTo(".tcolBody");
			}
		if(s<450){
		$(".tcol ul").addClass("smul");
		$(".tcolBody li").addClass("smli");
	}
//		点击商品跳转到详细页面
				    $(".tcolBody li").on("click",function(){
			        var h3=$(this).children(".txt").children("h3").html();
			        $.ajax({
				        type:"get",
				        url:"js/ajax.json",
				        datatype:"json",
				        success:function(data){
				        	for (i=0;i<data.dateid.length;i++) {
						        var name=data.dateid[i].name;
						        if(h3==name){
						     	var json=JSON.stringify(data.dateid[i]);
						     	window.localStorage.setItem("store",json);
						     	window.location.href="stort.html";
						}
							
					}
				}
			});
			});
		}
	});
//	点击轮播图跳转到详细页面
$(".carousel-inner .item").click(function(){
	var index=$(this).index();
	if(index==0){
		index="The Witcher 3 Wild Hunt";
	}else if(index==1){
		index="NBA 2K17";
	}else if(index==2){
		index="Battlerite";
	}else if(index==3){
		index="Mafia III";
	}else if(index==4){
		index="Sid Meier’s Civilization VI";
	}
	 $.ajax({
		type:"get",
		url:"js/ajax.json",
		datatype:"json",
		success:function(data){
			for (i=0;i<data.dateid.length;i++) {
				var name=data.dateid[i].name;
				if(index==name){
				var json=JSON.stringify(data.dateid[i]);
				window.localStorage.setItem("store",json);
				window.location.href="stort.html";
				}
							
			}
		}
	});
})
//“新品”栏点击进行跳转
$(document).ready(function(){
	$(".page ul li").click(function(){
		if($(this)[0]==$(".page ul li").eq(3)[0]){
			window.location.href="search.html";
		}else{
			var h3=$(this).children(".game_n").html();
			$.ajax({
				type:"get",
				url:"js/ajax.json",
				datatype:"json",
				success:function(data){
				    for (i=0;i<data.dateid.length;i++) {
						var name=data.dateid[i].name;
						if(h3==name){
						    var json=JSON.stringify(data.dateid[i]);
						    window.localStorage.setItem("store",json);
						    window.location.href="stort.html";
						}	
					}
				}
			});
		}
	})
})
//“新品”栏浏览所有按钮跳转
$(".jinxuan").on("click",function(){
	window.localStorage.removeItem("sousuo")
	window.location.href="search.html";
})
//清除搜索缓存
window.localStorage.removeItem("sousuo");
