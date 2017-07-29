/**
 * Created by Administrator on 2017/7/25 0025.
 * 数据库管理
 */

var mysql = require("mysql");

var client = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:"blog",
    port: 3306
});

// var client = mysql.createPool({
//     host: '47.93.52.252',
//     user: 'root',
//     password: '654321',
//     database:"blog",
//     port: 3306
// });

console.log("链接数据库");
function query(sql,callback){
    client.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}

exports.query = query;

// // 登录
// $sql = "SELECT * from user WHERE userName='chen' and password='123456' ";
// client.connect(function(error, results) {
//     if(error) {
//         console.log('Connection Error: ' + error.message);
//         return;
//     }
//     console.log('Connected to MySQL');
//     //监听端口
//
//
//
// });
// client.query($sql,function (err,result) {
//     if(err){
//         console.log('Connection Error: ' + error.message);
//         return;
//     }
//     if(result.length <= 0){
//         console.log("没有这条数据");
//     }else{
//         console.log("有这条数据");
//         console.log(result);
//     }
//
// })