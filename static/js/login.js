$(document).on('click', '#sendforgot', function() {
  forgot();
});


$('input').keypress(function(e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    if ($('.loginlist').css('display') == 'none') {
      forgot();
    } else {
      login();
    }
  }
});


$(document).on('click', '#forgot-pwd', function() {
  changePage($(this).prop('id'));
});


$(document).on('click', '#login', function() {
  if ($('#userId').val() != '' && $('#userPassword').val() != '') {
    login();
  }
});


$(document).on('click', '#backtologin', function() {
  changePage($(this).prop('id'));
});


/**
 * 切換頁面
 * @param {string} id
 */
function changePage(id) {
  if (id == 'forgot-pwd') {
    $('.loginlist').hide();
    $('.forgot-pwdlist').show();
  } else if (id == 'backtologin') {
    $('.loginlist').show();
    $('.forgot-pwdlist').hide();
  }
}


/**
 * 忘記密碼
 */
function forgot() {
  dataForgot = {
    userId: $('#forgotId').val(),
    type: '2',
  };
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/SendConfirm',
    data: JSON.stringify(dataForgot),
    contentType: 'application/json',
    datatype: JSON,
    success: function(data) {
      if (data.code == '002') {
        $.confirm({
          title: '錯誤！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '請確定電子郵件正確！',
          buttons: {
            確認: {
              btnClass: 'btn-success',
              action: function() {
              },
            },
          },
        });
      } else if (data.code == '001') {
        $.confirm({
          title: '成功！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '請去信箱收信呦！',
          buttons: {
            確認: {
              btnClass: 'btn-success',
              action: function() {
              },
            },
          },
        });
      }
    },
  });
}


/**
   * 登入function
   */
function login() {
  dataLogin = {
    userId: $('#userId').val(),
    userPassword: $('#userPassword').val(),
  };
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/select',
    data: JSON.stringify(dataLogin),
    contentType: 'application/json',
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          $.cookie('qsacw', content.token, {expires: 7}, {path: '/'});
          $.cookie('Id', content.Id, {expires: 7}, {path: '/'});
        });
        if ($.cookie('check') != undefined) {
          location.href = 'check?id=' + $.cookie('check');
        } else if ($.cookie('review') != undefined) {
          $.removeCookie('review', {path: '/'});
          location.href = '/review/' + $.cookie('reid');
        }  else {
          location.href = '/';
        }
      } else if (data.code == '002') {
        $.confirm({
          title: '錯誤！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '帳號或密碼錯誤！',
          buttons: {
            確認: {
              btnClass: 'btn-success',
              action: function() {
              },
            },
          },
        });
      }
    },
  });
}
