window.localStorage.setItem("sousuo","[]");
var cart=JSON.parse(window.localStorage.getItem("cart"));
var gameMoney=0;
Array.prototype.delet=function(index){
    if(index<0||index>=this.length)
    return ;
    for(var i = index ;i < this.length ; i++){
        this[i]=this[i+1];
    }
    this.length-- ;
}
//根据购物车商品创建商品信息
$.ajax({
	type:"get",
	url:"js/ajax.json",
	dataType:"json",
	success:function(data){
		$(".sotet_ul")[0].innerHTML="";
		for (i=0;i<cart.length;i++) {
			for (a=0;a<data.dateid.length;a++) {
			    var name=data.dateid[a].name;
			    var money=data.dateid[a].money;
			    var icon=data.dateid[a].icon;
			    if(name==cart[i].name){
				    gameMoney=parseInt(gameMoney)+parseInt(money);
				    var img="<img class='left' src='images/data/"+name+"/heads.jpg'/>"
				    var name="<span class='left'>"+name+"</span>"
				    var b=" ";
				    for (w=0;w<icon.length;w++) {
					    var c="<img src='images/icon-"+icon[w]+".png'/>"
					    b=b+c;
				    }
				    var icon="<i class='right'>"+b+"</i>"
				    var moneys="<div class='right money'><b>￥</b><span>"+money+"</span></p><p><a href='javascript:;'>移出</a></p></div>"
		            var nameIcon="<div class='name_icon'>"+name+icon+"</div>";
		            $("<li>"+img+moneys+nameIcon+"</li>").appendTo(".sotet_ul");
			    }
	        }
		}
		$(".checkout_car h6 .right span")[0].innerHTML=gameMoney;
		$(".money p a").on("click",function(){
			var index=$(this).parent("p").parent("div").parent("li").index();
			cart.delet(index);
			window.localStorage.setItem("cart",JSON.stringify(cart));
			window.location.reload();
		})
		$(".checkout_car button").click(function(){
			var loding=JSON.parse(window.localStorage.getItem("loding"));
			if(loding.user==null||loding.user=="null"){
				alert("请登录后再购买！（点击确认后跳转至登录页面）");
				window.location.href="loding.html";
			}
			var user=JSON.parse(window.localStorage.getItem("user:"+loding.user));
			//判断是否已经拥有此商品
			for(i=0;i<cart.length;i++){
				var have=true;
				for(a=0;a<user.havegame.length;a++){
					if(cart[i].name==user.havegame[a]){
						have=false;
					}
				}
				//如果没有就购买成功，有就失败；
				//并删除购买成功/失败的商品||清空购物车
				if(have==true){
					user.havegame.push(cart[i].name);
					alert("购买成功"+cart[i].name);
				}else if(have==false){
					alert("不能重复购买"+cart[i].name);
				}
			}
			for (i=0;i<user.havegame.length;i++) {
				if(user.havegame[i]==""||user.havegame[i]==null||user.havegame[i]==undefined){
					user.havegame.delet(i);
				}
			}
			//上传用户数据
			window.localStorage.setItem("user:"+loding.user,JSON.stringify(user));
			//清空购物车
			window.localStorage.removeItem("cart");
			//并跳转页面
			setTimeout(function(){
				window.location.href="index.html";
			},1000);
		})
	}
});
