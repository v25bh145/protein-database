var express = require('express');
var router = express.Router();

/*  DEVELOP ONLY */
router.get('/all', function(req, res, next) {
  let ans = {
    error: true,
    data: "hasn't any data yet...(测试用接口，发送全部数据)"
  };
  res.send(ans);
});

module.exports = router;
