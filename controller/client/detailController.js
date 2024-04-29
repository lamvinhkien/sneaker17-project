const Product = require("../../models/Product");
const formatMoney = (num) => {
    var p = num.toFixed(0).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (num != "-" && !(i % 3) ? "," : "") + acc;
    });
}

module.exports = (app, router, objJSON) => {

    router.post("/detail/:id", (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Không có sản phẩm" });
        } else {
            Product.findById(req.params.id)
                .then((data) => {
                    res.render("client/detail", {data: data, formatMoney: formatMoney});
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Trang chi tiết Error" });
                })
        }
    })

    return app.use("/", router)
}