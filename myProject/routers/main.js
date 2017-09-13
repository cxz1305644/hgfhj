/**
 * Created by Administrator on 2017/7/25 0025.
 * 前端展示路由
 */

var express = require("express");
var router = express.Router();
var db = require("../db.js");

// 页面数据渲染
var data = {
    navData:[],             // 分类列表
    viewData:[],            // 热门推荐
    linuxData:[],           // linux最新文章
    databaseData:[],        // 数据库最新文章
    webData:[],             // 前端最新文章
    javaData:[],            // java最新文章
    essayData:[],           // 随笔最新文章
    viewSum: 0,             // 浏览总数
    articleSum:0,           // 文章总数
    commentSum:0            // 评论总数
};
// 获取文章分类
// var getNavSql = "select * from article_classification";
// 获取点击量最高
var getviewSql = "select * from article order by view desc limit 0,3";
// 获取linux最新的文章
var linuxArticle = "select * from article where classification_id=5 order by createtime desc limit 0,3";
// 获取数据库最新的文章
var databaseArticle = "select * from article where classification_id=3 order by createtime desc limit 0,3";
// 获取web前端最新的文章
var webArticle = "select * from article where classification_id=2 order by createtime desc limit 0,3";
// 获取java最新的文章
var javaArticle = "select * from article where classification_id=4 order by createtime desc limit 0,3";
// 获取随笔最新的文章
var essayArticle = "select * from article where classification_id=6 order by createtime desc limit 0,3";
// 获取浏览总数
var viewSum = "select SUM(view) from article";
// 获取文章总数
var articleSum = "select * from article";
// 获取评论总数
var commentSum = "select * from article_comment";



var count = 0;
var getData = function (sql,obj) {
    return new Promise(function(resolve,reject){
        db.query(sql,function (err,result) {
            if(err){
                console.log("error:" + err.message);
                return;
            }else{
                count ++;
                console.log("promise*****" + count);
                data[obj] = result;
                resolve();
            }
        });
    });
};
/*
*  首页
* */
// router.get("/",function(req,res,next){
//     getData(getviewSql,"viewData").then(function () {
//         return getData(linuxArticle,"linuxData")
//     }).then(function () {
//         return getData(databaseArticle,"databaseData")
//     }).then(function () {
//         return getData(webArticle,"webData")
//     }).then(function () {
//         return getData(javaArticle,"javaData")
//     }).then(function () {
//         return getData(essayArticle,"essayData")
//     }).then(function () {
//         return getData(articleSum,"articleSum")
//     }).then(function () {
//         return getData(commentSum,"commentSum")
//     }).then(function () {
//         db.query(viewSum,function (err,result) {
//             if(err){
//                 console.log("error : "+ err.message);
//                 return;
//             }else{
//                 data.viewSum = result[0]["SUM(view)"];
//                 console.log(data);
//                 res.render("index",{
//                     data:data
//                 });
//             }
//         })
//     })
//
//     db.query(articleSum,function (err,result) {
//         if(err){
//             console.log("error:" + err.message);
//             return;
//         }else{
//             data.articleSum = result.length;
//
//         }
//     })
//
// });

router.get("/",function(req,res,next){


    res.send('respond with a resource');



});

router.get("/liuyan",function(req,res,next){
    var id = 1;
    var getSql = "select * from article where id=" + id;
    var getSql2 = "SELECT * FROM `article` WHERE `id`<"+id+" ORDER BY `id` DESC LIMIT 1";
    var getSql3 = "SELECT * FROM `article` WHERE `id` > "+id+" LIMIT 1";
    var getSql4 = "select * from article_comment";
    var getSql5 = "select * from article_comment where article_id=" + id;
    var nextdate,prevdata,templateData,view,comment;
    getData(viewSum,"viewSum").then(function () {
        return getData(articleSum,"articleSum")
    }).then(function () {
        return getData(commentSum,"commentSum")
    }).then(function () {
        // 查询文章
        db.query(getSql,function (err,result) {
            if(err){
                console.log("error:" + err.message);
                return;
            }else{
                templateData = result[0];
                console.log(templateData.view+1);
                view = templateData.view +1;
                templateData.view = view;
                var addviewsql = "update article set `view` = " + view + " where id = "  + id;
                // 更新浏览量
                db.query(addviewsql,function (err,result) {
                    if(err){
                        console.log("error:" + err.message);
                        return;
                    }else {
                        // 获取上一条
                        db.query(getSql2,function (err,result) {
                            if(err){
                                console.log("error:" + err.message);
                                return;
                            }else{
                                prevdata = result[0];
                                // 获取下一条
                                db.query(getSql3,function (err,result) {
                                    if(err){
                                        console.log("error:" + err.message);
                                        return;
                                    }else{
                                        nextdate = result[0];
                                        // 查询文章回复
                                        db.query(getSql5,function (err,result) {
                                            if(err){
                                                console.log("error:" + err.message);
                                                return;
                                            }else{
                                                comment = result;
                                                db.query(viewSum,function (err,result) {
                                                    if(err){
                                                        console.log("error : "+ err.message);
                                                        return;
                                                    }else{
                                                        data.viewSum = result[0]["SUM(view)"];
                                                        console.log(data);
                                                        console.log(nextdate);
                                                        res.render("main/liuyan",{
                                                            templateData:templateData,
                                                            prevdata:prevdata,
                                                            nextdate:nextdate,
                                                            comment:comment,
                                                            data:data
                                                        });
                                                    }
                                                })

                                            }
                                        });


                                    }
                                })
                            }
                        })
                    }

                })
            }
        })
    })



});
router.get("/database",function(req,res,next){
    res.render("main/database");
});
router.get("/qianduan",function(req,res,next){
    res.render("main/qianduan");
});
router.get("/linux",function(req,res,next){
    res.render("main/linux");
});
router.get("/java",function(req,res,next){
    res.render("main/java");
});
router.get("/essay",function(req,res,next){
    res.render("main/essay");
});
/*
* 文章模板页
* */
router.get("/template",function(req,res,next){
    var id = req.query.id || "";
    var getSql = "select * from article where id=" + id;
    var getSql2 = "SELECT * FROM `article` WHERE `id`<"+id+" ORDER BY `id` DESC LIMIT 1";
    var getSql3 = "SELECT * FROM `article` WHERE `id` > "+id+" LIMIT 1";
    var getSql4 = "select * from article_comment";
    var getSql5 = "select * from article_comment where article_id=" + id;
    var nextdate,prevdata,templateData,view,comment;
    getData(viewSum,"viewSum").then(function () {
        return getData(articleSum,"articleSum")
    }).then(function () {
        return getData(commentSum,"commentSum")
    }).then(function () {
        // 查询文章
        db.query(getSql,function (err,result) {
            if(err){
                console.log("error:" + err.message);
                return;
            }else{
                templateData = result[0];
                console.log(templateData.view+1);
                view = templateData.view +1;
                templateData.view = view;
                var addviewsql = "update article set `view` = " + view + " where id = "  + id;
                // 更新浏览量
                db.query(addviewsql,function (err,result) {
                    if(err){
                        console.log("error:" + err.message);
                        return;
                    }else {
                        // 获取上一条
                        db.query(getSql2,function (err,result) {
                            if(err){
                                console.log("error:" + err.message);
                                return;
                            }else{
                                prevdata = result[0];
                                // 获取下一条
                                db.query(getSql3,function (err,result) {
                                    if(err){
                                        console.log("error:" + err.message);
                                        return;
                                    }else{
                                        nextdate = result[0];
                                        // 查询文章回复
                                        db.query(getSql5,function (err,result) {
                                            if(err){
                                                console.log("error:" + err.message);
                                                return;
                                            }else{
                                                comment = result;
                                                db.query(viewSum,function (err,result) {
                                                    if(err){
                                                        console.log("error : "+ err.message);
                                                        return;
                                                    }else{
                                                        data.viewSum = result[0]["SUM(view)"];
                                                        console.log(data);
                                                        console.log(nextdate);
                                                        res.render("main/template",{
                                                            templateData:templateData,
                                                            prevdata:prevdata,
                                                            nextdate:nextdate,
                                                            comment:comment,
                                                            data:data
                                                        });
                                                    }
                                                })

                                            }
                                        });


                                    }
                                })
                            }
                        })
                    }

                })
            }
        })
    })




});
module.exports = router;


