/**
 * Created by Administrator on 2017/7/25 0025.
 * 后台管理
 */

var express = require("express");
var router = express.Router();
var db = require("../db");

router.use(function(req,res,next){

    next();
});

/*
* 首页
* */
router.get("/",function(req,res,next){
    res.render("admin/index",{
        userInfo :req.userInfo
    });
});

/*
*  用户管理
* */
router.get("/user",function(req,res,next){
    /*
    * limit n,m 从第n条起，取m条， limit从0开始
    * 每页显示10条
    * */

    var page = Number(req.query.page || 1);
    var m = 10;
    var pages = 0;
    var searchUserAllSql = "select * from user";
    var n = 0;
    var count = 0;
    db.query(searchUserAllSql,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            count = result.length;
            // 计算总页数
            pages = Math.ceil(result.length / m);
            // 取值不能超过pages
            page = Math.min(page,pages);
            // 取值不能小于1
            page = Math.max(page,1);
            n = (page-1) * m;
            var searchUserSql = "select * from user limit "+ n +","+m ;
            db.query(searchUserSql,function (err,result) {
                if(err){
                    console.log("error:" + err.message);
                    return;
                }else{
                    res.render("admin/user",{
                        userInfo :req.userInfo,
                        users:result,
                        count:count,
                        m:m,
                        pages:pages,
                        page:page,
                        pagename:"user"
                    });
                }
            })
        }
    })
});

/*
* 分类管理页面
* */
router.get("/category",function(req,res,next){
    /*
     * limit n,m 从第n条起，取m条， limit从0开始
     * 每页显示10条
     * */

    var page = Number(req.query.page || 1);
    var m = 2;
    var pages = 0;
    var searchUserAllSql = "select * from article_classification";
    var n = 0;
    var count = 0;
    db.query(searchUserAllSql,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            count = result.length;
            // 计算总页数
            pages = Math.ceil(result.length / m);
            // 取值不能超过pages
            page = Math.min(page,pages);
            // 取值不能小于1
            page = Math.max(page,1);
            n = (page-1) * m;
            var searchUserSql = "select * from article_classification order by classification_id desc limit "+ n +","+m ;
            console.log(searchUserSql);
            db.query(searchUserSql,function (err,result) {
                if(err){
                    console.log("error:" + err.message);
                    return;
                }else{
                    res.render("admin/category",{
                        userInfo :req.userInfo,
                        articles:result,
                        count:count,
                        m:m,
                        pages:pages,
                        page:page,
                        pagename:"category"
                    });
                }
            })
        }
    })

});

/*
 * 添加分类页面(get)
 *
 * */
router.get("/category/add",function(req,res,next){
    res.render("admin/category_add",{
        userInfo : req.userInfo
    })

});

/*
 * 添加分类提交(post)
 *
 * */
router.post("/category/add",function(req,res,next){
    console.log(req.body);
    var name  = req.body.name || "";
    if(name == ""){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "名称不能为空"
        });
        return;
    };

    var searchArticlesql = "select * from article_classification WHERE classification='"+name+ "'";
    var addArticleClassificationsql = "INSERT INTO  article_classification(classification) values ('"+name+"')";
    db.query(searchArticlesql,function(err,result){
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            if(result.length > 0){
                res.render("admin/error",{
                    userInfo : req.userInfo,
                    message : "该分类已存在"
                });
            }else{
                db.query(addArticleClassificationsql,function (err,result) {
                    if(err){
                        console.log("error : "+ err.message);
                        return;
                    }else{
                        res.render("admin/success",{
                            userInfo : req.userInfo,
                            message : "分类保存成功",
                            url:"category"
                        });
                    }
                })
            }
        }
    })

});

/*-
 * 管理后台提示
 *
 * */
router.get("/error",function(req,res,next){
    res.render("admin/error",{
        userInfo : req.userInfo
    });
});

/*-
 * 管理后台提示
 *
 * */
router.get("/success",function(req,res,next){
    res.render("admin/success",{
        userInfo : req.userInfo,
    });
});

/*
 * 分类修改
 *
 * */
router.get("/category/edit",function(req,res,next){

    var id = req.query.id || "";
    var searchArticlesIdql = "select * from article_classification WHERE classification_id="+id+ "";
    console.log(searchArticlesIdql);
    db.query(searchArticlesIdql,function(err,result){
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            if(result.length <= 0){
                res.render("admin/error",{
                    userInfo : req.userInfo,
                    message : "分类信息不存在"
                });
                return;
            }else{
                res.render("admin/category_edit",{
                    userInfo : req.userInfo,
                    message : result[0].classification
                });
                return;
            }
        }
    })

});
/*
 * 分类修改保存
 *
 * */
router.post("/category/edit",function(req,res,next){
    var name = req.body.name;
    var id = req.query.id || "";
    console.log(id);
    var searchArticlesNameql = "select * from article_classification WHERE classification_id="+id+ "";
    var updateClassificationSql = "update article_classification set classification='" + name +"' where classification_id=" + id+ "";
    db.query(searchArticlesNameql,function(err,result){
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            if(result.length <= 0){
                res.render("admin/error",{
                    userInfo : req.userInfo,
                    message : "分类信息不存在"
                });
                return;
            }else{
                db.query(updateClassificationSql,function (err,result) {
                    if(err){
                        console.log("err:" + err.message);
                        return;
                    } else {
                        res.render("admin/success",{
                            userInfo : req.userInfo,
                            message : "分类修改成功",
                            url:"category"
                        });
                    }
                });
            }
        }
    })
});



/*
 * 分类删除
 *
 * */
router.get("/category/delete",function(req,res,next){
    var id = req.query.id || "";
    console.log(id);
    var searchArticlesNameql = "select * from article_classification WHERE classification_id="+id+ "";
    var deleteClassificationSql = "delete from article_classification where classification_id="+id+ "";
    db.query(searchArticlesNameql,function(err,result){
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            if(result.length <= 0){
                res.render("admin/error",{
                    userInfo : req.userInfo,
                    message : "分类信息不存在"
                });
                return;
            }else{
                db.query(deleteClassificationSql,function (err,result) {
                    if(err){
                        console.log("err:" + err.message);
                        return;
                    } else {
                        res.render("admin/success",{
                            userInfo : req.userInfo,
                            message : "删除成功",
                            url:"category"
                        });
                    }
                });
            }
        }
    })
});


/*
 * 文章管理首页
 *
 * */
router.get("/content",function (req,res,next) {
    /*
     * limit n,m 从第n条起，取m条， limit从0开始
     * 每页显示10条
     * */

    var page = Number(req.query.page || 1);
    var m = 2;
    var pages = 0;
    var searchAllArticleSql1 = "select * from article,article_classification where article.classification_id = article_classification.classification_id ";
    var n = 0;
    var count = 0;
    db.query(searchAllArticleSql1,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            count = result.length;
            // 计算总页数
            pages = Math.ceil(result.length / m);
            // 取值不能超过pages
            page = Math.min(page,pages);
            // 取值不能小于1
            page = Math.max(page,1);
            n = (page-1) * m;
            var searchAllArticleSql2 = "select * from article,article_classification where article.classification_id = article_classification.classification_id order by id desc limit "+ n +","+m;
            db.query(searchAllArticleSql2,function (err,result) {
                if(err){
                    console.log("error:" + err.message);
                    return;
                }else{
                    res.render("admin/content",{
                        userInfo :req.userInfo,
                        articles:result,
                        count:count,
                        m:m,
                        pages:pages,
                        page:page,
                        pagename:"content"
                    });
                }
            })

        }
    })
});

/*
* 添加文章 页面
* */
router.get("/content/add",function (req,res,next) {
    var getArticleClassificationsql = "select * from article_classification";
    db.query(getArticleClassificationsql,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            res.render("admin/content_add",{
                userInfo : req.userInfo,
                selectLi :result
            });
        }
    });

});

/*
* 添加文章接口
* */
router.post("/content/add",function (req,res,next) {
    var id = req.body.type;
    var title = req.body.title;
    var description = req.body.introduction;
    var content = req.body.content;
    var source = req.body.source;
    if(title == "" ){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入标题"
        });
        return;
    };
    console.log(req.body.content);
    if(content == ""){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入内容"
        });
        return;
    };
    if(description == ""){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入简介"
        });
        return;
    };

    var addArticleSql = "insert into article(classification_id,title,description,article,source) values ('"+ id+"','"+ title+"','" +description +"','"+ content+ "','" +source + "')";
    console.log(addArticleSql);
    db.query(addArticleSql,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else {
            res.render("admin/success",{
                userInfo : req.userInfo,
                message : "添加成功",
                url:"content"
            });
        }
    })

});

router.get("/content/edit",function (req,res,next) {
    var id = req.query.id || "";
    var searchArticlesIdql = "select * from article WHERE id="+id+ "";
    var allTypeSql = "select * from article_classification";
    var types = [];
    db.query(allTypeSql,function (err,result) {
         if(err){
             console.log("error:" + err.message);
             return;
         }else{
             types = result;
             db.query(searchArticlesIdql,function(err,result){
                 if(err){
                     console.log("error:" + err.message);
                     return;
                 }else{
                     if(result.length <= 0){
                         res.render("admin/error",{
                             userInfo : req.userInfo,
                             message : "分类信息不存在"
                         });
                         return;
                     }else{
                         res.render("admin/content_edit",{
                             userInfo : req.userInfo,
                             article : result[0],
                             types:types
                         });
                         return;
                     }
                 }
             })
         }
    });

});

/*
 * 文章修改保存
 *
 * */
router.post("/content/edit",function(req,res,next){
    var type_id = req.body.type;
    var id = req.query.id;
    var title = req.body.title;
    var description = req.body.introduction;
    var content = req.body.content;
    if(title == "" ){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入标题"
        });
        return;
    };
    console.log(req.body.content);
    if(content == ""){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入内容"
        });
        return;
    };
    if(description == ""){
        res.render("admin/error",{
            userInfo : req.userInfo,
            message : "请输入简介"
        });
        return;
    };


    console.log(id);
    var searchArticlesNameql = "select * from article WHERE id="+id+ "";
    var updateClassificationSql = "update article set classification_id='" + type_id + "',title='"+ title + "',description='"+ description+"',article='"+ content +"' where id=" + id ;
    db.query(searchArticlesNameql,function(err,result){
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            if(result.length <= 0){
                res.render("admin/error",{
                    userInfo : req.userInfo,
                    message : "分类信息不存在"
                });
                return;
            }else{
                db.query(updateClassificationSql,function (err,result) {
                    if(err){
                        console.log("err:" + err.message);
                        return;
                    } else {
                        res.render("admin/success",{
                            userInfo : req.userInfo,
                            message : "文章修改成功",
                            url:"content"
                        });
                    }
                });
            }
        }
    })
});

router.get("/content/delete",function (req,res,next) {
    var id =req.query.id || "";
    var delectAtricleSql = "delete from article where id=" + id;
    db.query(delectAtricleSql,function (err,result) {
        if(err){
            console.log("error:" + err.message);
            return;
        }else{
            res.render("admin/success",{
                userInfo : req.userInfo,
                message : "文章删除成功",
                url:"content"
            });
        }
    })
});






















module.exports = router;