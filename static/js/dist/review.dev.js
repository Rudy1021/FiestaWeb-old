"use strict";

$(document).ready(function () {
  getAct();
});
$(document).on('click', '.fa-star', function () {
  setStar($(this));
});
/**
 * 取得活動
 */

function getAct() {
  dataActId = {
    Id: $.cookie('acid')
  };
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Activity/select',
    data: JSON.stringify(dataActId),
    async: false,
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function success(data) {
      $.each(data.result, function (indexInArray, content) {
        peopleId = content.joinedAuth;
        tagname = content.Tag;
        mod = content.Models;
        mod = mod.split(',');
        joinedCount = parseInt(content.joinedCount);
        peopleMaxium = parseInt(content.peopleMaxium);
        startTime = new Date(Date.parse(content.startTime));
        endTime = new Date(Date.parse(content.endTime));
        now = new Date();
        $('div#act_Description').html(content.act_Description);
        $('h5#title').html(content.act_Name);
        $('h6#startTime').html($('h6#startTime').html() + content.startTime);
        $('h6#endTime').html($('h6#endTime').html() + content.endTime);
        $('#act-img').prop('src', content.Photo);
      });

      if (joinedCount == peopleMaxium) {
        $('.btn').prop('disabled', 'disabled');
        $('.btn').html('已額滿');
      }

      for (i = 0; i < peopleId.length; i++) {
        if ($.cookie('Id') == peopleId[i]) {
          $('.btn').prop('disabled', 'disabled');
          $('.btn').html('已加入');
        }
      }

      for (j = 0; j < tagname.length; j++) {
        tag = '<div class="tag-box">' + tagname[j] + '</div>';
        $('#taglist').append(tag);
      }

      for (i = 0; i < mod.length; i++) {
        if (mod[i] == '3') {
          getTicket();
        } else if (mod[i] == '4' && mod[i + 1] == '5') {
          getShow();

          if (!$('div#act-question').is(':visible')) {
            if (now >= startTime || endTime >= now) {
              $('div#actmain').hide();
              $('div#real-time').show();
            }
          }
        } else if (mod[i] == '6') {
          $('#lotte-user').show();
        } else if (mod[i] == '8') {
          if (now >= endTime) {
            $('div#actmain').hide();
            $('.quest').show();
          }
        }
      }
    }
  });
}
/**
 * 設定是哪個星星被選中
 * @param {object} btn 取得按鈕
 */


function setStar(btn) {
  allstar = btn.parent().parent().children();

  for (i = 0; i < allstar.length; i++) {
    if (allstar.eq(i).hasClass('selected')) {
      allstar.eq(i).children().eq(0).addClass('far');
      allstar.eq(i).children().eq(0).removeClass('fas');
      allstar.eq(i).removeClass('selected');
    }

    if (btn.hasClass('far')) {
      btn.removeClass('far');
      btn.addClass('fas');
      btn.parent().addClass('selected');
    }
  }
}
/**
 * 發送問卷
 */


function scoreSubmit() {
  now = new Date().toISOString().substring(0, 10);
  Stars = $('.Stars').children('.selected').prop('id');
  Price = $('.Price').children('.selected').prop('id');
  Music = $('.Music').children('.selected').prop('id');
  Flow = $('.Flow').children('.selected').prop('id');
  Vibe = $('.Vibe').children('.selected').prop('id');
  Light = $('.Light').children('.selected').prop('id');
  Moveline = $('.Moveline').children('.selected').prop('id');
  Site = $('.Site').children('.selected').prop('id');
  Staff = $('.Staff').children('.selected').prop('id');
  data = {
    act_Id: $.cookie('acid'),
    authId: $.cookie('Id'),
    score_Date: now,
    Stars: parseInt(Stars),
    Price: parseInt(Price),
    Music: parseInt(Music),
    Flow: parseInt(Flow),
    Vibe: parseInt(Vibe),
    Light: parseInt(Light),
    Moveline: parseInt(Moveline),
    Site: parseInt(Site),
    Staff: parseInt(Staff),
    Useable: 'true',
    Detail: $('#Description').val()
  };
  /*
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/FeedBack/Score/Act/upload',
    data: JSON.stringify(data),
    async: false,
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function (data) {
      $('.showAct2').show();
      $('#act-question').hide();
      $('#real-time').hide();
    },
  });
  */

  return data;
}