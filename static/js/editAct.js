$(document).ready(function () {
    startTime = ''
    modnum = []
    change = true
        //choosedate
    var opt={dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm',
        controlType: 'select',
        oneLine: true
    };
    var o={
        timeOnlyShowDate: true,
        timeFormat: 'HH:mm',
        dateFormat: ''
    }

    $(".create-info").click(function (e) { 
        $.alert({
            title: "OOPS!",
            content: '功能尚未開發完成'
        })
        
    });
    $('#datetimepicker1').datetimepicker(opt)
    $('#datetimepicker2').datetimepicker(opt)
    $('.datetimepicker3').timepicker(o)
    title = location.href.split("/")
    title = decodeURIComponent(title[4])
    title = title.replace(/%20/, " ")
    $("h5.title").html(title)
    data = {
        Search: title
    }
    $.ajax({
        type: "POST",
        url: "https://fiesta-o2o.tw/Fiestadb/Activity/Search",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        datatype: JSON,
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
                            tagcircle = '<div class="sort-circle">' +
                            tagname[j] + '</div>'
                            $(".sort-first").append(tagcircle)
                        }
                    }
                    if(key == 'act_Description' && id == $.cookie('acid')){
                        $("textarea#Description").html(data.result[i][key])
                    }
                    if(key == 'startTime' && id == $.cookie('acid')){
                        $("input.startTime").val(data.result[i][key])
                    }
                    if(key == 'endTime' && id == $.cookie('acid')){
                        $("input.endTime").val(data.result[i][key])
                    }
                    if(key == 'Models' && id == $.cookie('acid')){
                        modnum.push(data.result[i][key])
                        num = modnum[0].split(",")
                        check = $(".check-mod")
                        for(m = 0;m < num.length;m++){
                            for(n = 0;n < check.length;n++){
                            if(check.eq(n).val() == num[m]){
                                modnum = []
                                if(num[m] == "3" || num[m] == "4" || num[m] == "6"){
                                    $("#modfornext").show()
                                }
                                check.eq(n).prop("checked", "checked")
                                check.eq(n).prop("disabled", "disabled")
                                for(w = 0;w < $(".check-mod").length;w++){
                                    if($(".check-mod").eq(w).prop("checked") == true){
                                        modnum.push($(".check-mod").eq(w).val())
                                    }
                                }
                                if(num[m] == '3'){
                                    data_3 = {
                                        act_Id: $.cookie("acid")
                                    }
                                    
                                    $.ajax({
                                        type: "POST",
                                        url: "https://fiesta-o2o.tw/Fiestadb/Ticket/SelectByAct",
                                        data: JSON.stringify(data_3),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data_3) {
                                            type = $(".ticketype")
                                            quan = $(".ticketquan")
                                            price = $(".ticketprice")
                                            id = $("span.id")
                                            for (var i = 0, l = data_3.result.length; i < l; i++) { //這邊的i是指目前算到第幾個json
                                                if(i == 0 && l > 3){
                                                    for(q = 3;q < l;q++){
                                                        ticket = '<div><div class="ticket-text ticket-size-1">' +
                                                        '<input type="text" class="form-control ticketype" placeholder="Ticket type">' +
                                                        '</div><div class="ticket-text ticket-size-2"><input type="text" class="form-control ticketquan" placeholder="Quantity">' +
                                                        '</div><div class="ticket-text ticket-size-3"><input type="text" class="form-control ticketprice" placeholder="Price">' +
                                                        '</div><div class="ticket-add"><span class="id">' +
                                                        '</span><button class="btn btn-danger btn-radius-2 clear-float minus-ticket">–</button>' +
                                                        '</div></div>'
                                                        $("div#ticket-list").append(ticket)
                                                        type = $(".ticketype")
                                                        quan = $(".ticketquan")
                                                        price = $(".ticketprice")
                                                        id = $("span.id")
                                                    }
                                                }
                                                for (var key in data_3.result[i]) {
                                                    if(key == "ticketKinds"){
                                                        type.eq(i).val(data_3.result[i][key])
                                                    }
                                                    if(key == "Remainder"){
                                                        quan.eq(i).val(data_3.result[i][key])
                                                    }
                                                    if(key == "Price"){
                                                        price.eq(i).val(data_3.result[i][key])
                                                    }
                                                    if(key == "Id"){
                                                        id.eq(i).html(data_3.result[i][key])
                                                    }
                                                }
                                            }
                                            $("button.minus-ticket").click(function (e) { 
                                                par = $(this).parent().parent()
                                                if($(this).prev().html() != ""){
                                                    $("span#showid").html($(this).prev(".id").html())
                                                    $.confirm({
                                                        title: '警告',
                                                        animation: 'zoom',
                                                        closeAnimation: 'scale',
                                                        content: '確定要刪除嗎？無法恢復',
                                                        buttons: {
                                                            確認: {
                                                                btnClass: 'btn-danger',
                                                                action: function() {
                                                                    data_showdel = {
                                                                        ticketId: $("span#showid").html()
                                                                    }
                                                                    $.ajax({
                                                                        type: "POST",
                                                                        url: "https://fiesta-o2o.tw/Fiestadb/Ticket/delete",
                                                                        data: JSON.stringify(data_showdel),
                                                                        contentType: "application/json",
                                                                        beforeSend:function(xhr){
                                                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                                                        },
                                                                        datatype: JSON,
                                                                        success: function (response) {
                                                                            
                                                                            par.remove()
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                            我再想想: function() {
                                                            }
                                                        }
                                                    })
                                                }else{
                                                    par.remove()
                                                }
                                            })
                                        }
                                    });
                                }else if(num[m] == "4"){
                                    data_4 = {
                                        act_Id: $.cookie("acid")
                                    }
                                    $.ajax({
                                        type: "POST",
                                        url: "https://fiesta-o2o.tw/Fiestadb/Show/select",
                                        data: JSON.stringify(data_4),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data_4) {
                                            STitle = $(".schetitle")
                                            SDetail = $(".schedetail")
                                            SST = $(".schestart")
                                            SId = $(".showid")
                                            for (var i = 0, l = data_4.result.length; i < l; i++) {
                                                if(i == 0 && l > 2){
                                                    for(q = 2;q < l;q++){
                                                        schedulelist = '<div class="row mb-2 rc-2"><div class="col-4"><input type="text" class="form-control schetitle" placeholder="時段主題"></div>' +
                                                        '<div class="col-4"><input type="text" class="form-control schedetail" placeholder="說明"></div>' +
                                                        '<div class="col-3 pr-0"><input type="text" class="datetimepicker3 form-control schestart" placeholder="開始時間"></div>' +
                                                        '<div class="col-1 mt-2"><span class="showid">' + '</span><button class="btn btn-danger btn-radius-2 clear-float minus-schedule">–</button>' +
                                                        '</div></div>'
                                                        $("div.schedulelist").append(schedulelist)
                                                        $('.datetimepicker3').timepicker(o)
                                                        STitle = $(".schetitle")
                                                        SDetail = $(".schedetail")
                                                        SST = $(".schestart")
                                                        SId = $(".showid")
                                                        $("button.minus-schedule").click(function (e) {
                                                            $("span#showid").html($(this).prev().html())
                                                            $(this).parent().parent().remove()
                                                            $.confirm({
                                                                title: '警告',
                                                                animation: 'zoom',
                                                                closeAnimation: 'scale',
                                                                content: '確定要刪除嗎？無法恢復',
                                                                buttons: {
                                                                    確認: {
                                                                        btnClass: 'btn-danger',
                                                                        action: function() {
                                                                            data_showdel = {
                                                                                show_Id: $("span#showid").html()
                                                                            }
                                                                            $.ajax({
                                                                                type: "POST",
                                                                                url: "https://fiesta-o2o.tw/Fiestadb/Show/delete",
                                                                                data: JSON.stringify(data_showdel),
                                                                                contentType: "application/json",
                                                                                beforeSend:function(xhr){
                                                                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                                                                },
                                                                                datatype: JSON,
                                                                                success: function (response) {
                                                                                    
                                                                                }
                                                                            });
                                                                        }
                                                                    },
                                                                    我再想想: function() {
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }
                                                }
                                                STitle = $(".schetitle")
                                                SDetail = $(".schedetail")
                                                SST = $(".schestart")
                                                SId = $(".showid")
                                                for (var key in data_4.result[i]) {
                                                    if(key == "showName"){
                                                        STitle.eq(i).val(data_4.result[i][key])
                                                    }
                                                    if(key == "Detail"){
                                                        SDetail.eq(i).val(data_4.result[i][key])
                                                    }
                                                    if(key == "showTime"){
                                                        time = data_4.result[i][key]
                                                        time = time.split(" ")
                                                        SST.eq(i).val(time[1])
                                                    }
                                                    if(key == "Id"){
                                                        SId.eq(i).html(data_4.result[i][key])
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }else if(num[m] == "6"){
                                    data_6 = {
                                        act_Id: $.cookie("acid")
                                    }
                                    $.ajax({
                                        type: "POST",
                                        url: "https://fiesta-o2o.tw/Fiestadb/Lotte/select",
                                        data: JSON.stringify(data_6),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data_6) {
                                            
                                            count = 0
                                            countname = 0
                                            LN = $(".lottename")
                                            Lid = $(".lotteid")
                                            for (var i = 0, l = data_6.result.length; i < l; i++) {
                                                if(i == 0 && l > 2){
                                                    for(q = 2;q < l;q++){
                                                        lottelist = '<div class="row mt-2 mb-2">' +
                                                        '<div class="col"><input class="form-control lottename" type="text" placeholder="獎項"></div>' +
                                                        '<div class="col-1"><span class="lotteid"></span><button class="btn btn-danger btn-radius-2 clear-float minus-lotte">–</button></div></div>'
                                                        $("div#lottelist").append(lottelist)
                                                        LN = $(".lottename")
                                                        Lid = $(".lotteid")
                                                        $("button.minus-lotte").click(function (e) {
                                                            $("span#showid").html($(this).prev().html())
                                                            par = $(this).parent().parent()
                                                            $.confirm({
                                                                title: '警告',
                                                                animation: 'zoom',
                                                                closeAnimation: 'scale',
                                                                content: '確定要刪除嗎？無法恢復',
                                                                buttons: {
                                                                    確認: {
                                                                        btnClass: 'btn-danger',
                                                                        action: function() {
                                                                            data_showdel = {
                                                                                lotteId: $("span#showid").html()
                                                                            }
                                                                            $.ajax({
                                                                                type: "POST",
                                                                                url: "https://fiesta-o2o.tw/Fiestadb/Lotte/delete",
                                                                                data: JSON.stringify(data_showdel),
                                                                                contentType: "application/json",
                                                                                beforeSend:function(xhr){
                                                                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                                                                },
                                                                                datatype: JSON,
                                                                                success: function (response) {
                                                                                    par.remove()
                                                                                }
                                                                            });
                                                                        }
                                                                    },
                                                                    我再想想: function() {
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }
                                                }
                                                for (var key in data_6.result[i]) {
                                                    if(key == "Prize"){
                                                        LN.eq(i).val(data_6.result[i][key])
                                                    }
                                                    if(key == "Id"){
                                                        Lid.eq(i).html(data_6.result[i][key])
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        }
                    }
                }
            }
        }
    });
    $("h5.title").click(function (e) {
        if(change == true){
            $(this).html('<input type="text" id="change-actname" value="' + $(this).html() + '">')
            change = false
        }
        $("input#change-actname").focus()
        $("input#change-actname").blur(function (e) {
            $(this).parent().html($(this).val())
            $(this).remove()
            change = true
        });

    });
    $("button#checkticket").click(function (e) {
        data = {
            Input: location.hostname + "check"
        }
        $.ajax({
            type: "POST",
            url: "https://fiesta-o2o.tw/Fiestadb/QRcode",
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
    $("button#update").click(function (e) {
        var startTime = $('#datetimepicker1').datepicker('getDate');
        var endTime = $('#datetimepicker2').datepicker('getDate');
        if(startTime.getHours() < 10){
            b = '0' + startTime.getHours().toString()
        }else{
            b = startTime.getHours()
        }
        if(startTime.getMinutes() < 10){
            c = '0' + startTime.getMinutes().toString()
        }else{
            c = startTime.getMinutes()
        }
        startTime = $.datepicker.formatDate("yy-mm-dd", startTime) + " " + b + ":" + c + ":00"

    //endTime
        if(endTime.getHours() < 10){
            b = '0' + endTime.getHours().toString()
        }else{
            b = endTime.getHours()
        }
        if(endTime.getMinutes() < 10){
            c = '0' + endTime.getMinutes().toString()
        }else{
            c = endTime.getMinutes()
        }
        endTime = $.datepicker.formatDate("yy-mm-dd", endTime) + " " + b + ":" + c + ":00"
        data = {
            act_Id: $.cookie("acid"),
            startTime: startTime,
            endTime: endTime,
            act_Name: $("h5.title").html(),
            act_Description: $("#Description").html()
        }
        $.ajax({
            type: "POST",
            url: "https://fiesta-o2o.tw/Fiestadb/Activity/update",
            data: JSON.stringify(data),
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            contentType: "application/json",
            datatype: JSON,
            success: function (response) {
                location.href = "/editActivity/" + $("h5.title").html()
            }
        });
    });
    $("button.advence").click(function (e) { 
        $("div.actmain").css("display", "none")
        $("div.actadvence").css("display", "flex")

    });
    $("button#backtomain").click(function (e) { 
        $("div.actadvence").css("display", "none")
        $("div.actmain").css("display", "flex")
    });
    $("button#backstagetomain").click(function (e) { 
        $("div.dash-board").css("display", "none")
        $("div.actmain").css("display", "flex")
    });
//選擇mod
$(".check-mod").change(function (e) {
    modnum = []
    for(i = 0;i < $(".check-mod").length;i++){
        if($(".check-mod").eq(i).prop("checked") == true){
            modnum.push($(".check-mod").eq(i).val())
        }
    }
    check = $(".check-mod")
    if(check.eq(1).prop("checked") == true || check.eq(2).prop("checked") == true || check.eq(4).prop("checked") == true || check.eq(5).prop("checked") == true){
        $("button#modorsubmit").html("下一步")
        $("button#modorsubmit").addClass("btn-primary")
        $("button#modorsubmit").removeClass("btn-success")
    }
    if(check.eq(1).prop("checked") == false && check.eq(2).prop("checked") == false && check.eq(4).prop("checked") == false && check.eq(5).prop("checked") == false){
        $("button#modorsubmit").html("送出")
        $("button#modorsubmit").removeClass("btn-primary")
        $("button#modorsubmit").addClass("btn-success")
    }
});
$("#backstage").click(function (e) { 
    $(".actmain").hide()
    $(".dash-board").css("display", "flex")
    
});
$("button.minus-ticket").click(function (e) { 
    par = $(this).parent().parent()
    if($(this).prev().html() != ""){
        $("span#showid").html($(this).prev(".id").html())
        $.confirm({
            title: '警告',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '確定要刪除嗎？無法恢復',
            buttons: {
                確認: {
                    btnClass: 'btn-danger',
                    action: function() {
                        data_showdel = {
                            ticketId: $("span#showid").html()
                        }
                        $.ajax({
                            type: "POST",
                            url: "https://fiesta-o2o.tw/Fiestadb/Ticket/delete",
                            data: JSON.stringify(data_showdel),
                            contentType: "application/json",
                            beforeSend:function(xhr){
                                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                            },
                            datatype: JSON,
                            success: function (response) {
                                par.remove()
                            }
                        });
                    }
                },
                我再想想: function() {
                }
            }
        })
    }else{
        par.remove()
    }
});

$("button.add-ticket").click(function (e) {
    ticket = '<div><div class="ticket-text ticket-size-1">' +
    '<input type="text" class="form-control ticketype" placeholder="Ticket type">' +
    '</div><div class="ticket-text ticket-size-2"><input type="text" class="form-control ticketquan" placeholder="Quantity">' +
    '</div><div class="ticket-text ticket-size-3"><input type="text" class="form-control ticketprice" placeholder="Price">' +
    '</div><div class="ticket-add"><span class="id"></span><button class="btn btn-danger btn-radius-2 clear-float minus-ticket">–</button>' +
    '</div></div>'
    $("div#ticket-list").append(ticket)
    $("button.minus-ticket").click(function (e) { 
    $(this).parent().parent().remove()
    });
});
$("#datetimepicker1").click(function (e) { 
    $("#ui-datepicker-div").css("z-index", 10)
    
});

$(".minus-lotte").click(function (e) { 
    $(this).parent().parent().remove()
});

$("button.add-lotte").click(function (e) { 
    lottelist = '<div class="row mt-2 mb-2">' +
                '<div class="col"><input class="form-control lottename" type="text" placeholder="獎項"></div>' +
                '<div class="col-1"><button class="btn btn-danger btn-radius-2 clear-float minus-lotte">–</button></div></div>'
    $("#lottelist").append(lottelist)
    $(".minus-lotte").click(function (e) { 
        $(this).parent().parent().remove()
    });
});
$("button.minus-schedule").click(function (e) { 
    par = $(this).parent().parent()
    if($(this).prev().html() != ""){
        $("span#showid").html($(this).prev(".showid").html())
        $.confirm({
            title: '警告',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '確定要刪除嗎？無法恢復',
            buttons: {
                確認: {
                    btnClass: 'btn-danger',
                    action: function() {
                        data_showdel = {
                            showId: $("span#showid").html()
                        }
                        $.ajax({
                            type: "POST",
                            url: "https://fiesta-o2o.tw/Fiestadb/Show/delete",
                            data: JSON.stringify(data_showdel),
                            contentType: "application/json",
                            beforeSend:function(xhr){
                                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                            },
                            datatype: JSON,
                            success: function (response) {
                                par.remove()
                            }
                        });
                    }
                },
                我再想想: function() {
                }
            }
        })
    }else{
        par.remove()
    }
});

$("button.add-schedule").click(function (e) { 
    schedulelist = '<div class="row mb-2 rc-2"><div class="col-4"><input type="text" class="form-control schetitle" placeholder="時段主題"></div>' +
    '<div class="col-4"><input type="text" class="form-control schedetail" placeholder="說明"></div>' +
    '<div class="col-3 pr-0"><input type="text" class="datetimepicker3 form-control schestart" placeholder="開始時間"></div>' +
    '<div class="col-1 mt-2"><span class="showid"></span><button class="btn btn-danger btn-radius-2 clear-float minus-schedule">–</button>' +
    '</div></div>'
    $(".schedulelist").append(schedulelist)
    var o={
        timeOnlyShowDate: true,
        timeFormat: 'HH:mm',
        dateFormat: ''
    }
    $('.datetimepicker3').timepicker(o)
    $("button.minus-schedule").click(function (e) { 
        $(this).parent().parent().remove()
    });
});
//goto

//selectmod or submit
$("#modfornext").click(function (e) {
    $(".actadvence").hide()
    $('html,body').animate({ scrollTop: 0 }, 'slow');
        for(k = modnum.length-1;k>=0;k--){
            if(modnum[k] == '6'){
                break
            }else if(modnum[k] == '4'){
                $("button#golotte").html("送出")
                $("button#golotte").removeClass("btn-primary")
                $("button#golotte").addClass("btn-success")
                break
            }else if(modnum[k] == '3'){
                $("button#goschedule").html("送出")
                $("button#goschedule").removeClass("btn-primary")
                $("button#goschedule").addClass("btn-success")
                break
            }
        }
        for(m = 0;m < modnum.length;m++){
            if(modnum[m] == "3"){
                $("div#choose-ticket").show() // gototicket
                break
            }else if(modnum[m] == "4"){
                $("div#choose-schedule").show() // gotoschedule
                break
            }else if(modnum[m] == "6"){
                $("div#choose-lotte").show() // gotolotte
                break
            }
        }
});
//schedule
$("button#goschedule").click(function (e) {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    if($(this).html() == "下一步"){
        $("div#choose-ticket").hide()
        for(k = 0;k < modnum.length;k++){
            if(modnum[k] == "4"){
                $("div#choose-schedule").show()
                break
            }else if(modnum[k] == "6"){
                $("div#choose-lotte").show()
                break
            }
        }
    }else if($(this).html() == "送出"){
        submitData()
        $("div#choose-finish").show()
        $("div#choose-ticket").hide()
    }
});

//lotte
$("button#golotte").click(function (e) {
    count = 0
    st = $(".schestart")
    for(k = $(".schestart").length;k > 1;k --){
        thistime = $(".schestart").eq(k-1).val()
        thistime = thistime.split(":")
        hr = thistime[0]
        min = thistime[1]
        thattime = $(".schestart").eq(k-2).val().split(":")
        prehr = thattime[0]
        premin = thattime[1]
        if(parseInt(hr) < parseInt(prehr)){
            $(".scherror").show()
            $(".scherror").html("時間錯誤")
        }
        if(parseInt(hr) == parseInt(prehr)){
            if(parseInt(min) < parseInt(premin)){
                $(".scherror").show()
                $(".scherror").html("時間錯誤")
            }
            if(parseInt(min) >= parseInt(premin)){
                count++
            }
        }
        if(parseInt(hr) > parseInt(prehr)){
            count++
        }
    }
    for(z = 0;z <= $(".schestart").length-1;z++){
        if($(".schestart").eq(z).val() == ""){
            count++
        }
    }
    if(count == $(".schestart").length-1){
        $(".scherror").hide()
        $(".scherror").html("")
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $("div#choose-schedule").hide()
            if($(this).html() == "下一步"){
                $("div#choose-lotte").show()
            }else if($(this).html() == "送出"){
                submitData()
                $("div#choose-finish").show()
            }
    }
});

$("button.justSubmit").click(function (e) { 
    submitData()
    $("#choose-lotte").hide()
    $("#choose-finish").show()
});


//selectmod or submit
$("#modorsubmit").click(function (e) {
    $("div#choose-select").hide()
    $("button.btn-change").html("下一步")
    $("button.btn-change").addClass("btn-primary")
    $("button.btn-change").removeClass("btn-success")
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    if($(this).html() == "下一步"){
        for(k = modnum.length-1;k>=0;k--){
            if(modnum[k] == '6'){
                break
            }else if(modnum[k] == '4'){
                $("button#golotte").html("送出")
                $("button#golotte").removeClass("btn-primary")
                $("button#golotte").addClass("btn-success")
                break
            }else if(modnum[k] == '3'){
                $("button#goschedule").html("送出")
                $("button#goschedule").removeClass("btn-primary")
                $("button#goschedule").addClass("btn-success")
                break
            }
        }
    }
    if(modnum.length == 0){
        submitData()
        $("div#choose-finish").show()
        $("div#choose-select").hide()
    }else{
        for(m = 0;m < modnum.length;m++){
            if(modnum[m] == "3"){
                $("div#choose-ticket").show() // gototicket
                break
            }else if(modnum[m] == "4"){
                $("div#choose-schedule").show() // gotoschedule
                break
            }else if(modnum[m] == "6"){
                $("div#choose-lotte").show() // gotolotte
                break
            }
        }
    }
});


//mod

//goto
//backto
//mod
//select
$("button#backtoselect").click(function (e) {
    $(".actadvence").css("display", "flex")
    $("div#choose-ticket").hide()
});


//schedule
$("button#backtoticket").click(function (e) {
    $("div#choose-schedule").hide()
    for(i = modnum.length - 1;i >= 0;i--){
        if(modnum[i] == "3"){
            $("div#choose-ticket").show()
            break
        }else if(i == 0){
            $(".actadvence").css("display", "flex")
            break
        }
    }
});

$("button#backtoschedule").click(function (e) {
    $("div#choose-lotte").hide()
    for(i = modnum.length - 1;i >= 0;i--){
        if(modnum[i] == "4"){
            $("div#choose-schedule").show()
            break
        }else if(modnum[i] == "3"){
            $("div#choose-ticket").show()
            break
        }else if(i == 0){
            $(".actadvence").css("display", "flex")
            break
        }
    }
});
//mod
//backto

function submitData() {
    mod = modnum[0]
    for(i = 1;i < modnum.length;i++){
        mod = mod + ',' + modnum[i]
    }
    data = {
        act_Id: $.cookie("acid"),
        Models: mod
    }
    $.ajax({
        type: "POST",
        url: "https://fiesta-o2o.tw/Fiestadb/Activity/update",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        datatype: JSON,
        success: function (data) {
            $.each(data.result, function (indexInArray, content) { 
                 act_Id = content.act_Id
            });
            for(i = 0;i < modnum.length;i++){
                if(modnum[i] == '3'){
                    if($("span.id").eq(0).html() != ""){
                        for(f = 0;f < $("span.id").length;f++){
                            if($("span.id").eq(f).html() != ""){
                            ticketype = $("input.ticketype")
                            ticketquan = $("input.ticketquan")
                            ticketprice = $("input.ticketprice")
                                data_1 = {
                                    ticketId: $("span.id").eq(f).html(),
                                    ticketKinds: ticketype.eq(f).val(),
                                    Mounts: parseInt(ticketquan.eq(f).val()),
                                    Price: parseInt(ticketprice.eq(f).val())
                                }
                                
                                    $.ajax({
                                        type: "POST",
                                        async: false,
                                        url: "https://fiesta-o2o.tw/Fiestadb/Ticket/update",
                                        data: JSON.stringify(data_1),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data) {
                                            
                                        }
                                    });
                                }else{
                                        data_3 = {
                                            act_Id: $.cookie("acid"),
                                            ticketKinds: ticketype.eq(f).val(),
                                            Mounts: parseInt(ticketquan.eq(f).val()),
                                            Remainder: parseInt(ticketquan.eq(f).val()),
                                            Price: parseInt(ticketprice.eq(f).val()),
                                            Useable: "true"
                                        }
                                        
                                            $.ajax({
                                                type: "POST",
                                                async: false,
                                                url: "https://fiesta-o2o.tw/Fiestadb/Ticket/upload",
                                                data: JSON.stringify(data_3),
                                                contentType: "application/json",
                                                beforeSend:function(xhr){
                                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                                },
                                                datatype: JSON,
                                                success: function (data) {
                                                }
                                            });
                                }
                        }
                    }else{
                    ticketype = $("input.ticketype")
                    ticketquan = $("input.ticketquan")
                    ticketprice = $("input.ticketprice")
                    for(k = 0;k < ticketype.length;k++){
                        data_3 = {
                            act_Id: $.cookie("acid"),
                            ticketKinds: ticketype.eq(k).val(),
                            Mounts: parseInt(ticketquan.eq(k).val()),
                            Remainder: parseInt(ticketquan.eq(k).val()),
                            Price: parseInt(ticketprice.eq(k).val()),
                            Useable: "true"
                        }
                        
                            $.ajax({
                                type: "POST",
                                async: false,
                                url: "https://fiesta-o2o.tw/Fiestadb/Ticket/upload",
                                data: JSON.stringify(data_3),
                                contentType: "application/json",
                                beforeSend:function(xhr){
                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                },
                                datatype: JSON,
                                success: function (data) {
                                    
                                }
                            });
                    }
                }
                }else if(modnum[i] == '4'){
                    if($("span.showid").eq(0).html() != ""){
                        for(f = 0;f < $("span.showid").length;f++){
                            if($("span.showid").eq(f).html() != ""){
                            date = $("#datetimepicker2").val().split(" ")
                            schetitle = $(".schetitle")
                            schestart = $(".schestart")
                            schedetail = $(".schedetail")
                            schest = date[0] + " " + schestart.eq(f).val() + ':00'
                                data_11 = {
                                    showId: $("span.showid").eq(f).html(),
                                    showTime: schest,
                                    Detail: schedetail.eq(f).val(),
                                    showName: schetitle.eq(f).val()
                                }
                                
                                    $.ajax({
                                        type: "POST",
                                        async: false,
                                        url: "https://fiesta-o2o.tw/Fiestadb/Show/update",
                                        data: JSON.stringify(data_11),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data) {
                                            
                                        }
                                    });
                                }else{
                                    date = $("#datetimepicker2").val().split(" ")
                                    schetitle = $(".schetitle")
                                    schestart = $(".schestart")
                                    schedetail = $(".schedetail")
                                    schest = date[0] + schestart.eq(f).val() + ':00'
                                        data_12 = {
                                            act_Id: $.cookie("acid"),
                                            showTime: schest,
                                            Detail: schedetail.eq(f).val(),
                                            showStatus: "true",
                                            Useable: "true",
                                            showName: schetitle.eq(f).val()
                                        }
                                        
                                            $.ajax({
                                                type: "POST",
                                                async: false,
                                                url: "https://fiesta-o2o.tw/Fiestadb/Show/upload",
                                                data: JSON.stringify(data_12),
                                                contentType: "application/json",
                                                beforeSend:function(xhr){
                                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                                },
                                                datatype: JSON,
                                                success: function (data) {
                                                    
                                                }
                                            });
                                }
                        }
                    }else{
                    date = $("#datetimepicker2").val().split(" ")
                    schetitle = $(".schetitle")
                    schestart = $(".schestart")
                    schedetail = $(".schedetail")
                    for(k = 0;k < schestart.length;k++){
                        schest = date[0] + schestart.eq(k).val() + ':00'
                        data_4 = {
                            act_Id: $.cookie("acid"),
                            showTime: schest,
                            Detail: schedetail.eq(k).val(),
                            showStatus: "true",
                            Useable: "true",
                            showName: schetitle.eq(k).val()
                        }
                        $.ajax({
                            type: "POST",
                            url: "https://fiesta-o2o.tw/Fiestadb/Show/upload",
                            data: JSON.stringify(data_4),
                            async: false,
                            contentType: "application/json",
                            beforeSend:function(xhr){
                                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                            },
                            datatype: JSON,
                            success: function (data) {
                                
                            }
                        });
                    }
                }
                }else if(modnum[i] == '6'){
                    if($("span.lotteid").eq(0).html() != ""){
                        for(f = 0;f < $("span.lotteid").length;f++){
                            if($("span.lotteid").eq(f).html() != ""){
                            lottename = $(".lottename")
                                data_9 = {
                                    lotteId: $("span.lotteid").eq(f).html(),
                                    Prize: lottename.eq(f).val()
                                }
                                    $.ajax({
                                        type: "POST",
                                        async: false,
                                        url: "https://fiesta-o2o.tw/Fiestadb/Lotte/update",
                                        data: JSON.stringify(data_9),
                                        contentType: "application/json",
                                        beforeSend:function(xhr){
                                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                        },
                                        datatype: JSON,
                                        success: function (data) {
                                            
                                        }
                                    });
                                }else{
                                    lottename = $(".lottename")
                                    data_10 = {
                                        act_Id: $.cookie("acid"),
                                        Prize: lottename.eq(f).val(),
                                        Useable: "true"
                                    }
                                        $.ajax({
                                            type: "POST",
                                            async: false,
                                            url: "https://fiesta-o2o.tw/Fiestadb/Lotte/upload",
                                            data: JSON.stringify(data_10),
                                            contentType: "application/json",
                                            beforeSend:function(xhr){
                                                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                            },
                                            datatype: JSON,
                                            success: function (data) {
                                                
                                            }
                                        });
                                }
                        }
                    }else{
                    lottename = $(".lottename")
                    for(k = 0;k < lottename.length;k++){
                        data_6 = {
                            act_Id: $.cookie("acid"),
                            Prize: lottename.eq(k).val(),
                            Useable: "true"
                        }
                        
                            $.ajax({
                                type: "POST",
                                async: false,
                                url: "https://fiesta-o2o.tw/Fiestadb/Lotte/upload",
                                data: JSON.stringify(data_6),
                                contentType: "application/json",
                                beforeSend:function(xhr){
                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                },
                                datatype: JSON,
                                success: function (data) {
                                    
                                }
                            });
                    }
                }
            }
        }
    }
    });
}
});