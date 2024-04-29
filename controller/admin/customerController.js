module.exports = function (app, router, objJSON) {

    router.get("/admin/customer", (req, res) => {
        return res.send("Customer")
    })

    return app.use("/", router);
}