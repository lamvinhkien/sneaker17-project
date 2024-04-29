$(document).ready(() => {
    const clickImage = (id) => {
        $(document).on("click", id, () => {
            let srcImg = $(id).attr("src")
            $("#Avatar").attr("src", srcImg)
        })
    }
    clickImage("#detailAvatar1");
    clickImage("#detailAvatar2");
    clickImage("#detailAvatar3");
    clickImage("#detailAvatar4");
    clickImage("#detailAvatar5");
    clickImage("#detailAvatar6");
    clickImage("#detailAvatar7");
    clickImage("#detailAvatar8");

    $("input[type=radio]").on("change", () => {
        let size = $('input[name="choose-size"]:checked').val()
        $("#chooseSizeHid").val(size)
    })

    let productInCart = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    $("#idAddToCartProduct").on("click", () => {
        let idProduct = $("#idAddToCartProduct").val()
        let size = $("#chooseSizeHid").val()
        let checkProduct = productInCart.some(value => value.id === idProduct)
        let checkSize = productInCart.some(value => value.Size === size)

        if (!size) {
            $("#warningSize").html("Vui lòng chọn size sản phẩm")
        } else {
            $("#warningSize").html("")

            let product = {
                id: idProduct,
                Avatar: $("#avatarHid").val(),
                Name: $("#name ").val(),
                Type: $("#type").val(),
                Price: $("#price").val(),
                Size: size
            }

            if (!checkProduct || (checkProduct && !checkSize)) {
                productInCart.unshift({
                    ...product,
                    quantity: 1
                })
                localStorage.setItem("products", JSON.stringify(productInCart))
            } else {
                let getIndex = productInCart.findIndex(value => value.id === idProduct && value.Size === size)
                let product = productInCart.find(value => value.id === idProduct && value.Size === size)
                productInCart[getIndex] = {
                    ...product,
                    quantity: ++product.quantity
                }
                localStorage.setItem("products", JSON.stringify(productInCart))
            }
        }

        $("#totalCart").html(productInCart.length)
    })

    if (productInCart == "" || !productInCart) {
        $("#totalCart").html(0)
    } else {
        $("#totalCart").html(productInCart.length)
    }

})



