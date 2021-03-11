"use strict";

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "https://fiesta.nkust.edu.tw/Fiestadb/Tag/select",
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"));
    },
    success: function success(data) {
      $.each(data.result, function (indexInArray, content) {
        for (i = 0; i < content.length; i++) {
          sort = '<div class="tag-box">' + content[i] + '</div>';
          $("div.tag-list").append(sort);
        }
      });
      $(".tag-box").on('click', function () {
        $("#tag").val($(this).text() + "," + $("#tag").val());
      });
    }
  });
  $("#file").change(function (e) {
    readURL(this);
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      console.log(input.files[0]);
      var reader = new FileReader();
      img = $(input).parent().parent();

      reader.onload = function (e) {
        $(img).css("background-image", "url(" + e.target.result + ")");
        $(img).css("cursor", "grab");
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  var o = {
    timeFormat: 'HH:mm',
    dateFormat: 'yy-mm-dd',
    minDate: "-0d"
  };
  $('.DateTime').datetimepicker(o);
  $(".submit").on('click', function () {
    submit = true;

    for (i = 0; i < $(".behoove").length; i++) {
      if ($(".behoove").eq(i).val() == "") {
        $.confirm({
          title: '錯誤！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '有欄位未填！',
          buttons: {
            確認: {
              btnClass: 'btn-warning',
              action: function action() {}
            }
          }
        });
        submit = false;
        break;
      }
    }

    Now = new Date();
    start = new Date(Date.parse($("#startTime").val()));
    endTime = new Date(Date.parse($("#endTime").val()));

    if (Now.getMonth() + 1 < 10) {
      NowMonth = "0" + (Now.getMonth() + 1).toString();
    }

    if (Now.getDate() < 10) {
      NowDate = "0" + Now.getDate().toString();
    }

    NowTime = Now.getFullYear().toString() + NowMonth + NowDate;

    if (start.getMonth() + 1 < 10) {
      startMonth = "0" + (start.getMonth() + 1).toString();
    }

    if (start.getDate() < 10) {
      startDate = "0" + start.getDate().toString();
    }

    startTime = start.getFullYear().toString() + startMonth + startDate;

    if (Now > startTime) {
      wrongTime();
    } else if (Now == startTime) {} else if (Now < startTime) {
      submitAd();
    }
    /*
    if(Now.getFullYear() > startTime.getFullYear()){
        submit = false
        wrongTime()
    }else if(Now.getMonth() > startTime.getMonth() && Now.getFullYear() >= startTime.getFullYear()){
        submit = false
        wrongTime()
    }else if(Now.getDate() > startTime.getDate() && Now.getFullYear() >= startTime.getFullYear() && Now.getMonth() >= startTime.getMonth()){
        submit = false
        wrongTime()
    }else if(Now.getHours() > startTime.getHours()){
        submit = false
        wrongTime()
    }else if(Now.getMinutes() > startTime.getMinutes()){
        submit = false
        wrongTime()
    }else if(startTime.getFullYear() > endTime.getFullYear()){
        submit = false
        wrongTime()
    }else if(startTime.getMonth()+1 > endTime.getMonth()+1){
        submit = false
        wrongTime()
    }else if(startTime.getDate() > endTime.getDate()){
        submit = false
        wrongTime()
    }else if(startTime.getHours() > endTime.getHours()){
        submit = false
        wrongTime()
    }else if(startTime.getMinutes() > endTime.getMinutes()){
        submit = false
        wrongTime()
    }
    */

  });
});

function submitAd() {
  data_AdsUpload = {
    Ads_Name: $("#Ads_Name").val(),
    Tag: $("#tag").val(),
    Source: $("#Source").val(),
    startTime: $("#startTime").val(),
    endTime: $("#endTime").val(),
    Price: $("#Price").val(),
    Content: $("#Content").val(),
    viewStatus: "true",
    Useable: "true"
  };
  $.ajax({
    type: "POST",
    url: "http://163.18.42.222:8888/Fiestadb/Ads/upload",
    data: JSON.stringify(data_AdsUpload),
    contentType: "application/json",
    datatype: JSON,
    async: false,
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("qsacw"));
    },
    success: function success(data) {
      console.log(data);
    }
  });
}

function wrongTime() {
  $.confirm({
    title: '錯誤！',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '時間錯誤！',
    buttons: {
      確認: {
        btnClass: 'btn-Warring',
        action: function action() {}
      }
    }
  });
}

function cropInit() {
  cr = $croppie.croppie({
    viewport: {
      width: img_w,
      height: img_h
    },
    boundary: {
      width: img_w,
      height: img_h
    },
    mouseWheelZoom: false,
    enableOrientation: true
  });
  $(".cr-slider-wrap").append('<button id="cr-rotate" onClick="cropRotate(-90);">↻ Rotate</button>');
  bindCropImg();
} //綁定圖片


function bindCropImg() {
  cr.croppie('bind', {
    url: cr_img
  });
} //旋轉按鈕


function cropRotate(deg) {
  cr.croppie('rotate', parseInt(deg));
} //取消裁切


function cropCancel() {
  if ($upload.is(':hidden')) {
    $upload.fadeIn(300).siblings().hide();
    fileselect.value = "";
    isCrop = 0;
  }
} //圖片裁切


function cropResult() {
  if (!isCrop) {
    isCrop = 1;
    cr.croppie('result', {
      type: 'canvas',
      // canvas(base64)|html
      size: {
        width: img_w,
        height: img_h
      },
      //'viewport'|'original'|{width:500, height:500}
      format: 'jpeg',
      //'jpeg'|'png'|'webp'
      quality: 1 //0~1

    }).then(function (resp) {
      $crop.hide();
      $result.find('img').attr('src', resp);
      $result.fadeIn(300);
    });
  }
}