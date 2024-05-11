var productInCart = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
var totalMoneyInCart = JSON.parse(localStorage.getItem("totalMoney"))
var myBank = {
  BANK_ID: "MB",
  ACCOUNT_NO: "0329149822"
}
var citis = document.getElementById("city");
var districts = document.getElementById("district");
var wards = document.getElementById("ward");
var Parameter = {
  url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
  method: "GET",
};
var promise = axios(Parameter);
promise.then(function (result) {
  renderCity(result.data);
});

renderOrder()
$("#txtHoTen").on("change", validateName)
$("#txtEmail").on("change", validateEmail)
$("#txtSDT").on("change", validatePhoneNumber)
$("#txtDiaChi").on("change", validateAddress)
$("#city").on("change", validateCity)
$("#district").on("change", validateDistrict)
$("#ward").on("change", validateWard)
warningRadio("shipMethod", "#warningRadio1")
warningRadio("paymentMethod", "#warningRadio2")
expressSaigon()
getValueShipMethod()
getValuePaymentMethod()
handleCompleteOrder()

function handleCompleteOrder() {
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
    let totalOrder = $("#totalOrder2").val()

    if (name == "" || phoneNumber == "" || email == "" || address == "" || city == "" || district == "" || ward == "" || shipMethod == "" || paymentMethod == "") {
      submitWarningText("#txtHoTen", "#validate-name", "Vui lòng nhập tên!")
      submitWarningText("#txtSDT", "#validate-phoneNumber", "Vui lòng nhập số điện thoại!")
      submitWarningText("#txtEmail", "#validate-email", "Vui lòng nhập Email!")
      submitWarningText("#txtDiaChi", "#validate-address", "Vui lòng nhập địa chỉ!")
      submitWarningText("#city", "#validate-city", "Vui lòng chọn tỉnh thành!")
      submitWarningText("#district", "#validate-district", "Vui lòng chọn quận huyện!")
      submitWarningText("#ward", "#validate-ward", "Vui lòng chọn phường xã!")
      submitWarningRadio("#shipMethodHid", "#warningRadio1", "giao hàng")
      submitWarningRadio("#paymentMethodHid", "#warningRadio2", "thanh toán")
    } else {
      if (paymentMethod == "QR Code") {
        let description = randomString(10) + " " + phoneNumber

        disableInput()
        $("#qrImg").attr("src", `https://img.vietqr.io/image/${myBank.BANK_ID}-${myBank.ACCOUNT_NO}-compact2.png?amount=${totalOrder}&addInfo=${description}`)
        $("#qr-code").css("display", "block")

        setInterval(() => {
          checkPaid(totalOrder, description)
        }, 500)

      } else {
        sendToAdmin("Chưa xác nhận")
      }
    }
  })
}

async function checkPaid(totalOrder, description) {
  try {
    const respone = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=CsZYG4eq_EPJetvZsJD0espYTLyqQIhc85u7eWmiU9EK7xT0DC9t52mPZ_Qckh1TFfkci2PvxvI3mGr2nXYcoMqeaYy7U03Wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLFUvPrSqyPKAKhMhoTtt889xiVVi3hFhGfqB_DDRig5ubGN7HSfJgvGpwYICpWASzDs_6u6nHPc-4IFq3koQm28cv7vWJ9jUQ&lib=MPj5bqeMWIdbPHjBi6wXjKmu7Nkt9jO2A")
    const data = await respone.json()
    const lastPaid = data.data[data.data.length - 1]
    lastPrice = lastPaid["Price"]
    lastDescription = lastPaid["Description"]
    if (lastPrice >= totalOrder && lastDescription.includes(description)) {
      sendToAdmin("Đã thanh toán QR Code")
    } else {
      console.log("Không thành công")
    }
  } catch {
    console.log("Error")
  }
}

function sendToAdmin(orderStatus) {
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
    Products: productInCart,
    TotalOrder: $("#totalOrder2").val(),
    OrderStatus: orderStatus
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

function getValueShipMethod() {
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
}

function getValuePaymentMethod() {
  $("input[type=radio][name=paymentMethod]").on("change", () => {
    let paymentMethod = $('input[name="paymentMethod"]:checked').val()
    $("#paymentMethodHid").val(paymentMethod)
    renderOrder()
  })
}

function disableInput() {
  $("#disabled-form").prop("disabled", "disabled")
}

function expressSaigon() {
  $("#city").on("change", () => {
    let city = $("#city").val()
    if (city != "Thành phố Hồ Chí Minh") {
      $(".express-saigon").attr("disabled", "disabled")
    } else {
      $(".express-saigon").removeAttr("disabled")
    }
  })
}

function formatMoney(num) {
  var p = num.toFixed(0).split(".");
  return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
    return num + (num != "-" && !(i % 3) ? "," : "") + acc;
  });
}

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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

function submitWarningText(id, validateId, message) {
  if ($(id).val() == "") {
    $(validateId).html(message)
    $(id).addClass("border-danger")
  }
}

function submitWarningRadio(id1, id2, note) {
  if ($(id1).val() == "") {
    $(id2).html("Vui lòng chọn phương thức " + note + "!").addClass("text-danger fst-italic text-center")
  } else {
    $(id2).html("").removeClass("text-danger")
  }
}

function validateEmail() {
  let message = $("#validate-email");
  let email = $("#txtEmail")

  if (email.val() == "") {
    message.html("Vui lòng nhập Email!")
    email.addClass("border-danger")
  } else if (!formatEmail(email.val())) {
    message.html("Email không hợp lệ!")
    email.addClass("border-danger")
  } else {
    message.html("")
    email.removeClass("border-danger")
    email.addClass("border-success")
  }
}

function formatEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

function validatePhoneNumber() {
  let message = $("#validate-phoneNumber");
  let phoneNo = $("#txtSDT")

  if (phoneNo.val() == "") {
    message.html("Vui lòng nhập số điện thoại!")
    phoneNo.addClass("border-danger")
  } else if (!formatPhoneNumber(phoneNo.val())) {
    message.html("Số điện thoại không hợp lệ!")
    phoneNo.addClass("border-danger")
  } else {
    message.html("")
    phoneNo.removeClass("border-danger")
    phoneNo.addClass("border-success")
  }
}

function formatPhoneNumber(phoneNo) {
  return phoneNo.match(
    /(0[3|5|7|8|9])+([0-9]{8})\b/g
  )
}

function validateName(){
  let message = $("#validate-name");
  let name = $("#txtHoTen")

  if (name.val() == "") {
    message.html("Vui lòng nhập tên!")
    name.addClass("border-danger")
  } else if (!formatName(name.val())) {
    message.html("Tên không hợp lệ!")
    name.addClass("border-danger")
  } else {
    message.html("")
    name.removeClass("border-danger")
    name.addClass("border-success")
  }
}

function formatName(name){
  return name.match(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ'\s]*$/
  )
}

function validateAddress(){
  let message = $("#validate-address");
  let address = $("#txtDiaChi")

  if (address.val() == "") {
    message.html("Vui lòng nhập địa chỉ!")
    address.addClass("border-danger")
  } else {
    message.html("")
    address.removeClass("border-danger")
    address.addClass("border-success")
  }
}

function validateCity(){
  let message = $("#validate-city");
  let city = $("#city")

  if (city.val() != "") {
    message.html("")
    city.removeClass("border-danger")
    city.addClass("border-success")
  } else {
    city.addClass("border-danger")
    message.html("Vui lòng chọn tỉnh thành!")
  }
}

function validateDistrict(){
  let message = $("#validate-district");
  let district = $("#district")

  if (district.val() != "") {
    message.html("")
    district.removeClass("border-danger")
    district.addClass("border-success")
  } else {
    district.addClass("border-danger")
    message.html("Vui lòng chọn quận huyện!")
  }
}

function validateWard(){
  let message = $("#validate-ward");
  let ward = $("#ward")

  if (ward.val() != "") {
    message.html("")
    ward.removeClass("border-danger")
    ward.addClass("border-success")
  } else {
    ward.addClass("border-danger")
    message.html("Vui lòng chọn phường xã!")
  }
}

function warningRadio(name, id2) {
  $(`input[name=${name}]`).on("change", () => {
    $(id2).html("").removeClass("text-danger")
  })
}