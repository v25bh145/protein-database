let mysql = require("../repositories/protein").Mysql();
let table = mysql.form("ptmis_table");
module.exports.getProteinsAll = function (req, res, next) {
    table.where("num_id", "0", ">=").select(function (err, data) {
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
    });
};
module.exports.getProteinsByKeyValue = function (req, res, next) {
    if (
        typeof req.query.type == "undefined" ||
        typeof req.query.value == "undefined"
    ) {
        res.status(400);
        res.send({
            error: true,
            message: "get参数缺失(type、value)",
        });
    } else {
        table
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
            });
    }
};
