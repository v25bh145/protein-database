let express = require("express");
let router = express.Router();
let bilibiliController = require("../controllers/bilibiliController");

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

/* 用户接口 */
router.get("/departments", bilibiliController.getDepartments);
router.get("/ups100", bilibiliController.getUPs100);
router.get('/getVideoByUser', bilibiliController.getVideoByUserUID);
router.get('/getVideoByDepartment', bilibiliController.getVideoByTID);
router.get('/getDepartmentByDepartmentID', bilibiliController.getDepartmentByDepartmentID);
router.get('/getUserByID', bilibiliController.getUserByID);
router.get('/getUserByBV', bilibiliController.getUserByBV);

module.exports = router;
