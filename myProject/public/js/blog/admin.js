/**
 * Created by Administrator on 2017/7/26 0026.
 */

$(function(){
    $("#menu2 li a").wrapInner( '<span class="out"></span>' );
    $("#menu2 li a").each(function() {
        $( '<span class="over">' +  $(this).text() + '</span>' ).appendTo( this );
    });
    $("#menu2 li a").hover(function() {
        $(".out",	this).stop().animate({'top':	'40px'},	300); // move down - hide
        $(".over",	this).stop().animate({'top':	'0px'},		300); // move down - show
    }, function() {
        $(".out",	this).stop().animate({'top':	'0px'},		300); // move up - show
        $(".over",	this).stop().animate({'top':	'-40px'},	300); // move up - hide
    });


    $(".login-btn").click(function(){
        var useranme = $(".userName").val();
        var password = $(".password").val();
        $.ajax({
            url:"/api/user/login",
            type:"post",
            data:{
                userName : useranme,
                password : password
            },
            dataType:"json",
            success:function (data) {
                if(data.code == 0){
                    window.location.reload();
                }else{
                    alert(data.message);
                }

            },
            error:function (data) {
                alert("登录失败")
            }
        })
    });
    $(".register-btn").click(function(){
        var useranme = $(".userName").val();
        var password = $(".password").val();
        $.ajax({
            url:"/api/user/register",
            type:"post",
            data:{
                userName : useranme,
                password : password
            },
            dataType:"json",
            success:function (data) {
                if(data.code == 0){
                    alert("注册成功")
                }else{
                    alert(data.message);
                }
            },
            error:function (data) {
                alert("注册失败")
            }
        })
    });
    $(".logout").click(function(){
        $.ajax({
            url : "/api/user/logout",
            type : "GET",
            data : {},
            dataType:"json",
            success:function () {

            },
            error:function () {
                alert("退出失败");
            }
        })
    })



})

