/**
 * Created by Administrator on 2017/7/25 0025.
 * 接口
 */
var express = require("express");
var router = express.Router();
var db = require("../db");

// 生产一个token
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
function generateMixed(n) {
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}
// 定义一个统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData = {
        code : 0,
        message : "",
        token : "0"
    };
    next();
});

/*
* 登录接口
* 参数1 userName  用户名
* 参数2 password  密码
* */
router.post("/user/login",function(req,res,next){
    console.log(req.body);
    var username = req.body.userName;
    var password = req.body.password;
    if(username == ""){
        responseData.code = "-1";
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    };
    if(password == ""){
        responseData.code = "-1";
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    };
    var $sql = " SELECT * from user WHERE userName= '" + username+"' and password='" + password + "'";
    db.query($sql,function(err,result){
        if(err){
            console.log('Connection Error: ' + err.message);
            responseData.code = "-1";
            responseData.message = "sql查询错误";
            res.json(responseData);
            return;
        }else {
            if(result.length <= 0){
                console.log("没有这条数据");
                responseData.code = "-1";
                responseData.message = "用户名或密码错误";
                res.json(responseData);
                return;
            }else{

                console.log("有这条数据");
                console.log(result);
                var token = generateMixed(16);
                var addTokenSql =  " UPDATE user SET token='" + token +"' WHERE userName= '" + username+"' and password='" + password + "'";
                console.log(addTokenSql);
                db.query(addTokenSql,function (err,result) {
                    if(err){
                        console.log('Connection Error: ' + err.message);
                        responseData.code = "-1";
                        responseData.message = "sql错误";
                        res.json(responseData);
                        return;
                    }else{
                        req.cookies.set("userInfo",JSON.stringify({
                            userName : username,
                            token : token
                        }));
                        responseData.code = 0;
                        responseData.message = "登录成功";
                        responseData.token = token;
                        res.json(responseData);
                    }
                })
            }
        }
    });

});

/*
* 注册接口
* 参数1 userName  用户名
* 参数2 password  密码
*/
router.post("/user/register",function(req,res,next){
    console.log(req.body);
    var username = req.body.userName;
    var password = req.body.password;
    if(username == ""){
        responseData.code = "-1";
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    };
    if(password == ""){
        responseData.code = "-1";
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    };

    // 检测是否包含某条记录的查询语句
    var $sql = " SELECT * from user WHERE userName= '" + username+"' and password='" + password + "'";
    //在数据库中添加当前用户名和密码的语句
    var addSql = "INSERT INTO user(userName,password) VALUES ( '" + username + "','"+password+"')" ;

    db.query($sql,function(err,result){
        if(err){
            console.log('Connection Error: ' + err.message);
            responseData.code = "-1";
            responseData.message = err.message;
            res.json(responseData);
        }else {
            if(result.length <= 0){
                console.log("没有这条数据");
                db.query(addSql,function(err,result){
                    if(err){
                        console.log('Connection Error: ' + err.message);
                        responseData.code = "-1";
                        responseData.message = err.message;
                        res.json(responseData);
                        return;
                    }else{
                        responseData.code = "0";
                        responseData.message = "注册成功";
                        res.json(responseData);
                    }
                })
            }else{
                console.log("有这条数据");
                responseData.code = "-1";
                responseData.message = "用户名已注册";
                res.json(responseData);
            }
        }
    });
});

/*
* 退出登录
* */
router.get("/user/logout",function (req,res,next) {
    req.cookies.set("userInfo",null);
    res.json(responseData);
});


module.exports = router;



