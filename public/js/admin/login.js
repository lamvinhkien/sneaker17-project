$(document).ready(function(){
    $("#btnSignIn").click(function(){
      var ac = $("#floatingInput").val();
      var pw = $("#floatingPassword").val();
      $.post("/admin/login", {Account: ac, Password:pw}, function(data){
        console.log(data);
        if(data.result!=1){
            $("#message").css("color", "red");
            $("#message").css("text-align", "center");
            $("#message").html(data.message);
        }else{
            setCookie("TOKEN", data.Token);
            window.location = "./admin/home";
        }
      });
    });
});
