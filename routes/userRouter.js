let express = require("express");
let router = express.Router();
let proteinController = require("../controllers/proteinController");

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

/*  DEVELOP ONLY */
router.get("/all", function (req, res, next) {
    let ans = {
        error: true,
        data: "hasn't any data yet...(测试用接口，发送全部数据)",
    };
    res.send(ans);
});
/* 测试接口 */
router.get("/proteins/all", proteinController.getProteinsAll);
router.get("/proteins/type-value", proteinController.getProteinsByKeyValue);

/* 用户接口 */
router.post("/proteins", proteinController.getProteins);
router.get("/proteins/file", proteinController.getProteinsFile);

module.exports = router;
