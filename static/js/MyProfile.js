$(document).ready(function() {
  userId = '';
  getReviewStatusProfile();
  validateLogin();
  const opt={dateFormat: 'yy-mm-dd',
    changeYear: true,
    yearRange: '1994:2005',
    oneLine: true,
  };
  $('#profile-Birthday').datepicker(opt);
});


$(document).on('click', '#email-vail', function() {
  sendConfirm(userId);
});


$(document).on('click', '#setting-edit', function(_e) {
  upDateUserData();
});


$('#file').change(function(_e) {
  changeUserPic();
});


$('#customRange3').change(function(_e) {
  $('.disval').html($(this).val());
});


$('.profile-pic-area').hover(function() {
  $('.profile-pic-edit').show();
}, function() {
  $('.profile-pic-edit').hide();
},
);


/**
 * 發送驗證信
 */
function sendConfirm() {
  dataConfirm = {
    userId: userId,
    type: '1',
  };
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/SendConfirm',
    data: JSON.stringify(dataConfirm),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    success: function(_data) {
      $.confirm({
        title: '成功！',
        animation: 'zoom',
        closeAnimation: 'scale',
        content: '請去信箱驗證會員呦！',
        buttons: {
          確認: {
            btnClass: 'btn-success',
            action: function() {
            },
          },
        },
      });
    },
  });
}

/**
 * 取得該會員資料
 */
function validateLogin() {
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/ValidateLogin',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    contentType: 'application/json',
    datatype: JSON,
    success: function(data) {
      if (data.code == '009') {
        $.confirm({
          title: '警告',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '請重新登入',
          buttons: {
            確認: {
              btnClass: 'btn-danger',
              action: function() {
                $.removeCookie('Id', {path: '/'});
                $.removeCookie('qsacw', {path: '/'});
                location.href = '/';
              },
            },
          },
        });
      } else {
        $.each(data.result, function(_indexInArray, content) {
          userId = content.userId;
          $.cookie('qsacw', content.token, {expires: 7});
          if (content.Photo != 'None') {
            $('.profile-pic-area').css('background-image', 'url("' +
            content.Photo + '")');
          }
          $('#profile-userName').val(content.userName);
          $('#profile-nickName').val(content.nickName);
          $('#profile-Email').val(content.Mail_1);
          $('#profile-School').val(content.School);
          $('#profile-Phone').val(content.Phone);
          if (content.phone == 'None') {
            $('#contry-number').val('');
            $('#profile-Phone').val('');
          }
          if (content.Birthday == 'None') {
            $('#profile-Birthday').val('');
          } else {
            $('#profile-Birthday').val(content.Birthday);
          }
          if (content.ID_CARD == 'None') {
            $('#profile-IDCARD').val('');
          } else {
            $('#profile-IDCARD').val(idcard.substring(0, 6) + '****');
          }
          if (content.Mail_2 == 'None') {
            $('#profile-backupEmail').val('');
          } else {
            $('#profile-backupEmail').val(content.Mail_2);
          }
        });
      }
    },
  });
}


/**
 * 查看該會員是否驗證
 */
function getReviewStatusProfile() {
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/getReviewStatus',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '020') {
        $('#email-vail').show();
        $('#setting-edit').hide();
      }
    },
  });
}


/**
 * 更新使用者資訊
 */
function upDateUserData() {
  if ($('#profile-backupEmail').val() == '') {
    $('#profile-backupEmail').val('null');
  }
  if ($('#profile-Birthday').val() == '') {
    $('#profile-Birthday').val('null');
  }
  if ($('#profile-IDCARD').val() == '') {
    $('#profile-IDCARD').val('null');
  }
  data = {
    userId: $.cookie('Id'),
    Phone: $('#profile-Phone').val(),
    Mail_2: $('#profile-backupEmail').val(),
    Birthday: $('#profile-Birthday').val(),
    ID_CARD: $('#profile-IDCARD').val(),
    nickName: $('#profile-nickName').val(),
  };
  $.ajax({
    type: 'POST',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    data: JSON.stringify(data),
    contentType: 'application/json',
    datatype: JSON,
    url: 'http://163.18.42.222:8888/Fiestadb/Account/update',
    success: function(data) {
      // location.reload();
    },
  });
}


/**
 * 更換使用者圖片
 */
function changeUserPic() {
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
    url: 'http://163.18.42.222:8888/Fiestadb/uploadImage?type=auth&Id=' + $.cookie('Id'),
    data: formData,
    success: function(_data) {
      location.reload();
    },
  });
}

