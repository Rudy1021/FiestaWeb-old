$(document).ready(function () {
    tickind = ''
    modnum = []
    title = location.href.split("/")
    D = new Date()
    DY = D.getFullYear()
    DM = D.getMonth() + 1
    DD = D.getDate()
    Dh = D.getHours()
    Dm = D.getMinutes()
    five = ''
    eight = ''
    title = decodeURIComponent(title[4])
    title = title.replace(/%20/, " ")
    $("h5#title").html(title)
    data = {
        Search: title
    }
    $.ajax({
        type: "POST",
        url: "http://163.18.42.222:4000/Fiestadb/Activity/Search",
        data: JSON.stringify(data),
        async: false,
        contentType: "application/json",
        datatype: JSON,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        success: function (data) {
            id = ''
            for (var i = 0, l = data.result.length; i < l; i++) { //這邊的i是指目前算到第幾個json
                for (var key in data.result[i]) {
                    if(key == 'Id'){
                        id = data.result[i][key]
                    }
                    if(key == 'Tag' && id == $.cookie('acid')){
                        tagname = data.result[i][key]
                        for(j = 0;j < tagname.length;j++){
                            tag = '<div class="act-tag"># ' + tagname[j] +'</div>'
                            $("#taglist").append(tag)
                        }
                    }
                    if(key == 'act_Description' && id == $.cookie('acid')){
                        $("div#act_Description").html(data.result[i][key])
                    }
                    if(key == 'startTime' && id == $.cookie('acid')){
                        $("h6#startTime").html($("h6#startTime").html() + data.result[i][key])
                    }
                    if(key == 'endTime' && id == $.cookie('acid')){
                        $("h6#endTime").html($("h6#endTime").html() + data.result[i][key])
                    }
                    if(key == 'Photo' && id == $.cookie('acid')){
                        $("#act-img").prop("src", data.result[i][key])
                    }
                    if(key == 'Models' && id == $.cookie('acid')){
                        if(data.result[i][key] != "None"){
                        modnum.push(data.result[i][key])
                        num = modnum[0].split(",")
                        for(k = 0;k < num.length;k++){
                            if(num[k] == "3")
                            {
                                $(".join-btn").remove()
                                data_2 = {
                                    act_Id: $.cookie("acid")
                                }
                                $.ajax({
                                    type: "POST",
                                    url: "http://163.18.42.222:4000/Fiestadb/Ticket/SelectByAct",
                                    data: JSON.stringify(data_2),
                                    contentType: "application/json",
                                    datatype: JSON,
                                    success: function (data_4) {
                                        for (var i = 0, l = data_4.result.length; i < l; i++) { //這邊的i是指目前算到第幾個json
                                            for (var key in data_4.result[i]) {
                                                if(key == "ticketKinds"){
                                                    ticketkind = data_4.result[i][key]
                                                }
                                                if(key == "Remainder"){
                                                    ticketmount = data_4.result[i][key]
                                                }
                                                if(key == "Price")
                                                {
                                                    ticketprice = data_4.result[i][key]
                                                }
                                            }
                                            ticketlist = '<div class="row"><div class="col lh-3 text-center">' + ticketkind +
                                            '</div><div class="col lh-3 text-center" id="ticketprice' + i + '">NT.' + ticketprice + '</div>' +
                                            '<div class="col lh-3 text-center" id="ticketquan' + i + '">' + ticketmount + "張" +
                                            '</div><div class="col pt-2 text-center"><button class="btn btn-success mt-0 ticketsub testemail" type="button" id="ticketind' + i + 
                                            '">購票</button></div></div>'
                                            $("#ticketist").append(ticketlist)
                                        }
                                    }
                                });
                                $(".ticketsub").click(function (e) {
                                    tickind = $(this).parent().prev().prev().html()
                                    $.ajax({
                                        type: "POST",
                                        url: "http://163.18.42.222:4000/Fiestadb/Account/getReviewStatus",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        success: function (data) {
                                            if(data.code == "020"){
                                                $.confirm({
                                                    title: '喔不！',
                                                    animation: 'zoom',
                                                    closeAnimation: 'scale',
                                                    content: '此會員尚未進行驗證，現在就去驗證吧！',
                                                    buttons: {
                                                            確認: {
                                                                btnClass: 'btn-success',
                                                                action: function() {
                                                                location.href = '/MyProfile'
                                                            }
                                                        }
                                                    }
                                                })
                                            }else{
                                                $(".join-btn").click()
                                            }
                                        }
                                    })
                                });
                                $("#ticketlist").css("display", "flex")
                            }
                            if(num[k] == "4"){
                                data_4 = {
                                    act_Id: $.cookie("acid")
                                }
                                $.ajax({
                                    type: "POST",
                                    url: "http://163.18.42.222:4000/Fiestadb/Show/select",
                                    data: JSON.stringify(data_4),
                                    contentType: "application/json",
                                    datatype: JSON,
                                    success: function (data) {
                                        for (var i = 0, l = data.result; i < l; i++) { //這邊的i是指目前算到第幾個json
                                            for (var key in data.result[i]) {
                                                if(key == "showTime"){
                                                    time = data.result[i][key]
                                                    time = time.split(" ")
                                                    time = time[1]
                                                }
                                                if(key == "showName"){
                                                    name = data.result[i][key]
                                                }
                                                if(key == "Detail"){
                                                    detail = data.result[i][key]
                                                }
                                            }
                                            list = '<div class="accordion" id="accordionExample"><a data-toggle="collapse" data-target="#collapse' +
                                            i + '" aria-expanded="true" aria-controls="collapse' + i + '"><div class="now-time"><span class="ml-3"></span>' +
                                            '<span class="ml-3">' +  time + '</span><span class="ml-3">' + name + '</span></div></a>' +
                                            '<div id="collapse' + i + '" class="collapse" aria-labelledby="heading' + i + '" data-parent="#accordionExample">' +
                                            '<div class="card-body"><span class="p-1 dripicons dripicons-information"></span>' + detail +
                                            '</div></div></div>'
                                            $(".schelist").append(list)
                                        }
                                    }
                                });
                            }
                            if(num[k] == "5"){
                                $("#real-time").show()
                            }
                            if(num[k] == "6"){
                                $("#lotte-user").show()
                            }
                            if(num[k] == "8"){
                                $("#act-question").show()
                                $("#submitques").show()
                            }
                        }
                    }
                    }
                }
            }
            for(a = 0;a < modnum.length;a++){
                if(modnum[a] == "8"){
                    eight = modnum[a]
                }
            }
            if(eight == "8"){
            end = $("input.endTime").val()
            if(DY > parseInt(end.substr(0, 4))){
                $("div#actmain").hide()
                $("div#act-question").show()
            }else if(DY == parseInt(end.substr(0, 4))){
                if(DM > parseInt(end.substr(5, 2))){
                    $("div#actmain").hide()
                    $("div#act-question").show()
                }else if(DM == parseInt(end.substr(5, 2))){
                    if(DD > parseInt(end.substr(8, 2))){
                        $("div#actmain").hide()
                        $("div#act-question").show()
                    }else if(DD == parseInt(end.substr(8, 2))){
                        if(Dh > parseInt(end.substr(11, 2))){
                            $("div#actmain").hide()
                            $("div#act-question").show()
                        }else if(Dh == parseInt(end.substr(11, 2))){
                            if(Dm >= parseInt(end.substr(14, 2))){
                                $("div#actmain").hide()
                                $("div#act-question").show()
                            }
                        }
                    }
                }
            }
        }
            start = $("input.startTime").val()
            if($("div#act-question").is(":visible")){
            }else{
                for(a = 0;a < modnum.length;a++){
                    if(modnum[a] == "5"){
                        five = modnum[a]
                    }
                }
                if(five == "5"){
            if(parseInt(end.substr(0, 4)) - parseInt(start.substr(0, 4)) > parseInt(end.substr(0, 4)) - DY){
                $("div#actmain").hide()
                $("div#real-time").show()
            }else if(parseInt(end.substr(0, 4)) - parseInt(start.substr(0, 4)) == parseInt(end.substr(0, 4)) - DY){
                if(parseInt(end.substr(5, 2)) - parseInt(start.substr(5, 2)) > parseInt(end.substr(5, 2)) - DM){
                    $("div#actmain").hide()
                    $("div#real-time").show()
                }else if(parseInt(end.substr(5, 2)) - parseInt(start.substr(5, 2)) == parseInt(end.substr(5, 2)) - DM){
                    if(parseInt(end.substr(8, 2)) - parseInt(start.substr(8, 2)) > parseInt(end.substr(8, 2)) - DD){
                        $("div#actmain").hide()
                        $("div#real-time").show()
                    }else if(parseInt(end.substr(8, 2)) - parseInt(start.substr(8, 2)) == parseInt(end.substr(8, 2)) - DD){
                        if(parseInt(end.substr(11, 2)) - parseInt(start.substr(11, 2)) > parseInt(end.substr(11, 2)) - Dh){
                            $("div#actmain").hide()
                            $("div#real-time").show()
                        }else if(parseInt(end.substr(11, 2)) - parseInt(start.substr(11, 2)) == parseInt(end.substr(11, 2)) - Dh){
                            if(parseInt(end.substr(14, 2)) - parseInt(start.substr(14, 2)) >= parseInt(end.substr(14, 2)) - Dm){
                                $("div#actmain").hide()
                                $("div#real-time").show()
                            }
                        }
                    }
                }
            }
        }
        }
    }
    });
    data_sel = {
        Id: $.cookie("acid")
    }
    $.ajax({
        type: "POST",
        url: "http://163.18.42.222:4000/Fiestadb/Activity/select",
        data: JSON.stringify(data_sel),
        contentType: "application/json",
        datatype: JSON,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        success: function (data) {
            $.each(data.result, function (indexInArray, content) { 
                peopleId =  content.joinedAuth
            });
            for(i = 0;i < peopleId.length;i++){
                if($.cookie("Id") == peopleId[i]){
                    $(".btn").prop("disabled", "disabled")
                    $(".btn").html("已加入")
                    $("#submitques").removeAttr("disabled")
                    $("#submitques").html("送出問卷")
                    $("#QRCODE").html("建立網址QRCODE")
                }
            }
        }
    });
    $("#QRCODE").click(function (e) {
        data = {
            Input: location.href
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:4000/Fiestadb/QRcode",
            data: JSON.stringify(data),
            contentType: "application/json",
            datatype: JSON,
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            success: function (data) {
                download("qrcode", data)
                function download(filename, text) {
                    var pom = document.createElement('a');
                    pom.setAttribute('href', 'data:image/png;base64,' + text);
                    pom.setAttribute('download', filename);
                    if (document.createEvent) {
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        pom.dispatchEvent(event);
                    }
                    else {
                        pom.click();
                    }
                }
            }
        });
    });
    $("#submitques").click(function (e) {
        var Today=new Date();
        Today =  Today.getFullYear() + "-" + (Today.getMonth()+1) + "-" + Today.getDate()
        for(i = 0;i < 5;i++){
            if($(".All").eq(i).prop("checked")){
                all = $(".All").eq(i).val()
            }
            if($(".Money").eq(i).prop("checked")){
                mon = $(".Money").eq(i).val()
            }
            if($(".Audio").eq(i).prop("checked")){
                aud = $(".Audio").eq(i).val()
            }
            if($(".liu").eq(i).prop("checked")){
                liu = $(".liu").eq(i).val()
            }
            if($(".mood").eq(i).prop("checked")){
                mood = $(".mood").eq(i).val()
            }
            if($(".light").eq(i).prop("checked")){
                light = $(".light").eq(i).val()
            }
            if($(".move").eq(i).prop("checked")){
                move = $(".move").eq(i).val()
            }
            if($(".loc").eq(i).prop("checked")){
                loc = $(".loc").eq(i).val()
            }
            if($(".staff").eq(i).prop("checked")){
                staff = $(".staff").eq(i).val()
            }
        }
        data = {
            act_Id: $.cookie("acid"),
            authId: $.cookie("Id"),
            score_Date: Today,
            Stars: parseInt(all),
            Price: parseInt(mon),
            Music: parseInt(aud),
            Flow: parseInt(move),
            Vibe: parseInt(mood),
            Light: parseInt(light),
            Moveline: 5,
            Site: parseInt(loc),
            Staff: parseInt(staff),
            Useable: "true"
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:4000/Fiestadb/FeedBack/Score/Act/upload",
            data: JSON.stringify(data),
            async: false,
            contentType: "application/json",
            datatype: JSON,
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            success: function (data) {
                $(".showAct2").show()
                $("#act-question").hide()
                $("#real-time").hide()
            }
        });
    });
    $(".tick-sub").click(function (e) {
        if(tickind != ""){
            data = {
                act_Id: $.cookie("acid"),
                authId: $.cookie("Id"),
                ticketKinds: tickind,
                Notes: $("#Remark").val()
            }
        }else{
            data = {
                act_Id: $.cookie("acid"),
                authId: $.cookie("Id"),
                Notes: $("#Remark").val()
            }
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:4000/Fiestadb/Activity/setJoinedList",
            data: JSON.stringify(data),
            contentType: "application/json",
            datatype: JSON,
            async:false,
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            success: function (data) {
                if(data.code != "018"){
                    $("button.join-btn").html("已加入").prop("disabled", "disabled")
                    $("button.group-btn").html("已加入").prop("disabled", "disabled")
                }
            }
        });
        $(".close-sub").click()
    });
});