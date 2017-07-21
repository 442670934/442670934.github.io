window.localStorage.setItem("sousuo","[]");
var store=JSON.parse(window.localStorage.getItem("store"));
var name=store.name;
var day=store.day;
var dvlp=store.dvlp;
var isbn=store.isbn;
var img=store.img;
var icon=store.icon;
var clas=store.clas;
var money=store.money;
var txt1=store.txt1;
var txt2=store.txt2;
//给页面生成商品信息
$(".h1")[0].innerHTML=name;
$(".stort_txt .img img")[0].src="images/data/"+name+"/header.jpg";
$(".h2")[0].innerHTML=txt1;
$(".h3 span")[0].innerHTML=day;
$(".h4 span")[0].innerHTML=dvlp;
$(".h5 span")[0].innerHTML=isbn;
var b=" ";
var d=" ";
for (i=0;i<clas.length;i++) {
	var c="<span>"+clas[i]+"</span>";
	b=b+c;
}
$(".h6")[0].innerHTML="游戏印象标签：<br/>"+b;
$(".page_buy p span")[0].innerHTML=name;
for (i=0;i<icon.length;i++) {
	var c="<img src='images/icon-"+icon[i]+".png'/>";
	d=d+c;
}
$(".page_buy i")[0].innerHTML=d;
$(".yuan span")[0].innerHTML=money;
for (i=0;i<txt2.length;i++) {
	$("<p>"+txt2[i]+"</p>").appendTo(".page_text .text");
}
//动态生成轮播图
var las=" ";
for (i=1;i<=img;i++) {
	if(i==1){
		$("<div class='item active'><img src='images/data/"+name+"/capsule"+i+".jpg'/></div>").appendTo(".carousel-inner ");
		var lis="<li data-target='#carousel-example-generic' data-slide-to="+(i-1)+" class='active'><img src='images/data/"+name+"/capsule"+i+".jpg'/></li>"
		las=las+lis;
	}else{
		$("<div class='item'><img src='images/data/"+name+"/capsule"+i+".jpg'/></div>").appendTo(".carousel-inner ");
		var lis="<li data-target='#carousel-example-generic' data-slide-to="+(i-1)+"><img src='images/data/"+name+"/capsule"+i+".jpg'/></li>"
		las=las+lis;
	}
}
	$(".carousel-indicators")[0].innerHTML=las;
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
//	点击加入购物车进行判断
	$(".page_btn input").on("click",function(){
	var cart=JSON.parse(window.localStorage.getItem("cart"));
	var gamename={"name":name};
	for (i=0;i<cart.length;i++) {
		if(name==cart[i].name){
			alert("购物车已经有同样的商品了。")
			window.location.href="cart.html";
			return false;
		}
	}
	cart.push(gamename);
	window.localStorage.setItem("cart",JSON.stringify(cart));
	window.location.href="cart.html";
})
$("html title")[0].innerHTML="Steam 上的 "+$("h1")[0].innerHTML;