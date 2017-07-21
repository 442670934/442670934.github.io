//页面导航部分JS和网站通用和数据初始化
var hi= $("#bs-example-navbar-collapse-1")[0].offsetHeight+30;
$("#xianav").css("margin-top",hi)
var cart=JSON.parse(window.localStorage.getItem("cart"));
if(cart==null||cart==undefined){
	window.localStorage.setItem("cart","[]");
}
var cart=JSON.parse(window.localStorage.getItem("sousuo"));
if(cart==null||cart==undefined||cart==" "){
	window.localStorage.setItem("sousuo","[]");
}
var user="user:admin";
var json={"user":"admin","pass":"admin","head":"0",havegame:[]};
window.localStorage.setItem(user,JSON.stringify(json));
var loding=JSON.parse(window.localStorage.getItem("loding"));
if(loding==null||loding.user=="null"){
	var json={"user":"null"};
	var json = JSON.stringify(json);
	window.localStorage.setItem("loding",json);
	$(".zhuxiao").css("display","none");
	$(".user").click(function(){
		location.href="loding.html"
	})
}else{
	$(".user a img")[0].src="images/userhead/head"+json.head+".png"
	$(".user a span")[0].innerHTML=json.user;
	}
$(".zhuxiao").click(function(){
	window.localStorage.removeItem("loding");
	location.reload()
})
var cart=JSON.parse(window.localStorage.getItem("cart"));
if(cart.length>0){
	$(".cart")[0].innerHTML=cart.length;
	$(".cart")[1].innerHTML=cart.length;
}else{
	$(".cart").eq(1).parent().css("display","none");
}
$(".car").click(function(){
	location.href="cart.html"
})
$(".glyphicon-search").on("click",function(){
	var value= $(".form-control").val();
	window.localStorage.setItem("sousuo",'{"clas":'+'"'+value+'"}');
	window.location.href="search.html";
})
//导航栏游戏选择栏按类查找
$(".classs li").on("click",function(){
	var value= $(this).children("a")[0].innerHTML;
	var va="";
	for (i=0;i<value.length;i++) {
		va=va+value[i].replace(/\s/g," ")
	}
	va=value.replace(/\s/g," ");
	window.localStorage.setItem("sousuo",'{"clas":'+'"'+va+'"}');
	window.location.href="search.html";
})
//封掉submit事件
$(".sousuo").submit(function(){
	return false;
})
//点击搜索框放大镜进行搜索
$(".sousuo input").keydown(function(e){
	if(e.keyCode == 13){
		var value= $(this).val();
	    var va="";
	    for (i=0;i<value.length;i++) {
		    va=va+value[i].replace(/\s/g," ")
	    }
	    va=value.replace(/\s/g," ");
	    window.localStorage.setItem("sousuo",'{"clas":'+'"'+va+'"}');
	    window.location.href="search.html";
	}
})