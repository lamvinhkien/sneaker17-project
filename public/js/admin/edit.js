$(document).ready(function () {
    const handleCheckSize = (size) => {
        let sizeValue = $("#size" + size).val()
        if (sizeValue != "") {
            $("#size" + size).prop("checked", true)
        } else {
            $("#size" + size).prop("checked", false)
        }

        $("#size" + size).on("change", function () {
            let checkSize = $(this).prop("checked")
            if (checkSize === true) {
                $("#size" + size).val(size)
            } else {
                $("#size" + size).val(null)
            }
        })
    }
    handleCheckSize(35)
    handleCheckSize(36)
    handleCheckSize(37)
    handleCheckSize(38)
    handleCheckSize(39)
    handleCheckSize(40)
    handleCheckSize(41)
    handleCheckSize(42)
    handleCheckSize(43)
    handleCheckSize(44)
    handleCheckSize(45)
    handleCheckSize(46)

    const uploadImage = (eventMain, src, eventHide, label, showImg) => {
        $("#" + eventMain).change(function () {
            var data = new FormData();
            jQuery.each(jQuery('#' + eventMain)[0].files, function (i, file) {
                data.append(eventMain, file);
            });

            jQuery.ajax({
                url: src,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
                success: function (data) {
                    if (data.result == 1) {
                        $("#" + eventHide).val(data.fileName)
                        $("#" + label).html(data.fileName)
                        $("#" + showImg).attr("src", "/upload/" + data.fileName)
                    } else {
                        alert("Tải hình ảnh thất bại");
                    }
                }
            });
        })
    }

    uploadImage("Avatar", "/avatar", "avatarHide", "labelAvatar", "showAvatar")
    uploadImage("detailAvatar1", "/detail-avatar-1", "detailAvatarHide1", "labelDetail1", "showDetail1")
    uploadImage("detailAvatar2", "/detail-avatar-2", "detailAvatarHide2", "labelDetail2", "showDetail2")
    uploadImage("detailAvatar3", "/detail-avatar-3", "detailAvatarHide3", "labelDetail3", "showDetail3")
    uploadImage("detailAvatar4", "/detail-avatar-4", "detailAvatarHide4", "labelDetail4", "showDetail4")
    uploadImage("detailAvatar5", "/detail-avatar-5", "detailAvatarHide5", "labelDetail5", "showDetail5")
    uploadImage("detailAvatar6", "/detail-avatar-6", "detailAvatarHide6", "labelDetail6", "showDetail6")
    uploadImage("detailAvatar7", "/detail-avatar-7", "detailAvatarHide7", "labelDetail7", "showDetail7")
    uploadImage("detailAvatar8", "/detail-avatar-8", "detailAvatarHide8", "labelDetail8", "showDetail8")

    $("#txtPrice").each((i, ele) => {
        let clone = $(ele).clone(false)
        clone.attr("type", "text")
        let ele1 = $(ele)
        clone.val(Number(ele1.val()).toLocaleString("en"))
        $(ele).after(clone)
        $(ele).hide()
        clone.mouseenter(() => {
            ele1.show()
            clone.hide()
        })
        setInterval(() => {
            let newv = Number(ele1.val()).toLocaleString("en")
            if (clone.val() != newv) {
                clone.val(newv)
            }
        }, 10)

        $(ele).mouseleave(() => {
            $(clone).show()
            $(ele1).hide()
        })
    })
})