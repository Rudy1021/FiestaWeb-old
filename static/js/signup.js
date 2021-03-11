$(document).ready(function() {
  const opt={dateFormat: 'yy-mm-dd',
    changeYear: true,
    yearRange: '1994:2003',
    controlType: 'select',
    oneLine: true,
  };
  $('#Birthday').datepicker(opt);
});

$('#Mail_1').change(function(e) {
  getSchool();
});
// 更改距離
$('input.custom-range').change(function(e) {
  $('span#range-val').html($(this).val());
});
$(document).on('click', '#signup', function() {
  signup();
});


/**
 * 取得學校
 */
function getSchool() {
  sch = $('#Mail_1').val();
  sch = sch.split('@')[1];
  sch = sch.split('.');
  for (i = 0; i<sch.length-1; i++) {
    if (sch[i] == 'edu') {
      sch.splice(i, 1);
    }
    if (sch[i] == 'tw') {
      sch.splice(i, 1);
    }
    if (sch[i] == 'mail') {
      sch.splice(i, 1);
    }
  }
  // sch = sch[0];
  $.ajax({
    type: 'GET',
    url: 'https://fiesta-o2o.tw/Fiestadb/getSchool',
    success: function(data) {
      $.each(data.result[0], function(indexInArray, content) {
        if (sch[0] == content) {
          $('#School').val(data.result[1][indexInArray]);
          return false;
        } else if (sch[1] == content) {
          $('#School').val(data.result[1][indexInArray]);
          return false;
        }
      });
    },
  });
}


/**
 * 寄送驗證信
 */
function sendConfirm() {
  dataSendConfirm = {
    userId: $('#userId').val(),
    type: '1',
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Account/SendConfirm',
    data: JSON.stringify(dataSendConfirm),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    success: function(data) {
      $.confirm({
        title: '成功！',
        animation: 'zoom',
        closeAnimation: 'scale',
        content: '請去信箱驗證會員呦！',
        buttons: {
          確認: {
            btnClass: 'btn-success confirm',
            action: function() {
              location.href = '/';
            },
          },
        },
      });
    },
  });
}


/**
 * 註冊
 */
function signup() {
  if ($('#userId').val() == '' || $('#userPassword').val() == '' ||
  $('#userName').val() == '' || $('#Mail_1').val() == '' ||
  $('#Phone').val() == '') {
    $.confirm({
      title: '錯誤！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '請填寫完整！！',
      buttons: {
        確認: {
          btnClass: 'btn-success confirm',
          action: function() {
          },
        },
      },
    });
  } else if ($('#userId').val() == $('#userPassword').val()) {
    $.confirm({
      title: '錯誤！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '帳號與密碼不得相同！',
      buttons: {
        確認: {
          btnClass: 'btn-success confirm',
          action: function() {
            $('#userName').val('');
            $('#userPassword').val('');
          },
        },
      },
    });
  } else if ($('.policy').prop('checked') == false) {
    $.confirm({
      title: '警告！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '請打勾隱私權政策！',
      buttons: {
        確認: {
          btnClass: 'btn-success confirm',
          action: function() {
          },
        },
      },
    });
  } else {
    if ($('#nickName').val() == '') {
      $('#nickName').val($('#userName').val());
    }
    dataSignup = {
      userId: $('#userId').val(),
      userPassword: $('#userPassword').val(),
      userName: $('#userName').val(),
      nickName: $('#nickName').val(),
      Mail_1: $('#Mail_1').val(),
      Phone: $('#Phone').val(),
      Distance: 25,
      School: $('#School').val(),
      Useable: 'true',
    };
    $.ajax({
      type: 'POST',
      url: 'https://fiesta-o2o.tw/Fiestadb/Account/upload',
      data: JSON.stringify(dataSignup),
      async: false,
      contentType: 'application/json',
      datatype: JSON,
      success: function(data) {
        if (data.code == '001') {
          sendConfirm();
        } else if (data.code == '005') {
          $.confirm({
            title: '錯誤！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '該帳號已被註冊！',
            buttons: {
              確認: {
                btnClass: 'btn-success confirm',
                action: function() {
                  $('#userId').val('');
                },
              },
            },
          });
        } else if (data.code == '008') {
          $.confirm({
            title: '錯誤！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '學校信箱驗證錯誤！',
            buttons: {
              確認: {
                btnClass: 'btn-success confirm',
                action: function() {
                  $('#Mail_1').val('');
                },
              },
            },
          });
        } else {
          $.confirm({
            title: '錯誤！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '發生未知錯誤，請稍後再試！',
            buttons: {
              確認: {
                btnClass: 'btn-success confirm',
                action: function() {
                },
              },
            },
          });
        }
      },
    });
  }
}
