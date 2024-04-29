var productInCart = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
if (productInCart == "" || !productInCart) {
    $("#totalCart").html(0)
} else {
    $("#totalCart").html(productInCart.length)
}