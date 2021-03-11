$(document).ready(function() {
  const o={
    timeFormat: 'HH:mm',
    dateFormat: 'yy-mm-dd',
  };
  $('.datetimepicker3').datetimepicker(o);
  if ($.cookie('actid') != undefined) {
    selectAct();
    getJoinedList();
    getQrcode();
    refreshDataTable = setInterval(function() {
      $('tbody').children().remove();
      getJoinedList();
    }, 10000);
  }
});


$(document).on('focus', 'input[type=search]', function() {
  clearInterval(refreshDataTable);
});


$(document).on('focusout', 'input[type=search]', function() {
  refreshDataTable = setInterval(function() {
    $('tbody').children().remove();
    getJoinedList();
  }, 10000);
});


$(document).on('click', '.QRcode', function() {
  $.cookie('QRcode', $.cookie('actid'));
  location.href = '/QRcode';
});


$(document).on('click', '.QRcodereview', function() {
});


$(document).on('click', '.surveyPage', function() {
  location.href = '/dashboard/survey';
});


$(document).on('change', '.checkin', function() {
  ticketVaild($(this));
});


$(document).on('click', '.del', function() {
  deleteJoinedList($(this));
});


$(document).on('click', '.save-input', function() {
  updateAct();
});


$(document).on('click', '.to-edit', function(e) {
  $('.edit').show();
  $('.editinput').removeAttr('readonly');
  $('.editinput').removeAttr('disabled');
});


/**
 * 設定google map
 * @param {number} Actlng 緯度
 * @param {number} Actlat 經度
 */
function setGoogleMap(Actlng, Actlat) {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: Actlng, lng: Actlat},
    disableDefaultUI: true,
  });
  const infoWindow = new google.maps.InfoWindow(
      {content: '活動地點', position: {lat: Actlng, lng: Actlat}});
  infoWindow.open(map);
}


/**
 * 顯示選擇的活動
 */
function selectAct() {
  dataSelectAct = {
    Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/select',
    data: JSON.stringify(dataSelectAct),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        $('.join-count').html(content.joinedCount +
          ' / ' + content.peopleMaxium);
        decide = (parseInt(content.joinedCount) /
        parseInt(content.peopleMaxium));
        $('.peoplemax').val(content.peopleMaxium);
        $('.startTime').val(content.startTime);
        $('.endTime').val(content.endTime);
        $('.act_Description').val(content.act_Description);
        decide = decide.toFixed(2);
        decide = decide * 100;
        $('.peoplebar').css('width', decide + '%');
        $('.act-title').html(content.act_Name);
        $('title').html('後台-' + content.act_Name);
        Tag = content.Tag;
        $('.actImg').prop('src', content.Photo);
        mod = content.Models;
        mod = mod.split(',');
        setGoogleMap(parseFloat(content.Latitude),
            parseFloat(content.Longitude));
      });
      if (mod.includes('2')) {
        $('th.ticketitle').remove();
      }
      for (i = 0; i < Tag.length; i++) {
        tagname = '<div class="tag-box">' + Tag[i] + '</div>';
        $('.taglist').append(tagname);
      }
    },
  });
}


/**
 * 取得參加名單
 */
function getJoinedList() {
  dataGetJoinedList = {
    act_Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/getJoinedList',
    data: JSON.stringify(dataGetJoinedList),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          if ($('th.ticketitle').length > 0) {
            if (content.ticketStatus == '0') {
              tables = '<tr><td>' + content.userName +
              '</td><td>' + content.nickName + '</td>' +
              '<td>' + content.ticketKinds + '</td>' +
              '<td>'+ '未使用' +'</td>' +
              '<td>' + content.Notes + '</td>' +
              '<td class="pt-3"><label class="switch">' +
              '<span class="authid">' + content.authId +
              '</span><input type="checkbox" class="checkin">' +
              '<span class="slider round"></span></label></td>' +
              '<td><button class="btn btn-danger btn-circle del">' +
              '<i class="fas fa-minus"></i></button></td></tr>';
              $('tbody').append(tables);
            } else {
              tables = '<tr><td>' + content.userName +
              '</td><td>' + content.nickName + '</td>' +
              '<td>' + content.ticketKinds + '</td>' +
              '<td>'+ '已使用' +'</td>' +
              '<td>' + content.Notes + '</td>' +
              '<td class="pt-3"><label class="switch">' +
              '<span class="authid">' + content.authId +
              '</span><input type="checkbox" checked class' +
              '="checkin"><span class="slider round"></span></label></td>' +
              '<td><button class="btn btn-danger btn-circle del">' +
              '<i class="fas fa-minus"></i></button></td></tr>';
              $('tbody').append(tables);
            }
          } else {
            if (content.ticketStatus == '0') {
              tables = '<tr><td>' + content.userName +
              '</td><td>' + content.nickName + '</td>' +
              '<td>'+ '未使用' +'</td>' +
              '<td>' + content.Notes + '</td>' +
              '<td class="pt-3"><label class="switch">' +
              '<span class="authid">' + content.authId +
              '</span><input type="checkbox" class="checkin">' +
              '<span class="slider round"></span></label></td>' +
              '<td><button class="btn btn-danger btn-circle del">' +
              '<i class="fas fa-minus"></i></button></td></tr>';
              $('tbody').append(tables);
            } else {
              tables = '<tr><td>' + content.userName +
              '</td><td>' + content.nickName + '</td>' +
              '<td>'+ '已使用' +'</td>' +
              '<td>' + content.Notes + '</td>' +
              '<td class="pt-3"><label class="switch">' +
              '<span class="authid">' + content.authId +
              '</span><input type="checkbox" checked ' +
              'class="checkin"><span class="slider round">' +
              '</span></label></td>' +
              '<td><button class="btn btn-danger del' +
              'btn-circle"><i class="fas fa-minus"></i></button></td></tr>';
              $('tbody').append(tables);
            }
          }
        });
      }
    },
  });
  // eslint-disable-next-line new-cap
  $('#dataTable').DataTable();
}
/**
 * 取得Qrcode
 */
function getQrcode() {
  dataGetQRcode = {
    Input: location.protocol + '//' +
    location.hostname + '/check?id=' + $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/QRcode',
    data: JSON.stringify(dataGetQRcode),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $('.QRcode').prop('src', 'data:image/bmp;base64,' + data);
    },
  });
  dataGetReviewQRcode = {
    Input: location.protocol + '//' +
    location.hostname + '/review/' + $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/QRcode',
    data: JSON.stringify(dataGetReviewQRcode),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $('.QRcodereview').prop('src', 'data:image/bmp;base64,' + data);
    },
  });
}


/**
 * 手動驗票
 * @param {object} button 取得this
 */
function ticketVaild(button) {
  if ($(button).prop('checked') == true) {
    dataChange = {
      act_Id: $.cookie('actid'),
      authId: $(button).prev().html(),
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/vaild',
      data: JSON.stringify(dataChange),
      contentType: 'application/json',
      async: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      success: function(response) {
      },
    });
  } else {
    dataVaildFalse = {
      act_Id: $.cookie('actid'),
      authId: $(button).prev().html(),
    };
    $.confirm({
      title: '警告',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '確定要取消嗎？',
      buttons: {
        確定: {
          btnClass: 'btn-success',
          action: function() {
            $.ajax({
              type: 'POST',
              url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/updateTicketStatusFalse',
              data: JSON.stringify(dataVaildFalse),
              contentType: 'application/json',
              async: false,
              beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + $.cookie('qsacw'));
              },
              success: function(data) {
                $('tbody').children().remove();
                getJoinedList();
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

/**
 * 刪除名單成員
 * @param {object} button 取得this物件
 */
function deleteJoinedList(button) {
  Id = $(button).parent().prev().children('.switch').children('.authid').html();
  $.confirm({
    title: '警告',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '確定要刪除嗎？無法恢復',
    buttons: {
      確認: {
        btnClass: 'btn-danger',
        action: function() {
          dataDelete = {
            act_Id: $.cookie('actid'),
            authId: Id,
          };
          $.ajax({
            type: 'POST',
            url: 'https://fiesta-o2o.tw/Fiestadb/Activity/deleteJoinedList',
            data: JSON.stringify(dataDelete),
            contentType: 'application/json',
            async: false,
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization',
                  'Bearer ' + $.cookie('qsacw'));
            },
            success: function(response) {
              $('tbody').children().remove();
              getJoinedList();
            },
          });
        },
      },
      我再想想: function() {
      },
    },
  });
}
/**
 * 更新活動資訊
 */
function updateAct() {
  dataSave = {
    act_Id: $.cookie('actid'),
    startTime: $('.startTime').val(),
    endTime: $('.endTime').val(),
    peopleMaxium: $('.peoplemax').val(),
    act_Description: $('.act_Description').val(),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/update',
    data: JSON.stringify(dataSave),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      location.reload();
    },
  });
}
