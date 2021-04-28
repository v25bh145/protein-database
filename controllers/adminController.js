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
        if (moment() >= moment(limitDay)) {
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
            res.sendStatus(200);
            return;
        });
    });
};
exports.insertProtein = function (req, res, next) {
    let insertedData = {
        "Protein": req.body["Protein"],
        "Normal_localization": req.body["Normal_localization"],
        "Normal_localization_GO_ID": req.body["Normal_localization_GO_ID"],
        "Mislocalization": req.body["Mislocalization"],
        "Mislocalization_GO_ID": req.body["Mislocalization"],
        "Uniprot_Entry": req.body["Uniprot_Entry"],
        "Nucleotide_Sequences_FASTA": req.body["Nucleotide_Sequences_FASTA"],
        "GO_Molecular_function": req.body["GO_Molecular_function"],
        "GO_Cellular_component": req.body["GO_Cellular_component"],
        "GO_Biological_process": req.body["GO_Biological_process"],
        "Mislocalization_conditions": req.body["Mislocalization_conditions"],
        "Data_acquisition_method": req.body["Data_acquisition_method"],
        "Data_sources": req.body["Data_sources"]
    };
    let insertSql = mysql.form("ptmis_table", insertedData);
    insertSql.insert(function(err, data) {
        if (err) {
            res.status(500).send({
                error: true,
                message: "服务器内部错误",
            });
            return;
        }
        res.sendStatus(200);
        return;
    })
};
exports.deleteProtein = function (req, res, next) {
    let numId = req.query["num_id"];
    if(typeof numId == "undefined") {
        res.status(400);
        res.send({
            error: true,
            message: "get参数缺失(num_id)",
        });
        return;
    }
    let deleteSql = mysql.form("ptmis_table");
    deleteSql.where("num_id", numId).delete(function(err, data) {
        if(err) {
            res.status(400);
            res.send({
                error: true,
                message: "无数据",
            });
            return;
        }
        res.sendStatus(200);
        return;
    })
};
exports.updateProtein = function (req, res, next) {
    let numId = req.query["num_id"];
    if(typeof numId == "undefined") {
        res.status(400);
        res.send({
            error: true,
            message: "get参数缺失(num_id)",
        });
        return;
    }
    let updatedData = {
        "Protein": req.body["Protein"],
        "Normal_localization": req.body["Normal_localization"],
        "Normal_localization_GO_ID": req.body["Normal_localization_GO_ID"],
        "Mislocalization": req.body["Mislocalization"],
        "Mislocalization_GO_ID": req.body["Mislocalization"],
        "Uniprot_Entry": req.body["Uniprot_Entry"],
        "Nucleotide_Sequences_FASTA": req.body["Nucleotide_Sequences_FASTA"],
        "GO_Molecular_function": req.body["GO_Molecular_function"],
        "GO_Cellular_component": req.body["GO_Cellular_component"],
        "GO_Biological_process": req.body["GO_Biological_process"],
        "Mislocalization_conditions": req.body["Mislocalization_conditions"],
        "Data_acquisition_method": req.body["Data_acquisition_method"],
        "Data_sources": req.body["Data_sources"]
    };
    let updateSql = mysql.form("ptmis_table", updatedData);
    updateSql.where("num_id", numId).update(function(err, data) {
        if(err) {
            res.status(400);
            res.send({
                error: true,
                message: "更新失败: 请检查是否有此id的数据",
            });
            return;
        }
        res.sendStatus(200);
        return;
    })
};
