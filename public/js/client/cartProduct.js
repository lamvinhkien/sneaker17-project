var productInCart = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
var totalMoneyInCart = JSON.parse(localStorage.getItem("totalMoney"))

renderProduct()
totalMoney()
setCartLength()

function renderProduct() {
    if (!productInCart || productInCart == "") {
        $("#contentCart").html("")
        $("#contentCart").html(`
            <div class="col-12 cartNone">
                <div class="mb-3">
                    <img src="/image/Order/empty-cart.webp" alt="" width="6%" />
                </div>
                <div class="textNone">
                    Bạn đang không có sản phẩm nào trong giỏ hàng!
                </div>
                <hr>
                <div>
                    <a href="/" class="btn btn-dark">QUAY LẠI MUA HÀNG</a>
                </div>
            </div>
        `)
    } else {
        $("#loadProductInCart").html("")
        productInCart.map((p, index) => {
            $("#loadProductInCart").append(`
                    <div class="content">
                        <div class="avatar">
                            <img src="`+ p.Avatar + `" alt="">
                        </div>
                        <div class="info">
                            <div class="name box">
                                `+ p.Name + `
                            </div>
                            <div class="type box">
                                `+ p.Type + `
                            </div>
                            <div class="size box">
                                `+ p.Size + `
                            </div>
                            <div class="quantity box">
                                Số lượng: <button onclick='plusQuantity(${index})' class="btn btn-outline-secondary"><i class="fa-solid fa-plus"></i></button> &nbsp; ` + p.quantity + ` &nbsp; <button onclick="minusQuantity(${index}, ${p.quantity})" class="btn btn-outline-secondary"><i class="fa-solid fa-minus"></i></button>
                            </div>
                            <div class="price">
                                `+ formatMoney(p.quantity * p.Price) + `<sup>đ</sup>
                            </div>
                        </div>
                        <div class="actionCart box">
                            <button class="btn"><i class="fa-regular fa-heart"></i></button>
                            <button onclick="deleteProductInCart(${index})" class="btn"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </div>
                    <hr>
                `)
        })
    }

}

function setCartLength() {
    if (productInCart == "" || !productInCart) {
        $("#totalCart").html(0)
    } else {
        $("#totalCart").html(productInCart.length)
    }
}

function totalMoney() {
    if (!productInCart || productInCart == "") {
        $("#testMoney").html(0 + `<sup>đ</sup>`)
        $("#totalMoney").html(0 + `<sup>đ</sup>`)
    } else {
        let total = 0;
        productInCart.map((p) => {
            total += p.quantity * p.Price
        })
        $("#testMoney").html(formatMoney(total) + `<sup>đ</sup>`)
        $("#totalMoney").html(formatMoney(total) + `<sup>đ</sup>`)
        localStorage.setItem("totalMoney", JSON.stringify(total))
    }
}

function deleteProductInCart(index) {
    productInCart.splice(index, 1)
    localStorage.setItem("products", JSON.stringify(productInCart))
    renderProduct()
    totalMoney()
    setCartLength()
}

function plusQuantity(index) {
    productInCart[index] = {
        ...productInCart[index],
        quantity: ++productInCart[index].quantity
    }
    localStorage.setItem("products", JSON.stringify(productInCart))
    totalMoney()
    renderProduct()
}

function minusQuantity(index, quantity) {
    if (quantity > 1) {
        productInCart[index] = {
            ...productInCart[index],
            quantity: --productInCart[index].quantity
        }
        localStorage.setItem("products", JSON.stringify(productInCart))
        renderProduct()
        totalMoney()
    } else {
        alert("Sản phẩm phải có số lượng lớn hơn 0.")
    }

}

function formatMoney(num) {
    var p = num.toFixed(0).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (num != "-" && !(i % 3) ? "," : "") + acc;
    });
}
