(function(){
    function getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio 
        || context.webkitBackingStorePixelRatio 
        || context.mozBackingStorePixelRatio 
        || context.msBackingStorePixelRatio 
        || context.oBackingStorePixelRatio 
        || context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
    var loginBox = document.querySelector('.register-box')||document.querySelector('.login-box')
    var boxr = {
        y1:loginBox.offsetTop-loginBox.clientHeight*0.5,
        x1:loginBox.offsetLeft-loginBox.clientWidth*0.5,
        y2:loginBox.offsetTop+loginBox.clientHeight*0.5,
        x2:loginBox.offsetLeft+loginBox.clientWidth*0.5
    }
    var main = document.querySelector('.main');
    var canvas = document.querySelector('.bg-canvas');
    var client = {
        x:-1000,
        y:-1000
    }
    canvas.onmousemove = function(e){
        client.x = e.clientX-main.scrollTop;
        client.y = e.clientY-main.offsetTop;
    }
    canvas.onmouseout = function(e){
        client.x = -1000
        client.y = -1000
    }
    var ctx=canvas.getContext("2d");
    var ratio = getPixelRatio(ctx);
    canvas.height = main.clientHeight*ratio
    canvas.width = main.clientWidth*ratio
    var suArr = [];
    for(var i=0;i<100;i++){
        x = Math.round(Math.random()*canvas.width);
        y = Math.round(Math.random()*canvas.height);
        xspeed = Math.random()*2;
        yspeed = Math.random()*2;
        if(Math.floor(Math.random()*2)){
            xspeed = -xspeed
        }
        if(Math.floor(Math.random()*2)){
            yspeed = -yspeed
        }
        suArr.push({
            x:x,
            y:y,
            xspeed:xspeed,
            yspeed:yspeed
        })
        
        ctx.beginPath();
        ctx.arc(x,y,3,0,2*Math.PI,true);
        // if(x>boxr.x1-1&&x<boxr.x2+1&&y>boxr.y1-1&&y<boxr.y2+1){
        //     console.log(x,y)
        //     ctx.fillStyle="red";
        // }else{
        //     ctx.fillStyle="#ccc";
        // }
        ctx.fillStyle="#ccc";
        ctx.fill();
    }
    var draw = function(event){
        ctx.clearRect(0,0,canvas.width,canvas.height);  
        for(var i=0;i<suArr.length;i++){
            var s = suArr[i];
            if(s.x+s.xspeed<=1 || s.x+s.xspeed>=canvas.width-1){
                s.xspeed = -s.xspeed
            }
            if(s.y+s.yspeed<=1 || s.y+s.yspeed>=canvas.height-1){
                s.yspeed = -s.yspeed
            }
            s.x = s.x+s.xspeed;
            s.y = s.y+s.yspeed;
            
            var xpow = Math.pow(Math.abs(s.x-client.x),2)
            var ypow = Math.pow(Math.abs(s.y-client.y),2)
            var msqrt =Math.sqrt(xpow+ypow)
            if(msqrt<=150){
                ctx.beginPath();
                ctx.moveTo(client.x,client.y);
                ctx.lineTo(s.x,s.y);
                var cols = Math.ceil(msqrt)/3+204
                ctx.strokeStyle="rgb("+cols+","+cols+","+cols+")";
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(s.x,s.y,3,0,2*Math.PI,true);
            ctx.fillStyle="rgb(204,204,204)";
            ctx.fill();
            suArr[i] = s;
        }
        window.requestAnimationFrame(draw);
    }
    // setInterval(draw,100)
    window.requestAnimationFrame(draw);
})()