/**
 * Created by Administrator on 2017/7/25 0025.
 * 启动入口文件
 */
// 加载express模块
var express = require("express");
var swig = require("swig");
var mysql = require("mysql");
var path         = require('path');
// 中间件  处理请求
var bodyParser = require("body-parser");
var Cookies = require("cookies");
var ueditor      = require('ueditor');
// 创建 app应用  ,类似于 http.createServer()
var app = express();

// 设置静态文件托管
// 当用户访问路径包含public时，对应到当前目录下的public文件夹
app.use("/public",express.static(__dirname + "/public"));
app.use("/third-party",express.static(__dirname + "/public/libs/ueditor/third-party"));

//配置模板应用
// 第一个参数 模板引擎的后缀  第二个参数 解析模板内容的方法
app.engine("html", swig.renderFile);
// 设置模板文件存放的目录 ，第一个参数必须是 views ，第二个参数是目录
app.set("views","./views");
// 注册使用的模板引擎 第一个参数必须是 view engine ，第二个参数是app.engine方法中定义的模板引擎的名称
app.set("view engine","html");
// 取消模板缓存
swig.setDefaults({cache:false});

// bodyParser中间件设置，设置后提交过来的数据会加一个字段，就是body字段，里面是解析好的数据
app.use(bodyParser.urlencoded({extended:true}));

// 设置cookie
app.use(function (req,res,next) {
     req.cookies = new Cookies(req,res);

     // 解析登录用户的cookie信息
     req.userInfo = {};
     if(req.cookies.get("userInfo")){
         try{
             req.userInfo = JSON.parse(req.cookies.get("userInfo"));
         }catch(e){
            next();
         }
     }
     next();
});

//ueditor
app.use(express.static(path.join(__dirname, 'public')));
app.use("/libs/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {

    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var date = new Date();
        var imgname = req.ueditor.filename;

        var img_url = '/images';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }

    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }

    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/libs/ueditor/nodejs/config.json')
    }

}));

/*
* 首页
*   req 是require对象
*   res 是response 对象
*   next 是函数
* */


/*
* 根据不同规则划分模块
* */
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));


app.listen(10000);

