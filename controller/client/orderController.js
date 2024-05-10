const Order = require("../../models/Order.js");
const moment = require("moment")

module.exports = (app, router, objJSON) => {

    router.get("/order", (req, res) => {
        return res.render("client/order");
    })

    router.get("/order-success", (req, res) => {
        return res.render("client/order-success");
    })

    router.post("/create-new-order", (req, res) => {
        if (!req.body.Name || !req.body.PhoneNumber || !req.body.Email || !req.body.Address
            || !req.body.City || !req.body.District || !req.body.Ward || !req.body.ShipMethod
            || !req.body.PaymentMethod) {
            res.json({ result: 0, message: "Vui lòng nhập đầy đủ thông tin" })
        } else {

            let newOrder = new Order({
                Name: req.body.Name,
                PhoneNumber: req.body.PhoneNumber,
                Email: req.body.Email,
                Address: req.body.Address,
                City: req.body.City,
                District: req.body.District,
                Ward: req.body.Ward,
                ShipMethod: req.body.ShipMethod,
                PaymentMethod: req.body.PaymentMethod,
                Products: req.body.Products,
                TotalOrder: req.body.TotalOrder,
                OrderDate: moment(Date.now()).format("DD-MM-YYYY hh:mm A"),
                OrderStatus: req.body.OrderStatus
            })

            newOrder.save()
                .then((data) => {
                    res.json({result: 1, message: "Đặt hàng thành công", order: data})
                })
                .catch((err) => {
                    res.json({ message: "Lưu thông tin không thành công" })
                })
        }
    })

    return app.use("/", router)
}