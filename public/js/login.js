(function(){
	//过滤111222，aaabbb
	function isThree(pwstr) {
		if(pwstr.length == 6) {
			var p1 = pwstr.charCodeAt(0);
			var p2 = pwstr.charCodeAt(1);
			var p3 = pwstr.charCodeAt(2);
			var p4 = pwstr.charCodeAt(3);
			var p5 = pwstr.charCodeAt(4);
			var p6 = pwstr.charCodeAt(5);
			if(p1 == p2 && p2 == p3 && p4 == p5 && p5 == p6) {
				return false;
			}
		}
		return true;
	}
	//特殊字符
	function specialChar(pwstr) {
		var sc = true;
		for(var i = 0; i < (pwstr.length - 1); i++) {
			if(!((pwstr.charCodeAt(i) > 64 && pwstr.charCodeAt(i) < 91) || (pwstr.charCodeAt(i) > 47 && pwstr.charCodeAt(i) < 58) || (pwstr.charCodeAt(i) > 96 && pwstr.charCodeAt(i) < 123))) {
				sc = false;
				break;
			}
		}
		return sc;
	}
	//判断是否有中文
	function HasChinese(str) {
		if(/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
			return true;
		} else {
			return false;
		}
	}
	//验证字符串是否为:不能全部一样，例如2222222  和	不能按照有规则的顺序，例如123456，654321
	function pwregex(pwstr) {
		var isregex = false;
		if(pwstr != "" && pwstr.length > 1) {
			var cf = false;
			var sx = false;

			for(var i = 0; i < (pwstr.length - 1); i++) {
				if(pwstr.substring(i, i + 1) != pwstr.substring(i + 1, i + 2)) {
					cf = true;
					break;
				}
			}
			for(var i = 0; i < (pwstr.length - 1); i++) {
				if(pwstr.charCodeAt(0) > pwstr.charCodeAt(1)) {
					if(pwstr.charCodeAt(i) - pwstr.charCodeAt(i + 1) != 1) {
						sx = true;
						break;
					}
				} else {
					if(pwstr.charCodeAt(i) - pwstr.charCodeAt(i + 1) != -1) {
						sx = true;
						break;
					}
				}
			}

			if(cf && sx) {
				isregex = true;
			}
		}
		return isregex;
	}
	//过滤掉abc123 123789
	function isOrder(pwstr) {
		var lx = true;
		if(pwstr.length == 3) {
			var c1 = pwstr.charCodeAt(0);
			c1++;
			var c2 = pwstr.charCodeAt(1);
			c2++;
			if(pwstr.charCodeAt(1) == c1 && pwstr.charCodeAt(2) == c2) {
				lx = false;
			}
		}
		return lx;
	}
	//反过滤 876432
	function isOrderR(pwstr) {
		var lx = true;
		if(pwstr.length == 3) {
			var c0 = pwstr.charAt(0);
			var c1 = pwstr.charAt(1);
			var c2 = pwstr.charAt(2);

			if(c0 < c1 && c1 < c2) {
				lx = isOrder(pwstr);
			} else if(c0 > c1 && c1 > c2 && pwstr.charCodeAt(0) < 97) {
				var str = new Array(c0, c1, c2);
				str = str.reverse();
				str = str.join("");
				lx = isOrder(str);
			}
			return lx;
		}
	}
	//三位三位检测
	function checkpwd(pwstr) {
		if(pwstr.length == 6) {
			var pwstr1 = pwstr.substring(0, 3);
			var pwstr2 = pwstr.substring(3, 6);
			var lx1 = isOrderR(pwstr1);
			var lx2 = isOrderR(pwstr2);
			if(lx1 || lx2) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	}
	//邮箱格式
	function checkEmailRegex(str) {
		//var emailreg=/\w+@\w+\.[a-z]+/;
		var emailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return emailreg.test(str);
	}
	function checkpwdFun(pwd) {
		var str = {
			bool:true,
			msg:''
		}
		if(pwd == undefined || pwd==""){
			str.bool = false;
			str.msg = '密码不能为空'
			return str
		}
		if(!pwd){
			str.bool = false;
			str.msg = '密码必须6至20个字符，数字与字母（区分大小写）组合'
			return str
		}
		if(HasChinese(pwd) || !specialChar(pwd)) {
			str.bool = false;
			str.msg = '只能输入英文字母、数字'
			return str;
		}
		if(pwd.length < 6 || pwd.length > 20) {
			str.bool = false;
			str.msg = '密码长度为6至20位'
			return str;
		}
		if(!pwregex(pwd) || !isThree(pwd) || !checkpwd(pwd)) {
			str.bool = false;
			str.msg = '密码太简单，请重新输入'
			return str;
		}
		return str;
	}
	function checkRepwdFun(pwd,repwd) {
		var str = {
			bool:true,
			msg:''
		}
		if(repwd == undefined || repwd==""){
			str.bool = false;
			str.msg = '请再次输入密码'
			return str
		}
		if(!pwd || pwd !== repwd){
			str.bool = false;
			str.msg = '两次密码不一致'
			return str
		}
		return str;
	}
	function checkNameFun(name) {
		var str = {
			bool:true,
			msg:''
		}
		if(name == undefined || name==""){
			str.bool = false;
			str.msg = '用户名不能为空'
			return str
		}
		if(!name){
			str.bool = false;
			str.msg = '用户名由 3 到 15 个字符组成'
			return str
		}
		if(HasChinese(name) || !specialChar(name)) {
			str.bool = false;
			str.msg = '用户名由英文字母和数字'
			return str;
		}
		if(name.length < 3) {
			str.bool = false;
			str.msg = '用户名不得小于 3 个字符'
			return str;
		}
		if(name.length > 15) {
			str.bool = false;
			str.msg = '用户名不得大于于15个字符'
			return str;
		}
		if(!pwregex(name) || !isThree(name) || !checkpwd(name)) {
			str.bool = false;
			str.msg = '用户名已被注册'
			return str;
		}
		return str;
	}
    $('#login-btn').on('click',function(){
        var loginName = $('#username').val();
        var loginPassword = $('#password').val();
        if(!loginName){
            $('#usernameHelp').css('opacity', '1').text('用户名不能为空')
            return
        }else{
            $('#usernameHelp').css('opacity', '0')
        }
        if(!loginPassword){
            $('#passwordHelp').css('opacity', '1').text('密码不能为空')
            return
        }else{
            $('#passwordHelp').css('opacity', '0')
        }
        $.ajax({
            type:'get',
            url:urls+'api/getCode?username='+loginName
        }).then((d) => {
            if(d.code != 0){
                $('#usernameHelp').css('opacity', '1').text(d.message)
                return
            }
            var code = hex_md5(d.data.data + hex_md5(loginPassword))
            $.ajax({
                type:'post',
                url:urls+'api/user/login',
                data:{
                    username:loginName,
                    code:code
                }
            }).then(function(d){
                if(d.code != 0){
                    errorAnima(d.message)
                    return
                }
                localStorage.userInfo = JSON.stringify(d.data.user)
                location.href = '/main/index'
            })
        })
    })
    $('.get-verification').on('click',function(){
    	var rEmail = $('#email').val();
    	var parent = $(this).parents('.input-group').eq(0);
    	if(!rEmail){
    		parent.addClass('has-danger');
    		parent.find('.form-text').text('邮箱不能未空')
    		return
    	}else if(!checkEmailRegex(rEmail)){
    		console.log(parent.addClass('has-danger'))
    		parent.addClass('has-danger');
    		parent.find('.form-text').text('邮箱格式错误')
    		return
    	}
    	parent.removeClass('has-danger');
    	if($(this).text() == '获取验证码' || $(this).text() == '重新发送'){
    		var t = 30;
    		$(this).text(t+'秒重新发送')
    		var time = setInterval(function(){
    			if(t>0){
    				t--;
    				$(this).text(t+'秒重新发送');
    			}else{
    				clearInterval(time);
    				$(this).text('重新发送');
    			}
    		}.bind(this),1000);
    		$.ajax({
    			type:"get",
    			url:urls+"api/user/emailVerification",
    			data:{
    				email:rEmail
    			}
    		}).then(function(data){
    			if(data.code != 0){
                    errorAnima(data.message)
                    return
                }
    			parent.addClass('has-info')
    			parent.find('.form-text').text('已发送,如果长时间收不到请检查邮箱是否屏蔽了邮件')
    		});
    	}
   })
    $('.register-box>div').on('change',function(){
    	var control = $(this).find('.form-control');
    	if(control.attr('id')=='username'){
    		var str = checkNameFun(control.val());
    		if(!str.bool){
    			$(this).addClass('has-danger');
	    		$(this).find('.form-text').text(str.msg)
	    		return
    		}
    	}else if(control.attr('id')=='email'){
    		if(!control.val()){
    			$(this).addClass('has-danger');
	    		$(this).find('.form-text').text('邮箱不能未空')
	    		return
    		}
    		if(!checkEmailRegex(control.val())){
	    		$(this).addClass('has-danger');
	    		$(this).find('.form-text').text('请输入正确的邮箱')
	    		return
	    	}
    	}else if(control.attr('id')=='verification'){
    		if(!control.val()){
    			$(this).addClass('has-danger');
	    		$(this).find('.form-text').text('请输入验证码')
	    		return
    		}
    	}else if(control.attr('id')=='password'){
    		var str = checkpwdFun(control.val());
    		if(!str.bool){
    			$(this).addClass('has-danger');
	    		$(this).find('.form-text').text(str.msg)
	    		return
    		}
    	}else if(control.attr('id')=='passwordrs'){
    		var pass = $('#password')
    		var str = checkRepwdFun(pass.val(),control.val());
    		if(!pass.val()){
    			pass.parents('.form-group').addClass('has-danger');
    			pass.parents('.form-group').find('.form-text').text('密码不能为空');
    			return
    		}
    		if(!str.bool){
    			$(this).addClass('has-danger');
	    		$(this).find('.form-text').text(str.msg)
	    		return
    		}
    	}
    	$('#email').parents('.input-group').removeClass('has-info');
    	$(this).removeClass('has-danger');
    	
    })
    $('#register-btn').on('click',function(){
    	var rName = $('#username').val();
        var rEmail = $('#email').val();
        var rPaswod = $('#password').val();
        var rPaswods = $('#passwordrs').val();
        var vers = $('#verification').val();
        var parent = $('.login-box>div');
        
        var str = true;
        var strName = checkNameFun(rName);
        var strPwd = checkpwdFun(rPaswod);
        var strRePwd = checkRepwdFun(rPaswod,rPaswods);
        if(!strName.bool){
        	parent.eq(0).addClass('has-danger');
    		parent.eq(0).find('.form-text').text(strName.msg)
        }
        
        if(!rEmail){
        	parent.eq(1).addClass('has-danger');
    		parent.eq(1).find('.form-text').text('邮箱不能为空')
    		str = false;
        }else if(!checkEmailRegex(rEmail)){
        	parent.eq(1).addClass('has-danger');
    		parent.eq(1).find('.form-text').text('请输入正确的邮箱')
    		str = false;
        }
        
        if(!vers){
        	parent.eq(2).addClass('has-danger');
    		parent.eq(2).find('.form-text').text('请输入验证码')
    		str = false;
        }
        
        if(!strPwd.bool){
        	parent.eq(3).addClass('has-danger');
			parent.eq(3).find('.form-text').text(strPwd.msg)
        }
        
        if(!strRePwd.bool){
        	parent.eq(4).addClass('has-danger');
    		parent.eq(4).find('.form-text').text(strRePwd.msg)
    		
        }
        if(!str || !strName.bool || !strPwd.bool || !strRePwd.bool){
        	console.log(123)
        	return
        }
        rPaswod = hex_md5(rPaswod)
        $.ajax({
                type:'post',
                url:urls+'api/user/register',
                data:{
                    username:rName,
                    nickname:rName,
                    email:rEmail,
                    data:rPaswod,
                    code:vers
                },
                success:function(d){
                    console.log(d)
                    if(d.code==2){
                    	parent.eq(0).addClass('has-danger');
						parent.eq(0).find('.form-text').text('用户名已被注册');
						return
                    }else if(d.code==4){
                    	parent.eq(2).addClass('has-danger');
						parent.eq(2).find('.form-text').text('验证码错误');
						return
                    }else if(d.code != 0){
	                    errorAnima(data.message)
	                    return
                	}
                    alert('成功注册,确定后跳转至登陆页面!')
                    location.href = '/main/login'
                }
            })
    })
})()