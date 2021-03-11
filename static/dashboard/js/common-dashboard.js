$(document).ready(function() {
  getCreateAct();
  getExpireAct();
  backToIndex();
});


$(document).on('click', '#sidebarToggle', function() {
  $('body').toggleClass('sidebar-toggled');
  $('.sidebar').toggleClass('toggled');
  if ($('.sidebar').hasClass('toggled')) {
    $('.sidebar .collapse').collapse('hide');
  };
});


$(document).on('click', 'a.nav-link', function() {
  $.cookie('actid', $(this).prop('id'), {path: '/'});
  if (location.href != location.hostname + '/dashboard') {
    location.href = '/dashboard';
  } else {
    location.reload();
  }
});


$(document).on('change', 'input', function() {
  re = /select|update|delete|exec|count|'|"|=|;|>|<|%|\*/;
  if ($(this).val().match(re)) {
    $.confirm({
      title: '錯誤！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '含有非法字元！',
      buttons: {
        確認: {
          btnClass: 'btn-warning',
          action: function() {
          },
        },
      },
    });
    // $(this).val('');
  }
});


/**
 * 取得已創建未過期活動
 */
function getCreateAct() {
  idlist = [];
  dataGetCreateAct = {
    authId: $.cookie('Id'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Account/getCreateAct',
    data: JSON.stringify(dataGetCreateAct),
    contentType: 'application/json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    async: false,
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          idlist.push(content.act_Id);
          actTitle = '<li class="nav-item"><a class="nav' +
          '-link collapsed " href="javascript:;" id="' +
          content.act_Id + '">' +
          '<i class="fas fa-fw fa-bullhorn"></i>' +
          '<span class="all-act-title">' + content.act_Name +
          '</span></a></li>';
          $('#accordionSidebar').append(actTitle);
        });
      }
    },
  });
}


/**
 * 取得已過期活動
 */
function getExpireAct() {
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/getExpire',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    async: false,
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(index, content) {
          actTitle = '<li class="nav-item">' +
          '<a class="nav-link collapsed " href="javascript:;"' +
           ' id="' + content.act_Id + '">' +
          '<i class="fas fa-fw fa-bullhorn"></i>' +
          '<span class="all-act-title">' + content.act_Name +
          '</span></a></li>';
          $('#accordionSidebar').append(actTitle);
        });
      }
      sidebarDivider = '<hr class="sidebar-divider"><div' +
      ' class="text-center d-none d-md-inline">' +
      '<button class="rounded-circle border-0" ' +
      'id="sidebarToggle"></button></div>';
      $('#accordionSidebar').append(sidebarDivider);
    },
  });
}

/**
 * 如果都沒有創建過活動就返回到主畫面
 */
function backToIndex() {
  liAct = $('#' + $.cookie('actid')).parent();
  if ($('a.nav-link').length >= 1) {
    if ($.cookie('actid') == undefined) {
      $.cookie('actid', $('a.nav-link').eq(0).prop('id'), {path: '/'});
    }
    liAct.addClass('active');
    $('#' + $.cookie('actid')).append('<i class="fas fa-angle-down"></i>');
    model = '<div id="collapseOne" class="collapse show" ' +
    'aria-labelledby="headingOne" data-parent="#accordionSidebar">' +
    '<div class="bg-white py-2 collapse-inner rounded">' +
    '<a class="collapse-item" href="/dashboard/model">' +
    '設定進階模組</a></div></div>';
    liAct.append(model);
  } else {
    $.confirm({
      title: '錯誤！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '尚未創建活動！',
      buttons: {
        確認: {
          btnClass: 'btn-warning',
          action: function() {
            location.href = '/';
          },
        },
      },
    });
  }
}
