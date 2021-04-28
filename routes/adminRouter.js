const { select } = require("async");
let express = require("express");
let router = express.Router();
let adminController = require("../controllers/adminController");
let moment = require("moment");
let mysql = require("../repositories/protein").Mysql();
/* middleware */
router.use(function (req, res, next) {
    res.set({
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Max-Age": 1728000,
        "Access-Control-Allow-Origin": req.headers.origin || "*",
        "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    });
    req.method === "OPTIONS" ? res.status(204).end() : next();
});
router.use(function (req, res, next) {
    if(req.url == "/login") {
        next();
        return;
    }
    if (typeof req.query.token == "undefined") {
        res.status(401).send({
            error: true,
            message: "没有权限",
        });
        return;
    }
    let token = req.query.token;
    let selectSql = mysql.form("users");
    selectSql.where("token", token).select(function (err, data) {
        if (err) {
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        let user = data[0];
        if (typeof user == "undefined" || typeof user == "null") {
            res.status(401).send({
                error: true,
                message: "用户没有登录",
            });
            return;
        }
        let limitDay = user["token_time_limit"];
        if (moment() >= moment(limitDay)) {
            res.status(401).send({
                error: true,
                message: "用户登录过期",
            });
            return;
        }
        next();
        return;
    });
});

/* 管理接口 */
router.post("/login", adminController.login);
router.get("/logout", adminController.logout);
router.post("/proteins", adminController.insertProtein);
router.put("/proteins", adminController.updateProtein);
router.delete("/proteins", adminController.deleteProtein);

module.exports = router;