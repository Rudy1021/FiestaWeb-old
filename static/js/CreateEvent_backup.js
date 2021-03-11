$(document).ready(function () {
    //choosedate
    var opt={dateFormat: 'yy-mm-dd',
               timeFormat: 'HH:mm',
               controlType: 'select',
               oneLine: true,
                beforeShow: function () {
                    $("#ui-datepicker-div").css("z-index", 10)
                }
               };
    var o={
        timeOnlyShowDate: true,
        timeFormat: 'HH:mm',
        dateFormat: ''
    }
    $('#datetimepicker1').datetimepicker(opt)
    $('#datetimepicker2').datetimepicker(opt)
    $('.datetimepicker3').timepicker(o)
});
side = ''
modnum = []
$(".tem").hide()
define = $(".define")
groupId = ''
//sort
$.ajax({
    type: "GET",
    url: "http://163.18.42.222:8888/Fiestadb/Tag/select",
    beforeSend:function(xhr){
        xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
    },
    success: function (data) {
        $.each(data.result, function (indexInArray, content) {
            for(i = 0;i<content.length;i++) {
                sort = '<div class="sort-circle options">' + content[i] + '</div>'
                $("div.choose").append(sort)
            }
        });
    }
});


$("button#gotem").click(function (e) {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    $("div#choose-timeliness").hide()
    $('div#choose-temporarily').show()
    side = 'left'
    $(".first").hide()
    $(".tem").hide()
});


$(document).on('click', ".next", function () {
    if($(this).hasClass("right")){
        if($("#groupSelect").children().length == 0){
            location.href = "/Group"
        }else{
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $("div#choose-timeliness").hide()
            $('div#choose-first').show()
            side = 'right'
            $(".first").show()
            $("div#event-bar").css("width", "15%")
        }
    }else if($(this).hasClass("tem-group")){
        if($("#temgroupName").val() == ""){
            $(".temerror").html("填完才能下一步！")
        }else{
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $("div#choose-temporarily").hide()
            $("div#choose-first").show()
            $("#temtext").val($("#temgroupName").val())
            $(".tem").show()
            $("div#event-bar").css("width", "30%")
        }
    }else if($(this).hasClass("event-info")){
        if($("#EventName").val() == "" || $("#Description").val() == ""){
            $("span.firsterror").html("全部填完才能下一步！")
        }else{
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $(this).parent().parent().parent().parent().parent().hide()
            $("div#choose-sort").show()
        }
    }else if($(this).hasClass("tag")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-sort").hide()
        $("div#choose-date").show()
    }else if($(this).hasClass("datetime")){
        if($("#datetimepicker1").val() == "" || $("#datetimepicker2").val() == "" || $("#peoplemax").val() == ""){
            $("span.daterror").html("全部填完才能下一步！")
        }else{
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $("div#choose-date").hide()
            $("div#choose-activity").show()
        }
    }else if($(this).hasClass("location")){
        if($("span#gid").html() == ""){
            $("span#locerror").show()
        }else{
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $("div#choose-select").show()
            $("div#choose-activity").hide()
        }
    }else if($(this).hasClass("select-mod")){
        $("div#choose-select").hide()
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        if($(this).html() == "下一步"){
            for(k = modnum.length-1;k>=0;k--){
                if(modnum[k] == '6'){
                    break
                }else if(modnum[k] == '4'){
                    $("button.next.schedule").html("送出")
                    $("button.next.schedule").removeClass("btn-primary")
                    $("button.next.schedule").addClass("btn-success")
                    break
                }else if(modnum[k] == '3'){
                    $("button.next.ticket").html("送出")
                    $("button.next.ticket").removeClass("btn-primary")
                    $("button.next.ticket").addClass("btn-success")
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
        }else if($(this).html() == "送出"){
            submitData()
            $("div#choose-finish").show()
            $("div#choose-select").hide()
        }
    }else if($(this).hasClass("ticket")){
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
    }else if($(this).hasClass("schedule")){
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
    }
});


$(document).on('click', ".previous", function () {
    if($(this).hasClass("tem-group")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-temporarily").hide()
        $("div#choose-timeliness").show()
        $(".tem").hide()
    }else if($(this).hasClass("event-info")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        if(side == 'right'){
            //right
            side = ''
            $(".tem").hide()
            $("div#choose-timeliness").show()
            $("div#choose-first").hide()
        }else{
            //left
            side = ''
            $("div#choose-temporarily").show()
            $("div#choose-first").hide()
        }
    }else if($(this).hasClass("tag")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-first").show()
        $("div#choose-sort").hide()
    }else if($(this).hasClass("datetime")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-sort").show()
        $("div#choose-date").hide()
    }else if($(this).hasClass("location")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-date").show()
        $("div#choose-activity").hide()
    }else if($(this).hasClass("select-mod")){
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        $("div#choose-activity").show()
        $("div#choose-select").hide()
    }else if($(this).hasClass("ticket")){
        $("div#choose-select").show()
        $("div#choose-ticket").hide()
    }else if($(this).hasClass("schedule")){
        $("div#choose-schedule").hide()
        for(i = 0;i < modnum.length;i++){
            if(modnum[i] == "3"){
                $("div#choose-ticket").show()
                break
            }else if(i == modnum.length){
                $("div#choose-select").show()
                break
            }
        }
    }else if($(this).hasClass("lotte")){
        $("div#choose-lotte").hide()
        for(i = modnum.length - 1;i >= 0;i--){
            if(modnum[i] == "4"){
                $("div#choose-schedule").show()
                break
            }else if(modnum[i] == "3"){
                $("div#choose-ticket").show()
                break
            }else if(i == 0){
                $("div#choose-select").show()
                break
            }
        }
    }
});

$(document).on('click', ".add", function () {
    if($(this).hasClass("ticket")){
        ticket = '<div class="row mt-2">' +
        '<div class="col-4"><input type="text" class="form-control ticketype" placeholder="票種"></div>'+
        '<div class="col-3"><input type="text" class="form-control ticketquan" placeholder="數量"></div>' +
        '<div class="col-3"><input type="text" class="form-control ticketprice" placeholder="價格"></div>' +
        '<div class="col-1 pl-0"><button class="btn btn-danger btn-radius-2 clear-float minus">–</button>' +
        '</div></div>'
        $("div#ticket-list").append(ticket)
    }else if($(this).hasClass("schedule")){
        schedulelist = '<div class="row mb-2 rc-2">' +
            '<div class="col-3"><input type="text" class="form-control schetitle" placeholder="時段主題"></div>'+
            '<div class="col-4"><input type="text" class="form-control schedetail" placeholder="說明"></div>'+
            '<div class="col-3 pr-0"><input type="text" class="datetimepicker3 form-control schestart"'+
            'placeholder="開始時間"></div><div class="col-1 mt-2"><button class="btn btn-danger btn-radius-2 clear-float minus">–</button></div></div>'
        $(".schedulelist").append(schedulelist)
        var o={
            timeOnlyShowDate: true,
            timeFormat: 'HH:mm',
            dateFormat: ''
        }
        $('.datetimepicker3').timepicker(o)
    }else if($(this).hasClass("lotte")){
        lottelist = '<div class="row mt-2 mb-2">' +
        '<div class="col"><input class="form-control lottename" type="text" placeholder="獎項"></div>' +
        '<div class="col-1"><button class="btn btn-danger btn-radius-2 clear-float minus">–</button></div></div>'
        $("#lottelist").append(lottelist)
    }
});


$(document).on('click', '.minus', function () {
    $(this).parent().parent().remove()
});


$("button.justSubmit").click(function (e) { 
    submitData()
    $("#choose-lotte").hide()
    $("#choose-finish").show()
});

$(document).on('click', ".options", function () {
    if($(this).hasClass("clicked")){
        for(i = 0;i < define.length;i ++){
            if($(this).text() == define[i].innerHTML){
                $(define).eq(i).removeClass("define-circle")
                $(define).eq(i).addClass("sort-circle")
                $(define).eq(i).html("請選擇<br>類別")
                break
            }
        }
        $(this).css("background-color", "")
        $(this).removeClass("clicked")
    }else if(define[0].innerHTML == "請選擇<br>類別"){
        $(this).css("background-color","#c3ddd2");
        define[0].innerHTML = $(this).text()
        $(this).addClass("clicked");
        define[0].setAttribute("class", "define-circle define")
    }else if(define[1].innerHTML == "請選擇<br>類別"){
        $(this).css("background-color","#c3ddd2");
        define[1].innerHTML = $(this).text()
        $(this).addClass("clicked");
        define[1].setAttribute("class", "define-circle define")
    }else if(define[2].innerHTML == "請選擇<br>類別"){
        $(this).css("background-color","#c3ddd2");
        define[2].innerHTML = $(this).text()
        $(this).addClass("clicked");
        define[2].setAttribute("class", "define-circle define")
    }else if(define[3].innerHTML == "請選擇<br>類別"){
        $(this).css("background-color","#c3ddd2");
        define[3].innerHTML = $(this).text()
        $(this).addClass("clicked");
        define[3].setAttribute("class", "define-circle define")
    }else{
        $.alert({
            content: "選項滿囉！"
        })
    }
});


$(document).on('click', '.define', function () {
    name = $(this).html()
    $.each($(".options"), function (index, value) {
        if(name == $(this).html())
        {
            $(this).css("background", "")
            $(this).removeClass("clicked")
        }
    });
    $(this).html("請選擇<br>類別")
    $(this).addClass("sort-circle");
    $(this).removeClass("define-circle");
});


//臨時群組
$("#temgroupName").change(function (e) { 
    $("div.member-list").children().remove(".createmember")
    if($("#temgroupName").val() != ""){
        if(!$("#temgroupName").val().match(/^\s+/)){
            data = {
                groupName: $(this).val()
            }
            $.ajax({
                type: "POST",
                url: "http://163.18.42.222:8888/Fiestadb/Group/FIndName",
                data: JSON.stringify(data),
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                },
                contentType: "application/json",
                datatype: JSON,
                success: function (data) {
                    if(data.code == "005")
                    $.alert({
                        title: "喔不！",
                        content: "名稱重複了！"
                    })
                },
            });
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:8888/Fiestadb/Account/ValidateLogin",
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            success: function (data) {
                $.each(data.result, function (indexInArray, content) {
                    $.cookie("qsacw", content.token, { expires: 7 })
                    if(content.Address != "None"){
                        $("#temAddress").val(content.Address)    
                    }
                    if(content.Phone != "None"){
                        $("#temPhone").val(content.Phone)    
                    }
                    if(content.Mail_1 != "None"){
                        $("#temEmail").val(content.Mail_1)    
                    }
                })
            }
        });
    }
    member = '<hr class="createmember"><div class="row createmember"><div class="col-2"><div class="test"></div></div>' +
    '<div class="col-3"><h6 class="lh-3">' + "你" +'</h6></div>' +
    '</div>'
    $("div.member-list").prepend(member)
});


//將成員加入群組
$(".add-group-member").click(function (e) { 
    if($("input#member").val() != ""){
        if(!$("input#member").val().match(/^\s+/))
        {
            data = {
                Search: $("input#member").val()
            }
            $.ajax({
                type: "POST",
                url: "http://163.18.42.222:8888/Fiestadb/Account/Search",
                data: JSON.stringify(data),
                contentType: "application/json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                },
                datatype: JSON,
                success: function (data) {
                    if(data.code == "013")
                    {
                    $.alert({
                        title: "喔不！",
                        content: "查無此會員！"
                    })
                    }else {
                        $.each(data.result, function (indexInArray, content) {
                            memberid = content.Id
                        });
                        member = '<div class="row"><div class="col-2"><div class="test"></div></div>' +
                        '<div class="col-3"><h6 class="lh-3">' + $("input#member").val() +'</h6></div>' +
                        '<div class="col-7"><button class="btn btn-danger btn-group add-group-member  del-member m-0 mt-2 p-1 float-right">' +
                        '<i class="fas fa-times"></i></button></div>' + '<span class="member-id">'
                            + memberid + '</span></div>'
                        $("div.member-list").append(member)
                        $("input#member").val("")
                        $("button.del-member").click(function (e) {
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
                                            par.remove()
                                        }
                                    },
                                    我再想想: function() {
                                    }
                                }
                            })
                        });
                    }
                }
            });
        }
    }
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
    if(check.eq(1).prop("checked") == true || check.eq(2).prop("checked") == true || check.eq(4).prop("checked") == true){
        $("button.next.select-mod").html("下一步")
        $("button.next.select-mod").addClass("btn-primary")
        $("button.next.select-mod").removeClass("btn-success")
    }
    if(check.eq(1).prop("checked") == false && check.eq(2).prop("checked") == false && check.eq(4).prop("checked") == false){
        $("button.next.select-mod").html("送出")
        $("button.next.select-mod").removeClass("btn-primary")
        $("button.next.select-mod").addClass("btn-success")
    }
});


$("#datetimepicker1").click(function (e) { 
    $("#ui-datepicker-div").css("z-index", 10)
    
});


function submitData() {
    act_Id = ""
    mod = ""
    de = $(".define").eq(0).text()
    for( var i = 1; i < $(".define").length; i++) {
        if($(".define").eq(i).text() != '請選擇類別'){
            de = de + ',' + ($(".define").eq(i).text());
        }
    }
    for(i = 0;i < modnum.length;i++){
        mod = mod + modnum[i] + ","
    }
    b = $("span#gid").html().split(",")
    a = b[0].split("(")
    lat = a[1]
    a = b[1].split(")")
    a = a[0].split(" ")
    long = a[1]
    mod = mod.substring(mod, mod.length-1)
    var startTime = $('#datetimepicker1').datepicker('getDate');
    var endTime = $('#datetimepicker2').datepicker('getDate');


    //startTime
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


    //chooseleft
    if(side == 'left'){
        temId = ""
        Id = parseInt($.cookie("Id"))
        data = {
            authId: [Id],
            groupName: $("#temgroupName").val(),
            Address: $("#temAddress").val(),
            Mail: $("#temEmail").val(),
            Phone: $("#temPhone").val(),
            Useable: "true",
            deadline: endTime
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:8888/Fiestadb/Group/upload",
            data: JSON.stringify(data),
            contentType: "application/json",
            async:false,
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            datatype: JSON,
            success: function (data) {
                $.each(data.result, function (indexInArray, content) {
                    temId = content.groupId
                    temmemberid = $('span.member-id').html()
                    if(temmemberid != undefined){
                        for(i = 0;i < temmemberid.length;i++){
                            data = {
                                authId: temmemberid[i],
                                groupId: temId
                            }
                            $.ajax({
                                type: "POST",
                                url: "http://163.18.42.222:8888/Fiestadb/Group/Member/upload",
                                data: JSON.stringify(data),
                                async:false,
                                contentType: "application/json",
                                beforeSend:function(xhr){
                                    xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                                },
                                datatype: JSON,
                                success: function (response) {
                                }
                            });
                        }
                    }
                });
            }
        });
        data = {
            act_Name: $("#EventName").val(),
            Tag: de,
            groupId: temId,
            startTime: startTime,
            endTime: endTime,
            act_Status: "true",
            Useable: "true",
            act_Description: $("#Description").val(),
            joinedCount: "0",
            peopleMaxium: $("#peoplemax").val(),
            Models: mod,
            Latitude: lat,
            Longitude: long,
            viewStatus: "true"
        }
    }else if(side == 'right'){
        for(i=0;i<$("select#groupSelect option").length;i++){
            if($("select#groupSelect option").eq(i).val() == $("#groupSelect").val()){
                Id = $("span.id").eq(i).html()
            }
        }
        data = {
            act_Name: $("#EventName").val(),
            Tag: de,
            groupId: Id,
            startTime: startTime,
            endTime: endTime,
            act_Status: "true",
            Useable: "true",
            act_Description: $("#Description").val(),
            joinedCount: "0",
            peopleMaxium: $("#peoplemax").val(),
            Models: mod,
            Latitude: lat,
            Longitude: long,
            viewStatus: "true"
        }
    }
    $.ajax({
        type: "POST",
        url: "http://163.18.42.222:8888/Fiestadb/Activity/upload",
        data: JSON.stringify(data),
        contentType: "application/json",
        async:false,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
        },
        datatype: JSON,
        success: function (data) {
            console.log(data)
            $.each(data.result, function (indexInArray, content) { 
                act_Id = content.act_Id
            });
        }
    });
    if($("#file").prop("files").length > 0){
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
            url: "http://163.18.42.222:8888//Fiestadb/uploadImage?type=act&Id=" + act_Id,
            data: form_data,
            success: function (data) {
            }
        });
    }
    for(i = 0;i < modnum.length;i++){
        if(modnum[i] == '3'){
            ticketype = $("input.ticketype")
            ticketquan = $("input.ticketquan")
            ticketprice = $("input.ticketprice")
            for(k = 0;k < ticketype.length;k++){
                data_3 = {
                    act_Id: act_Id,
                    ticketKinds: ticketype.eq(k).val(),
                    Mounts: parseInt(ticketquan.eq(k).val()),
                    Remainder: parseInt(ticketquan.eq(k).val()),
                    Price: parseInt(ticketprice.eq(k).val()),
                    Useable: "true"
                }
                    $.ajax({
                        type: "POST",
                        url: "http://163.18.42.222:8888/Fiestadb/Ticket/upload",
                        data: JSON.stringify(data_3),
                        async:false,
                        contentType: "application/json",
                        beforeSend:function(xhr){
                            xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                        },
                        datatype: JSON,
                        success: function (data) {
                        }
                    });
            }
        }else if(modnum[i] == '4'){
            date = startTime.split(" ")
            schetitle = $(".schetitle")
            schestart = $(".schestart")
            schedetail = $(".schedetail")
            for(k = 0;k < schestart.length;k++){
                schest = date[0] + schestart.eq(k).val() + ':00'
                data_4 = {
                    act_Id: act_Id,
                    showTime: schest,
                    Detail: schedetail.eq(k).val(),
                    showStatus: "true",
                    Useable: "true",
                    showName: schetitle.eq(k).val()
                }
                $.ajax({
                    type: "POST",
                    url: "http://163.18.42.222:8888/Fiestadb/Show/upload",
                    data: JSON.stringify(data_4),
                    async:false,
                    contentType: "application/json",
                    beforeSend:function(xhr){
                        xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
                    },
                    datatype: JSON,
                    success: function (data) {
                    }
                });
            }
        }else if(modnum[i] == '6'){
            lottename = $(".lottename")
            for(k = 0;k < lottename.length;k++){
                data_6 = {
                    act_Id: act_Id,
                    Prize: lottename.eq(k).val(),
                    Useable: "true"
                }
                $.ajax({
                    type: "POST",
                    url: "http://163.18.42.222:8888/Fiestadb/Lotte/upload",
                    data: JSON.stringify(data_6),
                    async:false,
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
    $.cookie("acid", act_Id)
    location.href = "/dashboard"
}
