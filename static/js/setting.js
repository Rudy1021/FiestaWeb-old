$(document).ready(function () {
    userId = ''
    $.ajax({
        type: "POST",
        url: "https://fiesta-o2o.tw/Fiestadb/Account/getReviewStatus",
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        success: function (data) {
                if(data.code == "020"){
                    $("#email-vail").show()
                    $("#setting-edit").hide()
                }
                
        }
    });
    var opt={dateFormat: 'yy-mm-dd',
    changeYear : true,
    yearRange : "1994:2003",
    oneLine: true
};
$("#email-vail").click(function (e) { 
    data_2 = {
        userId: userId,
        type: "1"
    }
    $.ajax({
        type: "POST",
        url: "https://fiesta-o2o.tw/Fiestadb/Account/SendConfirm",
        data: JSON.stringify(data_2),
        contentType: "application/json",
        datatype: JSON,
        async: false,
        success: function (data_5) {
            $.confirm({
                title: '成功！',
                animation: 'zoom',
                closeAnimation: 'scale',
                content: '請去信箱驗證會員呦！',
                buttons: {
                    確認: {
                        btnClass: 'btn-success',
                        action: function() {
                        }
                    }
                }
            })
        }
    });
    
});
$('#profile-Birthday').datepicker(opt)
    $.ajax({
        type: "POST",
        url: "https://fiesta-o2o.tw/Fiestadb/Account/ValidateLogin",
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        contentType: "application/json",
        datatype: JSON,
        success: function (data) {
            if(data.code == "009"){
                $.confirm({
                    title: '警告',
                    animation: 'zoom',
                    closeAnimation: 'scale',
                    content: '請重新登入',
                    buttons: {
                        確認: {
                            btnClass: 'btn-danger',
                            action: function() {
                                $.removeCookie('userName');
                                $.removeCookie('Id');
                                $.removeCookie('qsacw');
                                location.href = "/"
                            }
                        }
                    }
                })
            }else{
                $.each(data.result, function (indexInArray, content) {
                    userId = content.userId
                    $.cookie("qsacw", content.token, { expires: 7 })
                    if(content.Photo != "None"){
                        $(".profile-pic-area").css("background-image", 'url("' + content.Photo + '")')
                    }
                    $("#profile-userName").val(content.userName)
                    $("#profile-nickName").val(content.nickName)
                    $("#profile-Email").val(content.Mail_1)
                    $("#profile-School").val(content.School)
                    phone = content.Phone
                    if(phone.substring(0, 2) == '09'){
                        $("#contry-number").val('886')
                        $("#profile-Phone").val(phone.substring(1))
                    }else if(phone == "None"){
                        $("#contry-number").val("")
                        $("#profile-Phone").val("")
                    }
                    if(content.Birthday == "None"){
                   $("#profile-Birthday").val("")     
                    }else{
                        $("#profile-Birthday").val(content.Birthday)
                    }
                    if(content.ID_CARD == "None"){
                        $("#profile-IDCARD").val("")
                    }else{
                        $("#profile-IDCARD").val(idcard.substring(0,6) + '****')
                    }
                    if(content.Mail_2 == "None"){
                        $("#profile-backupEmail").val("")
                    }else{
                        $("#profile-backupEmail").val(content.Mail_2)
                    }
                });
            }
        }
    });
});



$("#setting-edit").click(function(e) {
    if($("#contry-number").val() == "886"){
        if($("#profile-Phone").val().length == 9){
            phone = $("#profile-Phone").val()
        }else if($("#profile-Phone").val().length == 8){
            phone = "9" + $("#profile-Phone").val()
        }
    }
    if($("#profile-backupEmail").val() == ""){
        $("#profile-backupEmail").val("null")
    }
    if($("#profile-Birthday").val() == ""){
        $("#profile-Birthday").val("null")
    }
        if($("#profile-IDCARD").val() == ""){
        $("#profile-IDCARD").val("null")
    }
    data = {
        Phone: phone,
        Mail_2: $("#profile-backupEmail").val(),
        Birthday: $("#profile-Birthday").val(),
        ID_CARD: $("#profile-IDCARD").val(),
        nickName: $("#profile-nickName").val()
            }
        $.ajax({
        type: "POST",
        async: false,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        data: JSON.stringify(data),
        contentType: "application/json",
        datatype: JSON,
        url: "https://fiesta-o2o.tw/Fiestadb/Account/update",
        success: function (data) {
            location.reload()
        }
    });
})
$("#file").change(function (e) { 
    var file_data = $('#file').prop('files')[0]
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        type: "POST",
        contentType: false,
        processData: false,
        async: false,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        enctype: 'multipart/form-data',
        url: "https://fiesta-o2o.tw/Fiestadb/uploadImage?type=auth&Id=" + $.cookie("Id"),
        data: form_data,
        success: function (data) {
            location.reload()
        }
    });
    
});
$("#customRange3").change(function (e) { 
    $(".disval").html($(this).val())
    
});
$(".profile-pic-area").hover(function () {
    $(".profile-pic-edit").show()
    }, function () {
    $(".profile-pic-edit").hide()
    }
);