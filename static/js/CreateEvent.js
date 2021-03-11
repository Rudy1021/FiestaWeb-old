$(document).ready(function() {
  getTag();
  setMap();
  // choosedate
  const opt = {
    dateFormat: 'yy-mm-dd',
    timeFormat: 'HH:mm',
    controlType: 'select',
    oneLine: true,
    minDate: '-0d',
    beforeShow: function() {
      $('#ui-datepicker-div').css('z-index', 10);
    },
  };
  const o = {
    timeOnlyShowDate: true,
    timeFormat: 'HH:mm',
    dateFormat: '',
    controlType: 'select',
  };
  $('.startTime').datetimepicker(opt);
  $('.endTime').datetimepicker(opt);
  $('.datetimepicker3').timepicker(o);
});
$('.tem').hide();
define = $('.define');


$(document).on('click', '.next', function() {
  nextPage($(this));
});


$(document).on('click', '.previous', function() {
  previousPage($(this));
});


$(document).on('click', '.add', function() {
  addButton($(this));
});


// 刪除按鈕
$(document).on('click', '.minus', function() {
  $(this).parent().parent().remove();
});


$(document).on('click', '.options', function() {
  if ($(this).hasClass('clicked')) {
    for (i = 0; i < define.length; i++) {
      if ($(this).text() == define[i].innerHTML) {
        $(define).eq(i).removeClass('define-circle');
        $(define).eq(i).addClass('sort-circle');
        $(define).eq(i).html('請選擇<br>類別');
        break;
      }
    }
    $(this).css('background-color', '');
    $(this).removeClass('clicked');
  } else if (define[0].innerHTML == '請選擇<br>類別') {
    $(this).css('background-color', '#c3ddd2');
    define[0].innerHTML = $(this).text();
    $(this).addClass('clicked');
    define[0].setAttribute('class', 'define-circle define');
  } else if (define[1].innerHTML == '請選擇<br>類別') {
    $(this).css('background-color', '#c3ddd2');
    define[1].innerHTML = $(this).text();
    $(this).addClass('clicked');
    define[1].setAttribute('class', 'define-circle define');
  } else if (define[2].innerHTML == '請選擇<br>類別') {
    $(this).css('background-color', '#c3ddd2');
    define[2].innerHTML = $(this).text();
    $(this).addClass('clicked');
    define[2].setAttribute('class', 'define-circle define');
  } else if (define[3].innerHTML == '請選擇<br>類別') {
    $(this).css('background-color', '#c3ddd2');
    define[3].innerHTML = $(this).text();
    $(this).addClass('clicked');
    define[3].setAttribute('class', 'define-circle define');
  } else {
    $.alert({
      content: '選項滿囉！',
    });
  }
});


$(document).on('click', '.define', function() {
  name = $(this).html();
  $.each($('.options'), function(index, value) {
    if (name == $(this).html()) {
      $(this).css('background', '');
      $(this).removeClass('clicked');
    }
  });
  $(this).html('請選擇<br>類別');
  $(this).addClass('sort-circle');
  $(this).removeClass('define-circle');
});


// 將成員加入群組
$(document).on('click', '.add-group-member', function() {
  addGroupMember();
});


// 臨時群組
$('#temgroupName').change(function(e) {
  findName();
});


$('.check-mod').change(function(e) {
  nextOrSubmit();
});


$(document).on('click', '#datetimepicker1', function(e) {
  $('#ui-datepicker-div').css('z-index', 10);
});


/**
 * 查詢是否有名稱重複的群組
 */
function findName() {
  $('div.member-list').children().remove('.createmember');
  if ($('#temgroupName').val() != '' &&
    !$('#temgroupName').val().match(/^\s+/)) {
    dataFindName = {
      groupName: $('#temgroupName').val(),
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Group/FIndName',
      data: JSON.stringify(dataFindName),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      contentType: 'application/json',
      datatype: JSON,
      success: function(data) {
        if (data.code == '005') {
          $.confirm({
            title: '失敗！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '群組名稱重複！',
            buttons: {
              確定: {
                btnClass: 'btn-success confirm',
                action: function() {
                  $('#temgroupName').val('');
                },
              },
            },
          });
        } else if (data.code == '001') {
          insertProfile();
        }
      },
    });
  }
}

/**
 * 設定google Maps
 */
function setMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 22.7556518, lng: 120.3299092},
    zoom: 13,
    mapTypeId: 'roadmap',
  });
    // Create the search box and link it to the UI element.
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
        // Create a marker for each place.
      markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          }),
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    SaWa = [];
    SaWa.push(places[0]['geometry']['viewport']['Sa']['i']);
    SaWa.push(places[0]['geometry']['viewport']['Wa']['i']);
    return SaWa;
  });
}


/**
 * 若群組名稱沒重複，則把個人檔案的值填入表單
 */
function insertProfile() {
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Account/ValidateLogin',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        $.cookie('qsacw', content.token, {expires: 7}, {path: '/'});
        if (content.Address != 'None') {
          $('#temAddress').val(content.Address);
        }
        if (content.Phone != 'None') {
          $('#temPhone').val(content.Phone);
        }
        if (content.Mail_1 != 'None') {
          $('#temEmail').val(content.Mail_1);
        }
        member = '<hr class="createmember"><div class="row createmember">' +
          '<div class="col-2"><div class="test"></div></div>' +
          '<div class="col-3"><h6 class="lh-3">' + content.userName +
          '</h6></div></div>';
        $('div.member-list').prepend(member);
        $('div.createmember').children('.col-2').children('.test').css(
            'background-image', 'url("' + content.Photo + '")');
      });
    },
  });
}


/**
 * 取得Tag
 */
function getTag() {
  $.ajax({
    type: 'GET',
    url: 'https://fiesta-o2o.tw/Fiestadb/Tag/select',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        for (i = 0; i < content.length; i++) {
          sort = '<div class="sort-circle options">' + content[i] + '</div>';
          $('div.choose').append(sort);
        }
      });
    },
  });
}
/**
 * 下一頁
 * @param {object} id 拿取按鈕物件
 */
function nextPage(id) {
  $('html,body').animate({scrollTop: 0}, 'slow');
  if (id.hasClass('left')) {
    $('div#choose-timeliness').hide();
    $('div#choose-temporarily').show();
    $('.first').hide();
  } else if (id.hasClass('right')) {
    if ($('#groupSelect').children().length == 0) {
      location.href = '/Group';
    } else {
      $('div#choose-timeliness').hide();
      $('div#choose-first').show();
      $('.first').show();
      $('div#event-bar').css('width', '15%');
    }
  } else if (id.hasClass('tem-group')) {
    if ($('#temgroupName').val() == '') {
      $('.temerror').html('填完才能下一步！');
    } else {
      $('div#choose-temporarily').hide();
      $('div#choose-first').show();
      $('#temtext').val($('#temgroupName').val());
      $('.tem').show();
      $('div#event-bar').css('width', '30%');
    }
  } else if (id.hasClass('event-info')) {
    if ($('#EventName').val() == '' || $('#Description').val() == '') {
      $('span.firsterror').html('全部填完才能下一步！');
    } else {
      // id.parent().parent().parent().parent().parent().hide();
      $('#choose-first').hide();
      $('div#choose-sort').show();
    }
  } else if (id.hasClass('tag')) {
    $('div#choose-sort').hide();
    $('div#choose-date').show();
  } else if (id.hasClass('datetime')) {
    if ($('#datetimepicker1').val() == '' ||
      $('#datetimepicker2').val() == '' || $('#peoplemax').val() == '') {
      start = new Date(Date.parse($('.startTime').val()));
      end = new Date(Date.parse($('.startTime').val()));
      if (start < end) {
        $('span.daterror').html('時間設定錯誤');
      }
      $('span.daterror').html('全部填完才能下一步！');
    } else {
      $('div#choose-date').hide();
      $('div#choose-location').show();
    }
  } else if (id.hasClass('location')) {
    /* if ($('span#gid').html() == '') {
      $('span#locerror').show();
    } else {*/
    $('div#choose-select').show();
    $('div#choose-location').hide();
    // }
  } else if (id.hasClass('select-mod')) {
    $('div#choose-select').hide();
    if (id.html() == '下一步') {
      for (i = $('.check-mod:checked').length - 1; i >= 0; i--) {
        if ($('.check-mod:checked').eq(i).val() == '6') {
          $('button.next.ticket').html('下一步');
          $('button.next.ticket').addClass('btn-primary');
          $('button.next.ticket').removeClass('btn-success');
          $('button.next.schedule').html('下一步');
          $('button.next.schedule').addClass('btn-primary');
          $('button.next.schedule').removeClass('btn-success');
          break;
        } else if ($('.check-mod:checked').eq(i).val() == '4') {
          $('button.next.ticket').html('下一步');
          $('button.next.ticket').addClass('btn-primary');
          $('button.next.ticket').removeClass('btn-success');
          $('button.next.schedule').html('送出');
          $('button.next.schedule').removeClass('btn-primary');
          $('button.next.schedule').addClass('btn-success');
          break;
        } else if ($('.check-mod:checked').eq(i).val() == '3') {
          $('button.next.ticket').html('送出');
          $('button.next.ticket').removeClass('btn-primary');
          $('button.next.ticket').addClass('btn-success');
          break;
        }
      }
      for (m = 0; m < $('.check-mod:checked').length; m++) {
        if ($('.check-mod:checked').eq(m).val() == '3') {
          $('div#choose-ticket').show(); // gototicket
          break;
        } else if ($('.check-mod:checked').eq(m).val() == '4') {
          $('div#choose-schedule').show(); // gotoschedule
          break;
        } else if ($('.check-mod:checked').eq(m).val() == '6') {
          $('div#choose-lotte').show(); // gotolotte
          break;
        }
      }
    } else if (id.html() == '送出') {
      submitData();
      $('div#choose-finish').show();
      $('div#choose-select').hide();
    }
  } else if (id.hasClass('ticket')) {
    $('div#choose-ticket').hide();
    if (id.html() == '下一步') {
      for (k = 0; k < $('.check-mod:checked').length; k++) {
        if ($('.check-mod:checked').eq(k).val() == '4') {
          $('div#choose-schedule').show();
          break;
        } else if ($('.check-mod:checked').eq(k).val() == '6') {
          $('div#choose-lotte').show();
          break;
        }
      }
    } else if (id.html() == '送出') {
      submitData();
      $('div#choose-finish').show();
    }
  } else if (id.hasClass('schedule')) {
    count = 0;
    st = $('.schestart');
    for (k = $('.schestart').length; k > 1; k--) {
      schestart = '2019-10-21' + $('.schestart').eq(k - 2).val();
      schestart = new Date(Date.parse(schestart));
      schestart2 = '2019-10-21' + $('.schestart').eq(k - 1).val();
      schestart2 = new Date(Date.parse(schestart2));
      if (schestart > schestart2) {
        $('.scherror').show();
        $('.scherror').html('時間錯誤');
      } else {
        count++;
      }
    }
    if (count == $('.schestart').length - 1) {
      $('.scherror').hide();
      $('.scherror').html('');
      $('div#choose-schedule').hide();
      if (id.html() == '下一步') {
        $('div#choose-lotte').show();
      } else if (id.html() == '送出') {
        submitData();
        $('div#choose-finish').show();
      }
    }
  } else if (id.hasClass('lotte')) {
    submitData();
    $('#choose-lotte').hide();
    $('#choose-finish').show();
  }
}
/**
 * 上一頁
 * @param {object} id 取得this物件
 */
function previousPage(id) {
  $('html,body').animate({scrollTop: 0}, 'slow');
  if (id.hasClass('tem-group')) {
    $('div#choose-temporarily').hide();
    $('div#choose-timeliness').show();
    $('.tem').hide();
  } else if (id.hasClass('event-info')) {
    if ($('.tem').is(':visible')) {
      $('div#choose-temporarily').show();
      $('div#choose-first').hide();
      $('.tem').hide();
    } else {
      $('div#choose-timeliness').show();
      $('div#choose-first').hide();
    }
  } else if (id.hasClass('tag')) {
    $('div#choose-first').show();
    $('div#choose-sort').hide();
  } else if (id.hasClass('datetime')) {
    $('div#choose-sort').show();
    $('div#choose-date').hide();
  } else if (id.hasClass('location')) {
    $('div#choose-date').show();
    $('div#choose-location').hide();
  } else if (id.hasClass('select-mod')) {
    $('div#choose-location').show();
    $('div#choose-select').hide();
  } else if (id.hasClass('ticket')) {
    $('div#choose-select').show();
    $('div#choose-ticket').hide();
  } else if (id.hasClass('schedule')) {
    $('div#choose-schedule').hide();
    for (i = 0; i < $('.check-mod:checked').length; i++) {
      if ($('.check-mod:checked').eq(i).val() == '3') {
        $('div#choose-ticket').show();
        break;
      } else if (i == $('.check-mod:checked').length - 1) {
        $('div#choose-select').show();
        break;
      }
    }
  } else if (id.hasClass('lotte')) {
    $('div#choose-lotte').hide();
    for (i = $('.check-mod:checked').length - 1; i >= 0; i--) {
      if ($('.check-mod:checked').eq(i).val() == '4') {
        $('div#choose-schedule').show();
        break;
      } else if ($('.check-mod:checked').eq(i).val() == '3') {
        $('div#choose-ticket').show();
        break;
      } else if (i == 0) {
        $('div#choose-select').show();
        break;
      }
    }
  }
}


/**
 * add按鈕
 * @param {object} id 取得this物件
 */
function addButton(id) {
  if (id.hasClass('ticket')) {
    ticket = '<div class="row mt-2">' +
      '<div class="col-4"><input type="text"' +
      'class="form-control ticketype" placeholder="票種"></div>' +
      '<div class="col-3"><input type="text" class="form-control ' +
      'ticketquan" placeholder="數量"></div>' +
      '<div class="col-3"><input type="text" class="form-control ' +
      'ticketprice" placeholder="價格"></div>' +
      '<div class="col-1 pl-0"><button class="btn btn-danger btn-' +
      'radius-2 clear-float minus">–</button>' +
      '</div></div>';
    $('div#ticket-list').append(ticket);
  } else if (id.hasClass('schedule')) {
    schedulelist = '<div class="row mb-2 rc-2">' +
      '<div class="col-3"><input type="text" class="form-con' +
      'trol schetitle" placeholder="時段主題"></div>' +
      '<div class="col-4"><input type="text" class="form-contro' +
      'l schedetail" placeholder="說明"></div>' +
      '<div class="col-3 pr-0"><input type="text" class="datetime' +
      'picker3 form-control schestart"' +
      'placeholder="開始時間"></div><div class="col-1 mt-2"><butt' +
      'on class="btn btn-danger btn-radius-2 clear-float minus">–' +
      '</button></div></div>';
    $('.schedulelist').append(schedulelist);
    const o = {
      timeOnlyShowDate: true,
      timeFormat: 'HH:mm',
      dateFormat: '',
      controlType: 'select',
    };
    $('.datetimepicker3').timepicker(o);
  } else if (id.hasClass('lotte')) {
    lottelist = '<div class="row mt-2 mb-2">' +
      '<div class="col"><input class="form-control lottename"' +
      ' type="text" placeholder="獎項"></div>' +
      '<div class="col-1"><button class="btn btn-danger btn-rad' +
      'ius-2 clear-float minus">–</button></div></div>';
    $('#lottelist').append(lottelist);
  }
}


/**
 * 加入群組成員
 */
function addGroupMember() {
  if ($('input#member').val() != '' && !$('input#member').val().match(/^\s+/)) {
    dataMember = {
      Search: $('input#member').val(),
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Account/Search',
      data: JSON.stringify(dataMember),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      contentType: 'application/json',
      datatype: JSON,
      success: function(data) {
        if (data.code == '013') {
          $.alert({
            title: '喔不！',
            content: '查無此會員！',
          });
        } else if (data.code == '001') {
          $.each(data.result, function(indexInArray, content) {
            member = '<div class="row"><div class="col-2">' +
              '<div class="test" id="add-member-' + (indexInArray + 1) +
              '"></div></div><div class="col-3"><h6 class="lh-3">' +
              content.nickName +
              '</h6></div><div class="col-7 tempGroupMember" '+
              'id ="' + content.Id + '">' +
              '<button class="btn btn-danger btn-group del-member ' +
              'm-0 mt-2 p-1 float-right"><i class="fas fa-times">' +
              '</i></button></div></div>';
            $('div.member-list').append(member);
            $('#add-member-' + (indexInArray + 1)).css(
                'background-image', 'url("' + content.Photo + '")');
          });
          $('input#member').val('');
        }
      },
    });
  }
}


/**
 * 選擇mod的階段 是否開啟進階活動模組
 */
function nextOrSubmit() {
  check = $('.check-mod');
  if (check.eq(1).prop('checked') == true ||
    check.eq(2).prop('checked') == true ||
    check.eq(4).prop('checked') == true) {
    $('button.next.select-mod').html('下一步');
    $('button.next.select-mod').addClass('btn-primary');
    $('button.next.select-mod').removeClass('btn-success');
  }
  if (check.eq(1).prop('checked') == false &&
    check.eq(2).prop('checked') == false &&
    check.eq(4).prop('checked') == false) {
    $('button.next.select-mod').html('送出');
    $('button.next.select-mod').removeClass('btn-primary');
    $('button.next.select-mod').addClass('btn-success');
  }
}
/**
 * 上傳暫時群組
 * @param {string} endTime 群組結束時間
 * @return {string} temId 回傳群組id
 */
function tempGroupUpload(endTime) {
  temId = '';
  Id = [];
  Id.push(parseInt($.cookie('Id')));
  for (i = 0; i < $('.tempGroupMember').length; i++) {
    Id.push(parseInt($('.tempGroupMember').eq(i).prop('id')));
  }
  data = {
    authId: Id,
    groupName: $('#temgroupName').val(),
    Address: $('#temAddress').val(),
    Mail: $('#temEmail').val(),
    Phone: $('#temPhone').val(),
    Useable: 'true',
    deadline: endTime,
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Group/upload',
    data: JSON.stringify(data),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    datatype: JSON,
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        temId = content.groupId;
      });
    },
  });
  return temId;
}


/**
 * 上傳活動圖片
 * @param {string} actId 活動id
 */
function uploadActImg(actId) {
  const fileData = $('#file').prop('files')[0];
  const formData = new FormData();
  formData.append('file', fileData);
  $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    enctype: 'multipart/form-data',
    url: 'https://fiesta-o2o.tw//Fiestadb/uploadImage?type=act&Id=' + actId,
    data: formData,
    success: function(data) {
    },
  });
}


/**
 * 上傳票券
 * @param {string} actId 取得活動Id
 */
function uploadTicket(actId) {
  ticketype = $('input.ticketype');
  ticketquan = $('input.ticketquan');
  ticketprice = $('input.ticketprice');
  for (k = 0; k < ticketype.length; k++) {
    dataUploadTicket = {
      act_Id: actId,
      ticketKinds: ticketype.eq(k).val(),
      Mounts: parseInt(ticketquan.eq(k).val()),
      Remainder: parseInt(ticketquan.eq(k).val()),
      Price: parseInt(ticketprice.eq(k).val()),
      Useable: 'true',
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/upload',
      data: JSON.stringify(dataUploadTicket),
      async: false,
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
}


/**
 * 上傳時程
 * @param {datetime} startTime 取得日期
 * @param {string} actId 取得活動Id
 */
function uploadShow(startTime, actId) {
  date = startTime.split(' ');
  schetitle = $('.schetitle');
  schestart = $('.schestart');
  schedetail = $('.schedetail');
  for (k = 0; k < schestart.length; k++) {
    schest = date[0] + schestart.eq(k).val() + ':00';
    dataUploadShow = {
      act_Id: actId,
      showTime: schest,
      Detail: schedetail.eq(k).val(),
      showStatus: 'true',
      Useable: 'true',
      showName: schetitle.eq(k).val(),
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Show/upload',
      data: JSON.stringify(dataUploadShow),
      async: false,
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      datatype: JSON,
      success: function(data) {
      },
    });
  }
}


/**
 * 上傳抽獎
 * @param {string} actId 取得活動Id
 */
function uploadLotte(actId) {
  lotte = $('.lottename');
  for (k = 0; k < lotte.length; k++) {
    dataUploadLotte = {
      act_Id: actId,
      Prize: lotte.eq(k).val(),
      Useable: 'true',
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Lotte/upload',
      data: JSON.stringify(dataUploadLotte),
      async: false,
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      datatype: JSON,
      success: function(data) {
      },
    });
  }
}

/**
 * 送出資料
 */
function submitData() {
  if (typeof(SaWa) == 'undefined') {
    SaWa = ['22.7556518', '120.3299092'];
  }
  actId = '';
  mod = '';
  for (i = 0; i < $('.check-mod:checked').length; i++) {
    if (i == 0) {
      mod = $('.check-mod:checked').eq(i).val();
    } else {
      mod = mod + ',' + $('.check-mod:checked').eq(i).val();
    }
  }
  for (i = 0; i < $('.clicked').length; i++) {
    if (i == 0) {
      Tags = $('.clicked').eq(0).text();
    } else {
      Tags = Tags + ',' + $('.clicked').eq(i).text();
    }
  }
  startTime = $('#datetimepicker1').val();
  endTime = $('#datetimepicker2').val();
  // chooseleft
  if ($('.tem').is(':visible')) {
    temId = tempGroupUpload(endTime);
    data = {
      act_Name: $('#EventName').val(),
      Tag: Tags,
      groupId: temId,
      startTime: startTime,
      endTime: endTime,
      act_Status: 'true',
      Useable: 'true',
      act_Description: $('#Description').val(),
      joinedCount: '0',
      peopleMaxium: $('#peoplemax').val(),
      Models: mod,
      Latitude: SaWa[0],
      Longitude: SaWa[1],
      viewStatus: 'true',
    };
  } else {
    for (i = 0; i < $('select#groupSelect option').length; i++) {
      if ($('select#groupSelect option').eq(i).val() ==
        $('#groupSelect').val()) {
        Id = $('select#groupSelect option').eq(i).prop('id');
      }
    }
    data = {
      act_Name: $('#EventName').val(),
      Tag: Tags,
      groupId: Id,
      startTime: startTime,
      endTime: endTime,
      act_Status: 'true',
      Useable: 'true',
      act_Description: $('#Description').val(),
      joinedCount: '0',
      peopleMaxium: $('#peoplemax').val(),
      Models: mod,
      Latitude: SaWa[0],
      Longitude: SaWa[1],
      viewStatus: 'true',
    };
  }
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/upload',
    data: JSON.stringify(data),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    datatype: JSON,
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        actId = content.act_Id;
      });
    },
  });
  if ($('#file').prop('files').length > 0) {
    uploadActImg(actId);
  }
  for (i = 0; i < $('.check-mod:checked').length; i++) {
    if ($('.check-mod:checked').eq(i).val() == '3') {
      uploadTicket(actId);
    } else if ($('.check-mod:checked').eq(i).val() == '4') {
      uploadShow(startTime, actId);
    } else if (($('.check-mod:checked').eq(i).val() == '6')) {
      uploadLotte(actId);
    }
  }
  $.cookie('actid', actId, {path: '/'});
  location.href = '/dashboard';
}
