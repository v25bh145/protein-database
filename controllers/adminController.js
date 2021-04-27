let mysql = require("../repositories/protein").Mysql();
let md5 = require("md5-node");
let moment = require("moment");
let async = require("async");
exports.login = function (req, res, next) {
    let selectSql = mysql.form("users");
    selectSql
        .where("name", req.body.name)
        .where("password", req.body.password)
        .select(function (err, data) {
            if (err) {
                res.status(500).send({
                    error: true,
                    message: "服务器内部错误",
                });
                return;
            } else {
                let user = data[0];
                if (typeof user == "undefined" || typeof user == "null") {
                    res.status(401).send({
                        error: true,
                        message: "用户认证失败",
                    });
                    return;
                } else {
                    let token = req.body.name + moment().toString();
                    token = md5(token);
                    let days = 3;
                    let daysAfter = moment(moment() + 24 * 3600 * days * 1000);
                    let updateSql = mysql.form("users", {
                        id: user.id,
                        name: user.name,
                        token: token,
                        token_time_limit: daysAfter.format(
                            "YYYY-MM-DD HH:mm:ss",
                        ),
                    });
                    updateSql.where("id", user.id);
                    updateSql.update(function (err, data) {
                        if (err) {
                            console.log(err);
                            res.status(500).send({
                                error: true,
                                message: "服务器内部错误",
                            });
                            return;
                        } else {
                            res.send({
                                error: false,
                                token: token,
                            });
                            return;
                        }
                    });
                }
            }
        });
};
exports.logout = function (req, res, next) {
    let selectSql = mysql.form("users");
    selectSql.where("token", req.query.token).select(function (err, data) {
        if (err || typeof data[0] == "undefined") {
            res.status(401).send({
                error: true,
                message: "用户没有登录",
            });
            return;
        }
        let user = data[0];
        let limitDay = user["token_time_limit"];
        if (moment() >= limitDay) {
            res.status(401).send({
                error: true,
                message: "用户登录过期",
            });
            return;
        }
        let updateSql = mysql.form("users", {
            id: user.id,
            name: user.name,
            token: null,
            token_time_limit: null,
        });
        updateSql.where("id", user.id).update(function (err, data) {
            if (err) {
                res.status(500).send({
                    error: true,
                    message: "服务器内部错误",
                });
                return;
            }
            res.send({
                error: false,
                message: "登出成功",
            });
            return;
        });
    });
};
