let Mysql = require("mysql-builder-plus");

exports.init = function() {
    Mysql.setConfigPath("./config/connect.json");
}
exports.Mysql = function() {
    return Mysql;
}