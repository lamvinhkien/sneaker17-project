const Order = require("../../models/Order.js")
const Token = require("../../models/Token.js")
const checkLogin = (req, res, next) => {
    if (req.cookies.TOKEN == undefined || req.cookies.TOKEN == "") {
        res.redirect("/admin");
    } else {
        var token = req.cookies.TOKEN;
        Token.findOne({ Token: token, Status: true })
            .then((data) => {
                if (data.Token == token) {
                    next()
                } else {
                    res.redirect("/admin");
                }
            })
            .catch((err) => {
                res.redirect("/admin");
            })
    }
}
const formatMoney = (num) => {
    var p = num.toFixed(0).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (num != "-" && !(i % 3) ? "," : "") + acc;
    });
}
module.exports = function (app, router, objJSON) {

    router.get("/admin/order", checkLogin, (req, res) => {
        Order.find()
            .then((orders) => {
                res.render("admin/order", { data: orders })
            })
            .catch(() => {
                res.json({ result: 0, message: "Err find Order" })
            })
    })

    router.get("/admin/detail-order/:id", checkLogin, (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Err findById Order" })
        } else {
            Order.findById(req.params.id)
                .then((order) => {
                    res.render("admin/detail-order", { data: order, formatMoney: formatMoney })
                })
                .catch(() => {
                    res.json({ result: 0, message: "Err findById Order" })
                })
        }
    })

    router.post("/admin/update-order/:id", checkLogin, (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Không tìm thấy sản phẩm" })
        } else {
            Order.findByIdAndUpdate(req.params.id, {
                OrderStatus: req.body.OrderStatus
            })
                .then((data) => {
                    res.redirect("/admin/order")
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Cập nhật thất bại", Lỗi: err });
                })
        }
    })

    router.post("/admin/delete-order/:id", checkLogin, (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Không tìm thấy sản phẩm" })
        } else {
            Order.findByIdAndDelete(req.params.id)
                .then((data) => {
                    res.redirect("/admin/order")
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Xoá thất bại", Lỗi: err });
                })
        }
    })

    return app.use("/", router);
}