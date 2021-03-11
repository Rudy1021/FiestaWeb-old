$(document).ready(function() {
  id = location.pathname.split('/')[2];
  $.cookie('reid', id, {path: '/'});
  if ($.cookie('Id') == undefined) {
    $.cookie('review', 'true', {path: '/'});
    $.confirm({
      title: '錯誤！',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '尚未登入！',
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
    getAct();
  }
});

$(document).on('click', '.fa-star', function() {
  setStar($(this));
});

$(document).on('click', '#submitques', function() {
  scoreSubmit();
});


/**
 * 取得活動
 */
function getAct() {
  dataActId = {
    Id: $.cookie('reid'),
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
        $('.activityName').text(content.act_Name + '的活動問卷');
      });
    },
  });
}


/**
 * 設定是哪個星星被選中
 * @param {object} btn 取得按鈕
 */
function setStar(btn) {
  starId = btn.parent().prop('id');
  star = btn.parent();

  for (i = starId; i >= 0; i--) {
    if (star.children().eq(0).hasClass('far')) {
      star.children().eq(0).addClass('fas');
      star.children().eq(0).removeClass('far');
    }
    star = star.prev();
  }
  star = btn.parent();
  for (i = starId; i < 5; i++) {
    star = star.next();
    if (star.children().eq(0).hasClass('fas')) {
      star.children().eq(0).removeClass('fas');
      star.children().eq(0).addClass('far');
    }
  }
  /*
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
  */
}


/**
 * 發送問卷
 */
function scoreSubmit() {
  now = (new Date()).toISOString().substring(0, 10);
  /*
  showId = ['1', '2', '3', '4'];
  text = ['test1', 'test2', 'test3', 'test4'];
  for (i = 0; i < 4; i ++) {
    dataShowScore = {
      Detail: $(text).eq(i),
      showId: $(showId).eq(i),
      authId: $.cookie('Id'),
      score_Date: now,
      Useable: 'true',
      act_Id: $.cookie('reid'),
    };
    console.log(dataShowScore);
    $.ajax({
      type: 'POST',
      url: 'http://163.18.42.222:4000/Fiestadb/FeedBack/Score/Show/upload',
      data: JSON.stringify(dataShowScore),
      async: false,
      contentType: 'application/json',
      datatype: JSON,
      success: function(response) {

      },
    });
  }
      */
  Stars = $('.Stars').children('.selected').prop('id');
  Price = $('.Price').children('.selected').prop('id');
  Music = $('.Music').children('.selected').prop('id');
  Flow = $('.Flow').children('.selected').prop('id');
  Vibe = $('.Vibe').children('.selected').prop('id');
  Light = $('.Light').children('.selected').prop('id');
  Moveline = $('.Moveline').children('.selected').prop('id');
  Site = $('.Site').children('.selected').prop('id');
  Staff = $('.Staff').children('.selected').prop('id');
  dataScore = {
    act_Id: $.cookie('reid'),
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
    Detail: $('#Description').val(),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/FeedBack/Score/Act/upload',
    data: JSON.stringify(dataScore),
    async: false,
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.confirm({
          title: '成功！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '將回到主頁面！',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
                location.href = '/';
              },
            },
          },
        });
      } else {
        $.confirm({
          title: '錯誤！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '發生未知錯誤 將回到主頁面！',
          buttons: {
            確定: {
              btnClass: 'btn-success',
              action: function() {
                location.href = '/';
              },
            },
          },
        });
      }
    },
  });
}
