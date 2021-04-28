let mysql = require("../repositories/protein").Mysql();
let Parser = require("json2csv").Parser;
let json2csvParser = new Parser();
exports.getProteinsAll = function (req, res, next) {
    mysql.form("ptmis_table").where("num_id", "0", ">=").select(function (err, data) {
        if (err) {
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        res.send({
            error: false,
            message: {
                num: data.length,
                info: data,
            },
        });
        return;
    });
};
exports.getProteinsByKeyValue = function (req, res, next) {
    if (
        typeof req.query.type == "undefined" ||
        typeof req.query.value == "undefined"
    ) {
        res.status(400);
        res.send({
            error: true,
            message: "get参数缺失(type、value)",
        });
        return;
    } else {
        mysql.form("ptmis_table")
            .where("protein", req.query.type, "=")
            .where("Normal_localization", req.query.type, "=", "or")
            .where("Mislocalization", req.query.type, "=", "or")
            .where("Normal_localization_GO_ID", req.query.value, "=", "and")
            .where("Mislocalization_GO_ID", req.query.value, "=", "or")
            .select(function (err, data) {
                if (err) {
                    res.status(500).send({
                        error: true,
                        message: "服务器内部错误",
                    });
                }
                res.send({
                    error: false,
                    message: {
                        num: data.length,
                        info: data,
                    },
                });
                return;
            });
    }
};
exports.getProteins = function (req, res, next) {
    if (
        typeof req.body.perPage == "undefined" ||
        typeof req.body.page == "undefined"
    ) {
        res.status(400);
        res.send({
            error: true,
            message: "post参数缺失(perPage, page)",
        });
        return;
    } else {
        let sql = mysql.form("ptmis_table");
        let prop, val, op, rel;
        if (typeof req.body.conditions != "undefined") {
            //条件查询
            for (index in req.body.conditions) {
                let condition = req.body.conditions[index];
                [prop, val, op, rel] = [
                    condition.prop,
                    condition.val,
                    condition.op,
                    condition.rel,
                ];
                sql = sql.where(prop, val, op, rel);
            }
        }
        
        //按页返回信息
        sql.limit(req.body.perPage * req.body.page + req.body.perPage)
            .orderBy("num_id")
            .select(function (err, data) {
                if (err) {
                    res.status(500).send({
                        error: true,
                        message: "服务器内部错误",
                    });
                } else {
                    let st = req.body.perPage * req.body.page - req.body.perPage,
                        ed;
                    if (st >= data.length) {
                        //请求的页无数据
                        res.send({
                            error: false,
                            message: {
                                num: 0,
                                info: [],
                            },
                        });
                        return;
                    } else if (
                        req.body.perPage * req.body.page >=
                        data.length
                    ) {
                        //请求的页数据填不满
                        ed = data.length;
                    } else {
                        //请求的页数据填满
                        ed =
                            req.body.perPage * req.body.page;
                    }
                    let resArr = data.slice(st, ed);
                    res.send({
                        error: false,
                        message: {
                            num: ed - st,
                            info: resArr,
                        },
                    });
                    return;
                }
            });
    }
};
exports.getProteinsFile = function(req, res, next) {
    mysql.form("ptmis_table").where("num_id", "0", ">=").select(function (err, data) {
        if (err || typeof data == "undefined") {
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        let csv = json2csvParser.parse(data);
        res.set({
            'Content-Type': 'application/octet-stream; charset=utf-8',
            'Content-Disposition': 'attachment; filename=' + 'proteins'+'.csv',
            'Content-Length': csv.length
          });
        res.send(csv);
        return;
    });
}