$(document).ready(function() {
  globalTimeout = null;
  removeCookie();
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
 * 檢查該網址並刪除cookie
 */
function removeCookie() {
  /*
  if (location.pathname.split('/')[1] != 'review') {
    $.removeCookie('reid', {path: '/'});
  }
  */
  if (location.pathname.split('/')[1] != 'Activity') {
    $.removeCookie('acid', {path: '/'});
    $.removeCookie('kind', {path: '/'});
  }
  if (location.pathname != '/dashboard') {
    $.removeCookie('actid', {path: '/'});
  }
  if (location.pathname != '/QRcode') {
    $.removeCookie('QRcode', {path: '/'});
  }
  if (location.pathname != '/check') {
    $.removeCookie('acdid', {path: '/'});
    $.removeCookie('type', {path: '/'});
  }
  if (location.pathname != '/success') {
    $.removeCookie('code', {path: '/'});
  }
}
$(document).on('click', '.emailtest', function() {
  getReviewStatus($(this).prop('id'));
});


$('input').keypress(function(e) {
  cancelEnter(e);
});


$('#base-Search').keyup(function(e) {
  waitTime();
});


$(document).on('click', 'div.search-row', function() {
  clickSearch();
});


/**
 * 取消enter的功能
 * @param {object} e
 */
function cancelEnter(e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    e.preventDefault();
  }
}

/**
 * 查看會員是否驗證
 * @param {object} id
 */
function getReviewStatus(id) {
  if ($.cookie('Id') == undefined) {
    $.confirm({
      title: '錯誤',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '尚未登入會員',
      buttons: {
        確定: {
          btnClass: 'btn-success',
          action: function() {
            location.href = '/login';
          },
        },
      },
    });
  } else {
    $.ajax({
      type: 'POST',
      url: 'http://163.18.42.222:8888/Fiestadb/Account/getReviewStatus',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      success: function(data) {
        if (data.code == '020') {
          $.confirm({
            title: '喔不！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '此會員尚未進行驗證，現在就去驗證吧！',
            buttons: {
              確認: {
                btnClass: 'btn-success',
                action: function() {
                  location.href = '/MyProfile';
                },
              },
            },
          });
        } else {
          if (id == 'Create') {
            location.href = '/CreateEvent';
          } else if (id == 'Group') {
            location.href = '/Group';
          } else if (id == 'MyTicket') {
            location.href = '/MyTicket';
          } else if (id == 'dashboard') {
            location.href = '/dashboard';
          } else if ($('#'+id).hasClass('ticketsub')) {
            $.cookie('kind', $('#'+id).parent().prev().prev().prev().html(),
                {path: '/'});
            $('.join-btn').click();
          } else if ($('#'+id).hasClass('joinClick')) {
            $('.join-btn').click();
          }
        }
      },
    });
  }
}


/**
 * 搜尋欄輸入文字後會等待兩秒
 */
function waitTime() {
  $('input#base-Search').removeAttr('style');
  $('search-area').hide();
  $('div.search-content').children().remove();
  if (globalTimeout != null) {
    clearTimeout(globalTimeout);
  }
  globalTimeout = setTimeout(SearchFunc, 2000);
}
/**
 * 搜尋欄function
 */
function SearchFunc() {
  globalTimeout = null;
  if ($('#base-Search').val() != '') {
    if (!$('#base-Search').val().match(/^\s+/)) {
      $('input#base-Search').css('border-radius', '1rem 1rem 0px 0px');
      $('div.search-area').show();
      dataSearch = {
        Search: $('#base-Search').val(),
      };
      $.ajax({
        type: 'POST',
        url: 'http://163.18.42.222:8888/Fiestadb/Activity/Search',
        data: JSON.stringify(dataSearch),
        contentType: 'application/json',
        datatype: JSON,
        success: function(data) {
          id = '';
          $.each(data.result, function(indexInArray, content) {
            search = '<div class="row search-row">' +
            '<div class="col-4 mb-3 img-parent">' +
            '<img src=' + content.Photo + 'class="search-img">' +
            '</div><div class="col-8 search-text-parent">' +
            '<div class="search-text"><div class="title" id="title-' +
            indexInArray + '">' +
            content.act_Name + '</div><div id="location-' + i + '/">' +
            '100m</div>' +
            '<div id="description-'+ i +'">' + content.act_Description +
            '</div><div id="startTime-' + i + '">' + content.startTime +
            '</div><span class="actId">' + content.Id + '</span><br>';
            $('div.search-content').append(search);
          });
        },
      });
    }
  }
}
/**
 * 搜尋欄點進活動頁面
 */
function clickSearch() {
  content = $(this).children('.search-text-parent').children('.search-text');
  title = content.children('.title').html();
  $.cookie('acid', content.children('.actId').html(), {path: '/'});
  location.href = '/Activity/' + title;
}
