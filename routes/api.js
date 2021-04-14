let express = require('express');
let router = express.Router();
let proteinController = require('../controllers/proteinController');

/*  DEVELOP ONLY */
router.get('/all', function(req, res, next) {
  let ans = {
    error: true,
    data: "hasn't any data yet...(测试用接口，发送全部数据)"
  };
  res.send(ans);
});

router.get("/proteins/all", proteinController.getProteinsAll);
router.get("/proteins/type-value", proteinController.getProteinsByKeyValue);

module.exports = router;
