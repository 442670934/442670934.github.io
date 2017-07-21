	$(".join").click(function(){
		if($(this)[0]==$(".left .join")[0]){
			$(".left").css("display","none")
			$(".right").css("display","block")
		}else if($(this)[0]==$(".right .join")[0]){
			$(".right").css("display","none")
			$(".left").css("display","block")
		}
	})
	$(".right select").change(function(){
	    $(".right img")[0].src="images/userhead/head"+$(".right select").val()+".png"
	})
	$("#register").click(function(){
		var name=$("#name").val();
		var word=$("#word").val();
		var pass=$("#password").val();
		var head=$(".right select").val();
		var str=window.localStorage.getItem("user:"+name);
		if(name==""){
			alert("账号不能为空!");
		}else if(word==""){
			alert("密码不能为空！")
		}else if(word!=pass){
			alert("两次密码不一致！")
		}else if(str!=undefined){
			alert("账号已存在！")
		}else if(/^[0-9a-zA-Z]{6,10}$/.test(name)){
			var json = {"user":name,"pass":word,"head":head,havegame:[]};
			window.localStorage.setItem("user:"+name,JSON.stringify(json));
			alert("注册成功！");
		}else{
			alert("账号只能由长度为6~10位的英文字母或数字组成！")
		}
	})
	$("#loding").click(function(){
		var users=$("#user").val();
		var passs=$("#pass").val();
		user="user:"+users;
		var user=JSON.parse(window.localStorage.getItem(user));
		if(users==""){
		    alert("账号不能为空！");
		}else if(passs==""){
		   	alert("密码不能为空！");
		}else if(users==null||passs!=user.pass){
			console.log(user.pass);
			console.log(users);
			console.log(passs);
		   	alert("账号或密码错误！");
		}else if(passs==user.pass){
		   	window.localStorage.removeItem("loding");
		    var user = JSON.stringify(user);
		    window.localStorage.setItem("loding",user);
		    window.location.href="index.html";
		}
		   
	})