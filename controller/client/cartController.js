module.exports = (app, router, objJSON) => {

    router.get("/cart", (req, res) => {
        return res.render("client/cart");
    })

    return app.use("/", router)
}