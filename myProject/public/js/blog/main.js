/**
 * Created by Administrator on 2017/7/26 0026.
 */

var commentId;
$(function(){
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    $(".form1 .sumbit_btn").click(function () {
        var name = $(".form1 #inpName").val();
        var email = $(".form1 #inpEmail").val();
        var url = $(".form1 #inpHomePage").val();
        var comment = $(".form1 #txaArticle").val();
        var id = GetQueryString("id");
        if(id == "10000"){
            id = 1;
        }
        if(name == "" || name == "undefined"){
            alert("名称不能为空！！");
            return false;
        };
        if(comment == "" || comment == "undefined"){
            alert("回复不能为空！！");
            return false;
        };
        $.ajax({
            url:"/api/comment",
            type:"POST",
            data:{
                name : name ,
                email : email,
                http:url,
                reply:comment,
                id:id
            },
            dataType:"json",
            success:function (data) {
                if(data.code == 0){
                    alert(data.message);
                    window.location.reload();
                }
            },
            error:function (e) {
                console.log(e);
            }

        })
    });
    $(".form2 .sumbit_btn").click(function () {
        var comment = $(".huifu"+commentId+ " #txaArticle").val();
        var id = commentId;
        if(comment == "" || comment == "undefined"){
            alert("回复不能为空！！");
            return false;
        };
        $.ajax({
            url:"/api/comment2",
            type:"POST",
            data:{
                adminReply:comment,
                id:id
            },
            dataType:"json",
            success:function (data) {
                if(data.code == 0){
                    alert(data.message);
                    window.location.reload();
                }
            },
            error:function (e) {
                console.log(e);
            }

        })
    });


});
function huifu(id){
    $.ajax({
        url:"/api/isadmin",
        type:"POST",
        data:{},
        dataType:"json",
        success:function (data) {
            if(data.code == 0){
                $(".form1,.form2").hide();
                $(".huifu"+id).show();
                commentId = id;

            }else{
                alert("抱歉。你不可以回复");
            }
        },
        error:function (e) {
            console.log(e);
        }
    })
}

