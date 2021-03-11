$(document).ready(function() {
  startTime = '';
  selectAct();
});


$(document).on('click', '.save', function() {
  if ($(this).hasClass('models')) {
    updateMod();
  } else if ($(this).hasClass('show')) {
    updateShow();
  } else if ($(this).hasClass('ticket')) {
    updateTicket();
  } else if ($(this).hasClass('lotte')) {
    updateLotte();
  }
  location.reload();
});


$(document).on('click', '.del-lotte', function() {
  del($(this).parent().parent().prop('id'), 'lotte');
});
$(document).on('click', '.del-schedule', function() {
  del($(this).parent().parent().prop('id'), 'show');
});
$(document).on('click', '.del-ticket', function() {
  del($(this).parent().parent().prop('id'), 'ticket');
});


$(document).on('click', '.to-edit', function() {
  editButton($(this));
});


$(document).on('click', '.cancel-edit', function() {
  $.confirm({
    title: '警告',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '確定取消嗎？',
    buttons: {
      確定: {
        btnClass: 'btn-danger',
        action: function() {
          location.reload();
        },
      },
      我再想想: function() {
      },
    },
  });
});


$(document).on('click', '.add', function() {
  addButton($(this));
});


/**
   * 選擇活動
   */
function selectAct() {
  dataSelect = {
    Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/select',
    data: JSON.stringify(dataSelect),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        mod = content.Models;
        startTime = content.startTime;
      });
      mod = mod.split(',');
      if (mod != '') {
        for (i = 0; i < mod.length; i++) {
          $('.check-mod[value=' + mod[i] + ']').prop('checked', 'checked');
          if (mod[i] == '3') {
            selectTicket();
          } else if (mod[i] == '4') {
            selectShow();
          } else if (mod[i] == '6') {
            selectLotte();
          }
        }
      }
    },
  });
}
/**
   * 選擇活動的票券設定（如果有開啟進階活動模組）
   */
function selectTicket() {
  $('.closeticket').remove();
  dataSelectByAct = {
    act_Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/SelectByAct',
    data: JSON.stringify(dataSelectByAct),
    contentType: 'application/json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(_indexInArray, content) {
          ticket = '<div class="ticket row" id="' + content.Id +
            '"><div class="col-5"><input type="text" class=' +
            '"form-control ticket ticketype" placeholder="票券名稱" value="' +
            content.ticketKinds + '" disabled></div>' +
            '<div class="col-3"><input type="text" class="form-control tic' +
            'ketquan ticket" placeholder="數量" value="' + content.Remainder +
            '" disabled></div><div class="col-3"><input type="text" ' +
            'class="form-control tick' +
            'etprice ticket" placeholder="價格" value="' + content.Price +
            '" disabled></div>' +
            '<div class="col-1"><button class="btn btn-danger btn-up btn-cir' +
            'cle btn-sm del-ticket"><i class="fas fa-minus"></i></button></di' +
            'v></div>';
          $('.ticketlist').append(ticket);
        });
        addButtonHtml = '<div class="time-a' +
        'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
        ' btn-radius add ticket">+</button></div>';
        $('.ticketlist').append(addButtonHtml);
      } else if (data.code == '013') {
        ticket = '<div class="row ticket"><div class="col-5">' +
          '<input type="text" class="form-control ticket ticke' +
          'type" placeholder="票券名稱"></div>' +
          '<div class="col-3"><input type="text" class="form-contr' +
          'ol ticketquan ticket" placeholder="數量"></div>' +
          '<div class="col-3"><input type="text" class="form-control ' +
          'ticketprice ticket" placeholder="價格"></div>' +
          '<div class="col-1"><button class="btn btn-danger btn-up btn' +
          '-circle btn-sm del-ticket"><i class="fas fa-minus"></i></but' +
          'ton></div></div><div class="time-a' +
          'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
          ' btn-radius add ticket">+</button></div>';
        $('.ticketlist').append(ticket);
        $('.ticket.to-edit').click();
      }
    },
  });
}
/**
   * 選擇活動的排程設定（如果有開啟進階活動模組）
   */
function selectShow() {
  const o={
    timeOnlyShowDate: true,
    timeFormat: 'HH:mm',
    dateFormat: '',
    controlType: 'select',
  };
  $('.closeschedule').remove();
  dataSelectShow = {
    act_Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Show/select',
    data: JSON.stringify(dataSelectShow),
    contentType: 'application/json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(_indexInArray, content) {
          showTime = content.showTime.split(' ')[1];
          showlist = '<div class="show row" id="' + content.Id +'">' +
            '<div class="col-3"><input type="text" class="form-control showNa' +
            'me show" placeholder="時段主題" value="' + content.showName +
            '" disabled></div><div class="col"><input type="text"' +
            ' class="form-control Detail show" placeholder="說明" value="' +
            content.Detail +'" disabled></div><div class="col-3">' +
            '<input type="text" class="form-control datetimepicker3 ' +
            'showTime show" placeholder="開始時間" value="' + showTime +
            '" disabled></div><div class="col-1"><button class="btn ' +
            'btn-danger btn-up btn-circle btn-sm del-schedule"><i clas' +
            's="fas fa-minus"></i></button></div></div>';
          $('.showlist').append(showlist);
        });
        addButtonHtml = '<div class="time-a' +
        'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
        ' btn-radius add show">+</button></div>';
        $('.showlist').append(addButtonHtml);
      } else if (data.code == '013') {
        showlist = '<div class="row show"><div class' +
          '="col-3"><input type="text" class="form-contr' +
          'ol showName show" placeholder="時段主題"></div>' +
          '<div class="col"><input type="text" class="fo' +
          'rm-control Detail show" placeholder="說明"></div>' +
          '<div class="col-3"><input type="text" class="fo' +
          'rm-control showTime show" placeholder="開始時間"></div>' +
          '<div class="col-1"><button class="btn btn-danger b' +
          'tn-up btn-circle btn-sm del-schedule"><i class="fas fa' +
          '-minus"></i></button></div></div><div class="time-a' +
          'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
          ' btn-radius add show">+</button></div>';
        $('.showlist').append(showlist);
        $('.show.to-edit').click();
      }
      $('.showTime').timepicker(o);
    },
  });
}
/**
   * 選擇活動的抽獎設定（如果有開啟進階活動模組）
   */
function selectLotte() {
  $('.closelotte').remove();
  dataLotte = {
    act_Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Lotte/select',
    data: JSON.stringify(dataLotte),
    contentType: 'application/json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(_indexInArray, content) {
          lottelist = '<div class="lotte row" id="' + content.Id + '">' +
            '<div class="col"><input type="text" class="form-control ' +
            'lottename lotte" placeholder="獎項" value="' + content.Prize +
            '" disabled></div><div class="col-1"><button class="btn ' +
            'btn-danger btn-up btn-circle btn-sm del-lotte"><i class=' +
            '"fas fa-minus"></i></button></div></div>';
          $('.lottelist').append(lottelist);
        });
        addButtonHtml = '<div class="time-a' +
        'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
        ' btn-radius add lotte">+</button></div>';
        $('.lottelist').append(addButtonHtml);
      } else if (data.code == '013') {
        lottelist = '<div class="row lotte"><div class="col"><input ' +
          'type="text" class="form-control lottename lotte" placeholde' +
          'r="獎項"></div>' +
          '<div class="col-1"><button class="btn btn-danger btn-up ' +
          'btn-circle btn-sm del-lotte"><i class="fas fa-minus"></' +
          'i></button></div></div><div class="time-a' +
          'dd-2 clear-float text-center"><button class="btn btn-info mt-2' +
          ' btn-radius add lotte">+</button></div>';
        $('.lottelist').append(lottelist);
        $('.lotte.to-edit').click();
      }
    },
  });
}
/**
   * 選擇活動的進階活動模組設定
   */
function updateMod() {
  modstr = '';
  modlist = $('.check-mod:checked');
  for (i = 0; i < modlist.length; i ++) {
    if (i == 0) {
      modstr = modlist.eq(i).val();
    } else {
      modstr = modstr + ',' + modlist.eq(i).val();
    }
  }
  dataUpdateMod = {
    act_Id: $.cookie('actid'),
    Models: modstr,
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/update',
    data: JSON.stringify(dataUpdateMod),
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    contentType: 'application/json',
    datatype: JSON,
    success: function(response) {
      location.reload();
    },
  });
}

/**
 * 開啟編輯功能
 * @param {string} id 取得this物件
 */
function editButton(id) {
  if (id.hasClass('modlist')) {
    $('input.check-mod').removeAttr('disabled');
    $('.edit-models').show();
  } else if (id.hasClass('show')) {
    $('input.show').removeAttr('disabled');
    $('.showlist').append('<div class="text-center mt-2 btn-area show">' +
    '<button class="btn btn-dark cancel-edit">取消</button>' +
    '<button class="btn btn-primary btn-main save show">儲存</button></div>');
    $('.del-schedule').show();
    $('.add.show').show();
  } else if (id.hasClass('ticket')) {
    $('input.ticket').removeAttr('disabled');
    $('.ticketlist').append('<div class="text-center mt-2 btn-area ticket">' +
    '<button class="btn btn-dark cancel-edit">取消</button>' +
    '<button class="btn btn-primary btn-main save ticket">儲存</button></div>');
    $('.del-ticket').show();
    $('.add.ticket').show();
  } else if (id.hasClass('lotte')) {
    $('input.lotte').removeAttr('disabled');
    $('.lottelist').append('<div class="text-center mt-2 btn-area lotte">' +
    '<button class="btn btn-dark cancel-edit">取消</button>' +
    '<button class="btn btn-primary btn-main save lotte">儲存</button></div>');
    $('.del-lotte').show();
    $('.add.lotte').show();
  }
}


/**
 * 上傳票券
 */
function updateTicket() {
  ticketInput = $('input.ticket');
  for (i = 0; i < ticketInput.length/3; i++) {
    if (ticketInput.eq(0 + (3 * i)).val() != '' &&
    ticketInput.eq(1 +(3 * i)).val() != '' &&
    ticketInput.eq(2 + (3 * i)).val() != '') {
      if ($('.ticket.row').eq(i).prop('id') == '') {
        dataUploadTicket = {
          ticketKinds: ticketInput.eq(0 + (3 * i)).val(),
          Mounts: parseInt(ticketInput.eq(1 +(3 * i)).val()),
          Price: parseInt(ticketInput.eq(2 + (3 * i)).val()),
          act_Id: $.cookie('actid'),
          Remainder: parseInt(ticketInput.eq(1 +(3 * i)).val()),
          Useable: 'true',
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/upload',
          data: JSON.stringify(dataUploadTicket),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      } else {
        dataUpdateTicket = {
          ticketKinds: ticketInput.eq(0 + (3*i)).val(),
          Mounts: ticketInput.eq(1 +(3*i)).val(),
          Price: ticketInput.eq(2 + (3*i)).val(),
          ticketId: $('.ticket.row').eq(i).prop('id'),
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/update',
          data: JSON.stringify(dataUpdateTicket),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      }
    } else {
      inputError();
    }
  }
}
/**
 * 欄位未填的提示
 */
function inputError() {
  $.confirm({
    title: '喔不！',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '有欄位未填！',
    buttons: {
      確認: {
        btnClass: 'btn-success',
        action: function() {
        },
      },
    },
  });
}


/**
 * add按鈕
 * @param {object} id 取得this物件
 */
function addButton(id) {
  if (id.hasClass('ticket')) {
    ticket = '<div class="row ticket"><div class="col-5">' +
    '<input type="text" class="form-control ticket ticke' +
    'type" placeholder="票券名稱"></div>' +
    '<div class="col-3"><input type="text" class="form-contr' +
    'ol ticketquan ticket" placeholder="數量"></div>' +
    '<div class="col-3"><input type="text" class="form-control ' +
    'ticketprice ticket" placeholder="價格"></div>' +
    '<div class="col-1"><button class="btn btn-danger btn-up btn' +
    '-circle btn-sm del-ticket"><i class="fas fa-minus"></i></but' +
    'ton></div></div>';
    $('.row.ticket').eq($('.row.ticket').length-1).after(ticket);
  } else if (id.hasClass('show')) {
    showlist = '<div class="row show"><div class' +
    '="col-3"><input type="text" class="form-contr' +
    'ol showName show" placeholder="時段主題"></div>' +
    '<div class="col"><input type="text" class="fo' +
    'rm-control Detail show" placeholder="說明"></div>' +
    '<div class="col-3"><input type="text" class="fo' +
    'rm-control showTime show" placeholder="開始時間"></div>' +
    '<div class="col-1"><button class="btn btn-danger b' +
    'tn-up btn-circle btn-sm del-schedule"><i class="fas fa' +
    '-minus"></i></button></div></div>';
    $('.row.show').eq($('.row.show').length-1).after(showlist);
    const o={
      timeOnlyShowDate: true,
      timeFormat: 'HH:mm',
      dateFormat: '',
      controlType: 'select',
    };
    $('.showTime').timepicker(o);
  } else if (id.hasClass('lotte')) {
    lottelist = '<div class="row lotte"><div class="col"><input ' +
    'type="text" class="form-control lottename lotte" placeholde' +
    'r="獎項"></div>' +
    '<div class="col-1"><button class="btn btn-danger btn-up ' +
    'btn-circle btn-sm del-lotte"><i class="fas fa-minus"></' +
    'i></button></div></div>';
    $('.row.lotte').eq($('.row.lotte').length-1).after(lottelist);
  }
}


/**
 * 上傳排程
 */
function updateShow() {
  showInput = $('input.show');
  startTime = startTime.split(' ');
  for (i = 0; i < showInput.length/3; i++) {
    if (showInput.eq(0 + (3 * i)).val() != '' &&
    showInput.eq(1 +(3 * i)).val() != '' &&
    showInput.eq(2 + (3 * i)).val() != '') {
      if ($('.row.show').eq(i).prop('id') == '') {
        dataUploadShow = {
          showName: showInput.eq(0 + (3*i)).val(),
          Detail: showInput.eq(1 +(3*i)).val(),
          showTime: startTime[0] + ' ' + showInput.eq(2 + (3*i)).val(),
          act_Id: $.cookie('actid'),
          showStatus: 'true',
          Useable: 'true',
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Show/upload',
          data: JSON.stringify(dataUploadShow),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      } else {
        dataUpdateShow = {
          showName: showInput.eq(0 + (3*i)).val(),
          Detail: showInput.eq(1 +(3*i)).val(),
          showTime: startTime[0] + ' ' + showInput.eq(2 + (3*i)).val(),
          showId: $('.row.show').eq(i).prop('id'),
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Show/update',
          data: JSON.stringify(dataUpdateShow),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      }
    } else {
      inputError();
    }
  }
}

/**
 * 上傳抽獎
 */
function updateLotte() {
  lotteInput = $('input.lotte');
  for (i = 0; i < lotteInput.length; i++) {
    if (lotteInput.eq(i).val() != '') {
      if ($('.row.lotte').eq(i).prop('id') == '') {
        dataUploadLotte = {
          Prize: lotteInput.eq(i).val(),
          act_Id: $.cookie('actid'),
          Useable: 'true',
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Lotte/upload',
          data: JSON.stringify(dataUploadLotte),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      } else {
        dataUpdateLotte = {
          lotteId: $('.row.lotte').eq(i).prop('id'),
          Prize: lotteInput.eq(i).val(),
        };
        $.ajax({
          type: 'POST',
          async: false,
          url: 'https://fiesta-o2o.tw/Fiestadb/Lotte/update',
          data: JSON.stringify(dataUpdateLotte),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(data) {
          },
        });
      }
    } else {
      inputError();
    }
  }
}


/**
 * 刪除進階活動模組的資料
 * @param {string} id 取得this的id
 * @param {string} type 確認是哪個模組
 */
function del(id, type) {
  if (type == 'ticket') {
    $.confirm({
      title: '警告',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '確定要刪除嗎？無法恢復',
      buttons: {
        確認: {
          btnClass: 'btn-danger',
          action: function() {
            dataDelTicket = {
              ticketId: id,
            };
            $.ajax({
              type: 'POST',
              url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/delete',
              data: JSON.stringify(dataDelTicket),
              contentType: 'application/json',
              beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + $.cookie('qsacw'));
              },
              datatype: JSON,
              success: function(response) {
                location.reload();
              },
            });
          },
        },
        我再想想: function() {
        },
      },
    });
  } else if (type == 'show') {
    $.confirm({
      title: '警告',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '確定要刪除嗎？無法恢復',
      buttons: {
        確認: {
          btnClass: 'btn-danger',
          action: function() {
            dataDelShow = {
              showId: id,
            };
            $.ajax({
              type: 'POST',
              url: 'https://fiesta-o2o.tw/Fiestadb/Show/delete',
              data: JSON.stringify(dataDelShow),
              contentType: 'application/json',
              beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + $.cookie('qsacw'));
              },
              datatype: JSON,
              success: function(response) {
                location.reload();
              },
            });
          },
        },
        我再想想: function() {
        },
      },
    });
  } else if (type == 'lotte') {
    $.confirm({
      title: '警告',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '確定要刪除嗎？無法恢復',
      buttons: {
        確認: {
          btnClass: 'btn-danger',
          action: function() {
            dataDelLotte = {
              lotteId: id,
            };
            $.ajax({
              type: 'POST',
              url: 'https://fiesta-o2o.tw/Fiestadb/Lotte/delete',
              data: JSON.stringify(dataDelLotte),
              contentType: 'application/json',
              beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + $.cookie('qsacw'));
              },
              datatype: JSON,
              success: function(response) {
                location.reload();
              },
            });
          },
        },
        我再想想: function() {
        },
      },
    });
  }
}
