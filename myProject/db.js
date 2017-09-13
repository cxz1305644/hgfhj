/**
 * Created by Administrator on 2017/7/25 0025.
 * 数据库管理
 */

var mysql = require("mysql");

var client = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '654321',
    database:"myTest",
    port: 3306
});

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

