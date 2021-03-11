$(document).ready(function() {
  getAct();
  scoreShow();
});


$(document).on('click', '#submitques', function() {
  scoreSubmit();
});


$(document).on('click', '.tick-sub', function() {
  setJoinedList();
});


$(document).on('click', '.joinClick', function() {

});


/**
   * 加入活動
   */
function setJoinedList() {
  if ($.cookie('kind')) {
    datasetJoinedList = {
      act_Id: $.cookie('acid'),
      authId: $.cookie('Id'),
      ticketKinds: $.cookie('kind'),
      Notes: $('#Remark').val(),
    };
  } else {
    datasetJoinedList = {
      act_Id: $.cookie('acid'),
      authId: $.cookie('Id'),
      Notes: $('#Remark').val(),
    };
  }
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/setJoinedList',
    data: JSON.stringify(datasetJoinedList),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '018') {
        $.confirm({
          title: '警告',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '已經加入此活動',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
              },
            },
          },
        });
      } else if (data.code == '020') {
        $.confirm({
          title: '警告',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '尚未驗證此會員',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
                location.href = '/MyProfile';
              },
            },
          },
        });
      } else if (data.code == '019') {
        $.confirm({
          title: '錯誤',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '憑證過期，請重新登入',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
                $('#logout').click();
              },
            },
          },
        });
      } else if (data.code == '001') {
        $.confirm({
          title: '成功',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '報名成功！',
          buttons: {
            確定: {
              btnClass: 'btn-success confirm',
              action: function() {
              },
            },
          },
        });
        $('button.joinClick').html('已加入').prop('disabled', 'disabled');
        $('.ticketsub').html('已購票').prop('disabled', 'disabled');
      } else {
        $.confirm({
          title: '失敗',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '未知錯誤！ 請稍後再試！',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
                location.reload();
              },
            },
          },
        });
      }
    },
  });
  $('.close-sub').click();
}

/**
 * 取得活動
 */
function getAct() {
  dataActId = {
    Id: $.cookie('acid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/select',
    data: JSON.stringify(dataActId),
    async: false,
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
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
    },
  });
}
/**
 * 取得售票
 */
function getTicket() {
  $('.joinClick').hide();
  dataSelectByAct = {
    act_Id: $.cookie('acid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/SelectByAct',
    data: JSON.stringify(dataSelectByAct),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          ticketlist = '<div class="row"><div class="col lh-3 text-center">' +
            content.ticketKinds + '</div><div class="col lh-3 text-center"' +
            ' id="ticketprice-' + (indexInArray + 1) + '">NT.' + content.Price +
            '</div><div class="col lh-3 text-center" id="ticketquan-' +
            (indexInArray + 1) + '">' + content.Remainder + '張' +
            '</div><div class="col pt-2' +
            ' text-center"><button class="btn btn-success mt-0 ticketsub' +
            ' emailtest" type="button" id="ticketind-' + (indexInArray + 1) +
            '">購票</button></div></div>';
          $('#ticketist').append(ticketlist);
        });
      }
    },
  });
  if ($('.join-btn').html() == '已加入') {
    $('.ticketsub').html('已購票').prop('disabled', 'disabled');
  }
}


/**
 * 取得活動排程 若有即時資訊就會顯示
 */
function getShow() {
  dataShow = {
    act_Id: $.cookie('acid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Show/select',
    data: JSON.stringify(dataShow),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          time = content.showTime.split(' ')[1];
          list = '<div class="accordion" id="accordionExample">' +
            '<a data-toggle="collapse" data-target="#collapse-' +
            (indexInArray + 1) +
            '" aria-expanded="true" aria-controls="collapse-' +
            (indexInArray + 1) + '"><div class="now-time"><span class="ml-3">' +
            '</span><span class="ml-3">' + time + '</span><span class="ml-3">' +
            content.showName + '</span></div></a><div id="collapse-' +
            (indexInArray + 1) +
            '" class="collapse" aria-labelledby="heading-' +
            (indexInArray + 1) + '" data-parent="#accordionExample">' +
            '<div class="card-body"><span class="p-1 dripicons dripicons-' +
            'information"></span>' + content.Detail + '</div></div></div>';
          $('.schelist').append(list);
        });
      }
    },
  });
  $('#real-time').show();
}

/**
 * 依照時間顯示問卷
 */
function scoreShow() {
  now = new Date();

  endTime = $('#endTime').val().split('間')[1];
  endTime = new Date(Date.parse(endTime));
  if (now > endTime) {
    $('.act-question').show();
  }
}
