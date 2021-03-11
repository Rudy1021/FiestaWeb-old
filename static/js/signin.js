function CheckUserName() {
    var UN = $("#UserName");
    var re = /[a-zA-Z]/;
    var check = re.test(UN);
    if(UN.val() == "") {
        UN.next().html("帳號不能為空！");
    }else if(check == -1) {
        UN.next().html("需有一個英文字母！");
    }else if(UN.val().length <= 5){
        UN.next().html("帳號需大於五");
    }else{
        UN.next().html("");
    }
}

function CheckPassWord() {
    var PW = $("#PassWord");
    var reUpper = /[A-Z]/;
    var reLowwer = /[a-z]/;
    if(PW.val().search(reUpper) == -1 || PW.val().search(reLowwer) == -1) {
        PW.next().html("密碼需含一個大寫字母及一個小寫字母");
    }else if(PW.val().length <= 5) {
        PW.next().html("密碼需大於五");
    }else {
        PW.next().html("");
    }
}


function CheckEmail() {
    var Email = $("#Email");
    const re = /^(([.](?=[^.]|^))|[\w_%{|}#$~`+!?-])+@(?:[\w-]+\.)+[a-zA-Z.]{2,63}$/;
    if (re.test(Email.val())){
        Email.next().html("");
    }
    else {
        Email.next().html("信箱格式錯誤！");
    }  
}

function CheckPhone() {
    Phone = $("#Phone")
    if(Phone.val().substr(0, 1) != "0" || Phone.val().length != 10) {
        Phone.next().html("手機格式錯誤");
    }else {
        Phone.next().html("");
    }
}


function CheckBirth() {
    var Birth = $("#Birth");
    var reg=/^[0-9]{8}$/;
    if(Birth.val().search(reg) == -1) {
        Birth.next().html("生日格式錯誤");
    }
    if(Birth.val().search(reg) != -1){
        years =  parseInt(Birth.val().substr(0, 4))
        months = parseInt(Birth.val().substr(4, 2))
        days = parseInt(Birth.val().substr(6, 2))
        if(years <= 1900 || years >= 2019){
            Birth.next().html("生日有誤");
        }else if(months > 12 || days > 31 || months == 0){
            Birth.next().html("生日有誤");
        }else if(months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12){
            if(days > 31) {
                Birth.next().html("生日有誤");
            }else {
                Birth.next().html("");
            }
        }else if(months == 4 || months == 6 || months == 9 || months == 11){
            if(days > 30){
                Birth.next().html("生日有誤");
            }else{
                Birth.next().html("");
            }
        }else if(months == 2){
            if((years % 4 == 0 && years % 100 != 0) || (years % 4 == 0 && years % 100 == 0 && years % 400 == 0)){
                if(days > 29){
                    Birth.next().html("生日有誤");
                }else {
                    Birth.next().html("");
                }
            }else if(days > 28){
                Birth.next().html("生日有誤");
            }else{
                Birth.next().html("");
            }
        }
    }
}

function CheckCode() {
    id = document.getElementById("Code");
    //建立字母分數陣列(A~Z)
    var city = new Array(1,10,19,28,37,46,55,64,39,73,82, 2,11,20,48,29,38,47,56,65,74,83,21, 3,12,30)
    id = id.value.toUpperCase();
    //使用「正規表達式」檢驗格式
    if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
        $("#Code").next().html("身分證錯誤");
    } else {
        //將字串分割為陣列(IE必需這麼做才不會出錯)
        id = id.split('');
        //計算總分
        var total = city[id[0].charCodeAt(0)-65];
        for(var i=1; i<=8; i++){
            total += eval(id[i]) * (9 - i);
        }
        //補上檢查碼(最後一碼)
        total += eval(id[9]);
        //檢查比對碼(餘數應為0);
        if(total%10 != 0) {
            $("#Code").next().html("身分證錯誤");
        }
    }
}


$('.signin-input').keypress(function (e) { 
    code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13){
    signtest()
    }
});


$("#signin").click(signtest);


function signtest() {
    var count = 0
    var input = document.getElementsByClassName("signin-input");
    for(i=0;i<input.length;i++){
        if(input[i].value != ""){
            count++;
        }
    }
    if(count == 8){
        sign()
    }
}
function sign(){
    var count = 0
    var span = document.getElementsByClassName("signin-span");
    for(i = 0;i < span.length; i++){
        if(span[i].innerHTML == ""){
            count++;
        }
    }
    if(count == 8){
        Birth = $("#Birth").val();
        Birth = parseInt(Birth.substr(0, 4)) + "-" + parseInt(Birth.substr(4, 2)) + "-" + parseInt(Birth.substr(6, 2))
        data = {
            userId: $("#UserName").val(),
            userPassword: $("#PassWord").val(),
            userName: $("#NickName").val(),
            Mail_1: $("#Email").val(),
            Phone: $("#Phone").val(),
            Address: $("#Address").val(),
            Birthday: Birth,
            ID_CARD: $("#Code").val(),
            Useable: "true"
        }
        $.ajax({
            type: "POST",
            datatype: JSON,
            contentType: "application/json",
            url: "http://163.18.42.222:4000/Fiestadb/Account/upload",
            data: JSON.stringify(data),
            error: function(reason) {
                alert('error: ' + reason);
            },
            success: function(data) {
                console.log(data.code)
                if(data.code == "001"){
                    send()
                    alert("註冊成功!")
                    window.location.href = "/";
                    
                }
                if(data.code == "005"){
                    $("#userIdtest").html("此帳號已被註冊")
                }
                if(data.code == "008"){
                    $("#Mail_1test").html("信箱非學校信箱")
                }
            },
        });
    }
}
function send(){
    $.ajax({
        type: "POST",
        url: "/signin",
        data: {
            "type": "1",
            "userId": $("#UserName").val()
        },
        success: function (response) {
            
        }
    });
}