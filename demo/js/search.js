$(document).ready(function(){
	//创建跟搜索相关的游戏信息
	$.ajax({
		type:"get",
		url:"js/ajax.json",
		datatype:"json",
		success:function(data){
			var re=/^[0-9A-Za-z ]*$/ ;
			var sousuo=JSON.parse(window.localStorage.getItem("sousuo"));
			$(".search_game")[0].innerHTML="";
			if(sousuo.clas==null||sousuo.clas==" "||sousuo.clas==""){
					for (var i=data.dateid.length-1;i>=0;i--) {
				    var name=data.dateid[i].name;
				    var money=data.dateid[i].money;
				    var icon=data.dateid[i].icon;
				    var strs=" ";
				    for(a=0;a<icon.length;a++){
					    var str="<img src='images/icon-"+icon[a]+".png'/>";
					    strs=strs+str;
				    }
				    var img="<img src='images/data/"+name+"/heads.jpg'/>"
				    var p="<p>"+name+"</p>";
				    var icon="<i>"+strs+"</i>";
				    var money="<label><b>￥</b>"+money+"</label>";
				    $("<li>"+img+p+icon+money+"</li>").appendTo(".search_game");
			      }
			}else if(sousuo.clas=="win"||sousuo.clas=="mac"||sousuo.clas=="liunx"){
					for (i=0;i<data.dateid.length;i++) {
					    for (a=0;a<data.dateid[i].icon.length;a++) {
						    if(sousuo.clas==data.dateid[i].icon[a]){
							    var name=data.dateid[i].name;
				                var money=data.dateid[i].money;
				                var day=data.dateid[i].day;
				                var icon=data.dateid[i].icon;
				                var strs=" ";
				                for(w=0;w<icon.length;w++){
				                	var str="<img src='images/icon-"+icon[w]+".png'/>";
				                	strs=strs+str;
				                }
				                var img="<img src='images/data/"+name+"/heads.jpg'/>"
				                var p="<p>"+name+"</p>";
				                var icon="<i>"+strs+"</i>";
				                var money="<label><b>￥</b>"+money+"</label>";
				                $("<li>"+img+p+icon+money+"</li>").appendTo(".search_game");
						    }
					    }
				    }
				$("h1").children("span")[0].innerHTML=sousuo.clas+"游戏";
			}else if(re.test(sousuo.clas)){
				var tx=true;
				var sousuos=sousuo.clas.toLowerCase().replace(/\s/g, "");
				for (b=0;b<data.dateid.length;b++) {
					var name=data.dateid[b].name;;
					var am=name.toLowerCase().replace(/\s/g, "");
					var money=data.dateid[b].money;
					var day=data.dateid[b].day;
					var icon=data.dateid[b].icon;
					var strs=" ";
					for(w=0;w<icon.length;w++){
					    var str="<img src='images/icon-"+icon[w]+".png'/>";
					    strs=strs+str;
				    }
					var img="<img src='images/data/"+name+"/heads.jpg'/>"
				    var p="<p>"+name+"</p>";
				    var icon="<i>"+strs+"</i>";
				    var money="<label><b>￥</b>"+money+"</label>";
				
					for (c=0;c<sousuos.length;c++) {
						if(am[c]!=sousuos[c]){
							tx=false;
						}
					}
					if(tx==true){
						$("<li>"+img+p+icon+money+"</li>").appendTo(".search_game");
					}
					$("h1")[0].innerHTML="您正在搜索"+sousuo.clas+"相关的游戏";
					tx=true;
				}
			}else{
				for (i=0;i<data.dateid.length;i++) {
					for (a=0;a<data.dateid[i].clas.length;a++) {
						if(sousuo.clas==data.dateid[i].clas[a]){
							var name=data.dateid[i].name;
				            var money=data.dateid[i].money;
				            var day=data.dateid[i].day;
				            var icon=data.dateid[i].icon;
				            var strs=" ";
				for(w=0;w<icon.length;w++){
					var str="<img src='images/icon-"+icon[w]+".png'/>";
					strs=strs+str;
				}
				var img="<img src='images/data/"+name+"/heads.jpg'/>"
				var p="<p>"+name+"</p>";
				var icon="<i>"+strs+"</i>";
				var money="<label><b>￥</b>"+money+"</label>";
				$("<li>"+img+p+icon+money+"</li>").appendTo(".search_game");
						}
					}
				}
				$("h1").children("span")[0].innerHTML=sousuo.clas+"游戏";
			}
			var divLength=$(".search_game li").length;
			if(divLength>8){
				for (i=8;i<divLength;i++) {
				$(".search_game li").eq(i).hide();
			}
				
			}else{
				divLength=8;
			}
			divLength=divLength/8;
			var yema="";
			for(i=1;i<divLength+1;i++){
				var aaa="<a href='javascript:;'>"+i+"</a>";
				yema=yema+aaa;
			}
			$("<p class='yema'>"+yema+"<p>").appendTo(".search_game");
			$(".search_game>p a").eq(0).css("color","#FFFFFF");
			$(".search_game>p a").on("click",function(){
				var index=$(this).index();
				$(".search_game>p a").css("color","#FFFFFF").not(this).css("color","");
				$(".search_game li").hide();
				for (a=index*8;a<(index+1)*8;a++) {
					$(".search_game li").eq(a).show();
				}
			});
			$(".search_game li").on("click",function(){
				var h4=$(this).children("p").html();
				for (i=0;i<data.dateid.length;i++) {
						        var name=data.dateid[i].name;
						        if(h4==name){
						     	var json=JSON.stringify(data.dateid[i]);
						     	window.localStorage.setItem("store",json);
						     	window.location.href="stort.html";
						}
							
					}
			});
		}
	})
})