var productInCart = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
var totalMoneyInCart = JSON.parse(localStorage.getItem("totalMoney"))
var myBank = {
  BANK_ID: "MB",
  ACCOUNT_NO: "0329149822"
}

renderOrder()
warningText("#txtHoTen")
warningText("#txtSDT")
warningText("#txtEmail")
warningText("#txtDiaChi")
warningText("#city")
warningText("#district")
warningText("#ward")
warningRadio("shipMethod", "#warningRadio1")
warningRadio("paymentMethod", "#warningRadio2")

$("input[type=radio][name=shipMethod]").on("change", () => {
  let shipMoney = parseInt($('input[name="shipMethod"]:checked').val())
  $("#shipMoneyHid").val(shipMoney)
  if (shipMoney == 30000) {
    $("#shipMethodHid").val("Tiêu chuẩn")
  } else if (shipMoney == 60000) {
    $("#shipMethodHid").val("Hoả tốc")
  }
  renderOrder()
})

$("input[type=radio][name=paymentMethod]").on("change", () => {
  let paymentMethod = $('input[name="paymentMethod"]:checked').val()
  $("#paymentMethodHid").val(paymentMethod)
  renderOrder()
})

$("#completeOrder").on("click", () => {
  let name = $("#txtHoTen").val()
  let phoneNumber = $("#txtSDT").val()
  let email = $("#txtEmail").val()
  let address = $("#txtDiaChi").val()
  let city = $("#city").val()
  let district = $("#district").val()
  let ward = $("#ward").val()
  let shipMethod = $("#shipMethodHid").val()
  let paymentMethod = $("#paymentMethodHid").val()
  let note = $("#note").val()
  let products = productInCart
  let totalOrder = $("#totalOrder2").val()

  if (name == "" || phoneNumber == "" || email == "" || address == "" || city == "" || district == "" || ward == "" || shipMethod == "" || paymentMethod == "") {
    submitWarningText("#txtHoTen")
    submitWarningText("#txtSDT")
    submitWarningText("#txtEmail")
    submitWarningText("#txtDiaChi")
    submitWarningText("#city")
    submitWarningText("#district")
    submitWarningText("#ward")
    submitWarningRadio("#shipMethodHid", "#warningRadio1", "giao hàng")
    submitWarningRadio("#paymentMethodHid", "#warningRadio2", "thanh toán")
  } else {
    if(paymentMethod == "QR Code"){
      disableInput()
      $("#qrImg").attr("src", `https://img.vietqr.io/image/${myBank.BANK_ID}-${myBank.ACCOUNT_NO}-compact2.png?amount=${totalOrder}`)
      $("#qr-code").css("display", "block")
    }
  }

})

function sendToAdmin() {
  $.post("/create-new-order", {
    Name: $("#txtHoTen").val(),
    PhoneNumber: $("#txtSDT").val(),
    Email: $("#txtEmail").val(),
    Address: $("#txtDiaChi").val(),
    City: $("#city").val(),
    District: $("#district").val(),
    Ward: $("#ward").val(),
    ShipMethod: $("#shipMethodHid").val(),
    PaymentMethod: $("#paymentMethodHid").val(),
    Note: $("#note").val(),
    Products: productInCart,
    TotalOrder: $("#totalOrder2").val()
  }, (data) => {
    if (data.result == 1) {
      localStorage.setItem("products", JSON.stringify([]))
      localStorage.setItem("totalMoney", 0)
      window.location = "/order-success"
    }
  })
}

function renderOrder() {
  if (!productInCart || productInCart == "") {
    $("#totalCart").html(0)
    $("#orderContent").html("")
    $("#orderContent").html(`
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
    $("#totalCart").html(productInCart.length)
    $("#orderProductFromCart").html("")
    productInCart.map((value, index) => {
      $("#orderProductFromCart").append(`
          <div class="info mt-4">
            <div class="float-left">
              <span class="text1">${value.Name}</span>
              <div class="clear"></div>
              <span class="float-left">${value.Size}</span>
              <span class="float-right">x${value.quantity}</span>
            </div>
            <span class="float-right" id="testMoney">${formatMoney(value.quantity * value.Price)}<sup>đ</sup></span>
          </div>
          <div class="clear"></div>
      `)

      let shipMoney = parseInt($("#shipMoneyHid").val())
      $("#totalMoney").html(formatMoney(totalMoneyInCart) + `<sup>đ</sup>`)
      $("#shipMoney").html(formatMoney(shipMoney) + `<sup>đ</sup>`)
      $("#totalOrder").html(formatMoney(totalMoneyInCart + shipMoney) + `<sup>đ</sup>`)
      $("#totalOrder2").val(totalMoneyInCart + shipMoney)
    })
  }

}

function warningText(id) {
  $(id).on("change", () => {
    if ($(id).val() == "") {
      $(id).addClass("border-danger")
    } else {
      $(id).removeClass("border-danger")
    }
  })
}

function submitWarningText(id) {
  if ($(id).val() == "") {
    $(id).addClass("border-danger")
  } else {
    $(id).removeClass("border-danger")
  }
}

function warningRadio(name, id2){
  $(`input[name=${name}]`).on("change", () => {
    $(id2).html("").removeClass("text-danger")
  })
}

function submitWarningRadio(id1, id2, note) {
  if ($(id1).val() == "") {
    $(id2).html("Vui lòng chọn phương thức " + note + "!").addClass("text-danger fst-italic text-center")
  } else {
    $(id2).html("").removeClass("text-danger")
  }
}

function disableInput(){
  $("#disabled-form").prop("disabled", "disabled")
}

function formatMoney(num) {
  var p = num.toFixed(0).split(".");
  return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
    return num + (num != "-" && !(i % 3) ? "," : "") + acc;
  });
}


// Select Option TP - QUẬN - HUYỆN
var citis = document.getElementById("city");
var districts = document.getElementById("district");
var wards = document.getElementById("ward");
var Parameter = {
  url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
  method: "GET",
  responseType: "application/json",
};
var promise = axios(Parameter);
promise.then(function (result) {
  renderCity(result.data);
});
function renderCity(data) {
  for (const x of data) {
    citis.options[citis.options.length] = new Option(x.Name, x.Name);
  }
  citis.onchange = function () {
    district.length = 1;
    ward.length = 1;
    if (this.value != "") {
      const result = data.filter(n => n.Name === this.value);

      for (const k of result[0].Districts) {
        district.options[district.options.length] = new Option(k.Name, k.Name);
      }
    }
  };
  district.onchange = function () {
    ward.length = 1;
    const dataCity = data.filter((n) => n.Name === citis.value);
    if (this.value != "") {
      const dataWards = dataCity[0].Districts.filter(n => n.Name === this.value)[0].Wards;

      for (const w of dataWards) {
        wards.options[wards.options.length] = new Option(w.Name, w.Name);
      }
    }
  };
}


