$(document).ready(function () {
    getjoin()
    $("button.join-btn").click(function (e) {
        getjoin()
    });


    $("button.create-btn").click(function (e) {
        $(".myactitle").html('您創立的活動')
        $(".actlist").children().remove()
        data = {
            authId: $.cookie("Id")
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:8888/Fiestadb/Account/getCreateAct",
            data: JSON.stringify(data),
            contentType: "application/json",
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            datatype: JSON,
            success: function (data) {
                if(data.code != "013"){
                    $.each(data.result, function (indexInArray, content) { 
                        act = '<div class="card justify-content-md-center activity card-outline-Act">' +
                        '<div class="card-body"><h5 class="card-title">' +
                        content.act_Name + '</h5><span class="id">'+ content.Id +
                        '</span></div></div></div></div>'
                        $(".actlist").append(act)
                    });
                    $("div.card.activity").click(function (e) { 
                        $.cookie("acid", $(this).children(".card-body").children("span.id").html(), { expires: 7 })
                        window.location.href = "/editActivity/" + $(this).children(".card-body").children(".card-title").html()
                    });
                }
            }
        });
    });


    function getjoin() {
        $(".myactitle").html('您參加的活動')
        $(".actlist").children().remove()
        data = {
            Id: $.cookie("Id")
        }
        $.ajax({
            type: "POST",
            url: "http://163.18.42.222:8888/Fiestadb/Account/getUnexpiredAct",
            data: JSON.stringify(data),
            contentType: "application/json",
            datatype: JSON,
            beforeSend:function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"))
            },
            success: function (data) {
             console.log(data)
                if(data.code == "020"){
            $.alert({
                Title: "喔不!",
                Content: "此會員尚未進行驗證，先去驗證吧!"
            })
            location.href = '/MyProfile'
        }
                if(data.code != "012"){
                    for (var i = 0, l = data.result.length; i < l; i++) { //這邊的i是指目前算到第幾個json
                        for (var key in data.result[i]) {
                            if(key == 'act_Description'){
                                act_Description = data.result[i][key]
                            }
                            if(key == 'act_Id'){
                                act_Id = data.result[i][key]
                            }
                            if(key == 'act_Name'){
                                act_Name = data.result[i][key]
                            }
                            if(key == 'startTime'){
                                startTime = data.result[i][key]
                            }
                        }
                        act = '<div class="card justify-content-md-center activity card-outline-Act">' +
                        '<div class="card-body"><h5 class="card-title">' + act_Name + 
                        '</h5><p class="card-text">' + act_Description + 
                        '</p><span class="id">' + act_Id + '</span></div><div class="card-footer">' +
                        startTime + '</div></div></div></div>'
                        $(".actlist").append(act)
                        $("div.card").click(function (e) {
                            $.cookie("acid", $(this).children(".card-body").children("span.id").html(), { expires: 7 })
                            window.location.href = "/Activity/" + $(this).children(".card-body").children(".card-title").html()
                        });
                    }
                    /*
                    <div class="row justify-content-md-center"><div class="col-5"><div class="card justify-content-md-center activity card-outline-Act"><div class="card-body"><h5 class="card-title">party boy</h5><p class="card-text">歡迎來運動</p><span class="id"></span></div></div></div></div>
                    */
                }
            }
        });
      }
});