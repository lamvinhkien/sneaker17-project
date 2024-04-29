$(document).ready(function () {

    $("#btnLogout").click(() => {
        let token = getCookie("TOKEN")
        $.post("/admin/logout", { Token: token }, (data) => {
            if (data.result === 1) {
                window.location = "/admin"
            } else {
                alert("Thoát không thành công!")
            }
        })
    })

})