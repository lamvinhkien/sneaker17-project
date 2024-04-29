const formatMoney = (num) => {
    var p = num.toFixed(0).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (num != "-" && !(i % 3) ? "," : "") + acc;
    });
}

const templateProduct = (key, page) => {
    $.ajax({
        url: "/products/list/" + key + "?page=" + page
    })
        .then((data) => {
            $("#loadProducts").html("");
            data.products.forEach(function (p) {
                var price = formatMoney(p.Price);
                var id = p._id;
                $("#loadProducts").append(`
                    <form action="/detail/`+ id + `" method="POST" id="`+id+`" class="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4">
                        <a href="#" onclick="document.getElementById('`+id+`').submit();">
                            <div class="Img">
                                <img src="./upload/`+ p.Avatar + `" alt="">
                            </div>
                            <div class="value">
                                <div class="Name">
                                    `+ p.Name + `
                                </div>
                            </div>
                            <div class="value">
                                <div class="BrandAndType">
                                    ` + p.Type + `
                                </div>
                            </div>
                            <div class="value">
                                <div class="Price">
                                    `+ price + `<sup>đ</sup>
                                </div>
                            </div>
                        </a>    
                    </form>
            `)
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

const eventTemplateProduct = (event, idInput, routeName) => {
    $(document).on(event, idInput, function () {
        templateProduct(routeName, 1);
        $("#paging").pagination({
            dataSource: "/products/list/" + routeName + "?page=1",
            locator: "products",
            totalNumberLocator: function (response) {
                return response.total
            },

            pageSize: 8,
            afterPageOnClick: function (event, pageNumber) {
                templateProduct(routeName, pageNumber);
            },
            afterNextOnClick: function (event, pageNumber) {
                templateProduct(routeName, pageNumber);
            },
            afterPreviousOnClick: function (event, pageNumber) {
                templateProduct(routeName, pageNumber);
            },
        })
    })
}

templateProduct("all", 1);
eventTemplateProduct("click", "#sanpham", "all")
eventTemplateProduct("click", "#giamdan", "sortDecrease")
eventTemplateProduct("click", "#tangdan", "sortAscending")
eventTemplateProduct("click", "#lt1m", "lt1m")
eventTemplateProduct("click", "#1mto1m5", "1mto1m5")
eventTemplateProduct("click", "#1m5to2m", "1m5to2m")
eventTemplateProduct("click", "#2mto2m5", "2mto2m5")
eventTemplateProduct("click", "#2m5to3m", "2m5to3m")
eventTemplateProduct("click", "#gte3m", "gte3m")
eventTemplateProduct("click", "#giaynam", "giaynam")
eventTemplateProduct("click", "#giaynu", "giaynu")
eventTemplateProduct("click", "#depnam", "depnam")
eventTemplateProduct("click", "#depnu", "depnu")

$("#paging").pagination({
    dataSource: "/products/list/all?page=1",
    locator: "products",
    totalNumberLocator: function (response) {
        return response.total
    },

    pageSize: 8,
    afterPageOnClick: function (event, pageNumber) {
        templateProduct("all", pageNumber);
    },
    afterNextOnClick: function (event, pageNumber) {
        templateProduct("all", pageNumber);
    },
    afterPreviousOnClick: function (event, pageNumber) {
        templateProduct("all", pageNumber);
    },
})

let productInCart = JSON.parse(localStorage.getItem("products"))
if(productInCart == [] || !productInCart){
    $("#totalCart").html(0)
} else {
    $("#totalCart").html(productInCart.length)
}




