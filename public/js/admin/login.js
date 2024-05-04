$("#btnSignIn").click(function () {
  let ac = $("#username-field").val();
  let pw = $("#password-field").val();
  $.post("/admin/login", { Account: ac, Password: pw }, function (data) {
    console.log(data);
    if (data.result != 1) {
      $("#message").css("color", "red");
      $("#message").css("text-align", "center");
      $("#message").css("font-style", "italic");
      $("#message").html(data.message);
    } else {
      setCookie("TOKEN", data.Token);
      window.location = "./admin/home";
    }
  });
});

$(".toggle-password").click(function () {
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    $(this).removeClass("fa-eye");
    $(this).addClass("fa-eye-slash");
    input.attr("type", "text");
  } else {
    $(this).removeClass("fa-eye-slash");
    $(this).addClass("fa-eye");
    input.attr("type", "password");
  }
});
