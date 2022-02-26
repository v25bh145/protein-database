let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let bilibiliRouter = require("./routes/bilibiliRouter");

let app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require("./repositories/bilibiliDB").init();

//路由
app.use("/api", bilibiliRouter);

// 404
app.use(function (req, res, next) {
    res.status(404);

    let ans = {
        error: true,
        data: "ERROR: Can't handle this request!",
    };
    res.send(ans);
});

// 错误处理 - 5xx
app.use(function (err, req, res, next) {
    // 开发模式
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);

    let ans = {
        error: true,
        data: "ERROR: Can't handle this request!",
    };
    res.send(ans);
});

app.listen(3000);

module.exports = app;
