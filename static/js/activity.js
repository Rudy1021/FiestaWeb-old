$(document).ready(function() {
  actid = [];
  getRecommend();
  // getAds();
});


$(document).on('click', 'div.card', function() {
  clickAct($(this));
});


$(document).on('click', '#more', function() {
  getRecommend();
});


/**
 * 取得所有活動
 */
function getRecommend() {
  if ($('#more').length > 0) {
    $('#more').remove();
  }
  dataActid = {
    act_Id: actid,
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Activity/getRecommend',
    data: JSON.stringify(dataActid),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code != '013') {
        $.each(data.result, function(indexInArray, content) {
          actag = '';
          tag = content.Tag;
          for (i = 0; i < tag.length; i ++) {
            actag = actag + '<div class="tag-box">' + tag[i] + '</div>';
          }
          act = '<div class="card justify-content-md-center activity ' +
          'card-outline-Act"><div class="card-body">' +
          '<span class="id">' + content.Id +
          '</span><h5 class="card-title all-title activity-title">' +
          content.act_Name + '</h5><p class="card-text"></p>' +
          '<div class="row"><div class="col-lg-5 col-sm-12">' +
          '<img src="' + content.Photo +
          '" class="card-img-top"></div>' +
          '<div class="col-lg-7 col-sm-12"><div class="row font-7 mt-2">' +
          '<div class="col-2 ml-2 mt-1"><i class="far fa-calendar-alt"></i>' +
          '</div><div class="col">' + content.startTime + '</div></div>' +
          '<div class="row font-7 mt-2"><div class="col-2 ml-2 mt-1">' +
          '<i class="fas fa-users"></i></div>' +'<div class="col-6">' +
          content.joinedCount + '/' + content.peopleMaxium +
          '</div></div><div class="row mt-2"><div class="col mt-2 taglist">' +
          actag + '</div></div></div></div><p></p></div></div>';
          $('.actlist').append(act);
          actid.push(content.Id);
        });
        if (data.code == '001') {
          if (data.result.length >= 10) {
            more = '<div class="text-center btn-area"><br>' +
            '<button type="button"' +
            ' id="more" class="btn btn-secondary">More</button></div>';
            $('.container-fluid.activity-list').append(more);
          }
        }
      }
    },
  });
};


/**
 * 由所有活動點進活動頁面
 * @param {object} card
 */
function clickAct(card) {
  cardBody = card.children('.card-body');
  $.cookie('acid', cardBody.children('span.id').html(), {expires: 7});
  location.href = '/Activity/' + cardBody.children('.card-title').html();
};


/**
 * 取得廣告
 */
function getAds() {
  Adsid = [];
  dataAds = {
    Ads_Id: Ads_id,
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Ads/getRand',
    data: JSON.stringify(dataAds),
    contentType: 'application/json',
    datatype: JSON,
    success: function(data) {
      if (data.code == '001') {
        if ($('.activity').length >= 3) {
          act = 2;
          $.each(data.result, function(indexInArray, content) {
            Ads = '<div class="card justify-content-md-center activity' +
            ' card-outline-Act"><div class="card-body"><span class="id">' +
            content.Ads_Id +
            '</span><h5 class="card-title all-title activity-title">' +
            content.Ads_Name +'</h5><p class="card-text"></p>' +
            '<div class="row"><div class="col-lg-5 col-sm-12">' +
            '<img src="' + content.Photo + '" class="card-img-top">' +
            '</div><div class="col-lg-7 col-sm-12">' +
            '<div class="row font-7 mt-2"><div class="col-2 ml-2 mt-1">' +
            '<i class="fas fa-store"></i></div><div class="col">' +
            content.Source +'</div></div><div class="row font-7 mt-2">' +
            '<div class="col-2 ml-2 mt-1"><i class="far fa-comment-dots">' +
            '</i></i></div>' +'<div class="col-6">' + content.Content +
            '</div></div><div class="row mt-2">' +
            '<div class="col mt-2 taglist"><div class="act-tag">搖滾</div>' +
            '</div></div></div></div><p></p></div></div>';
            $('.activity').eq(act).after(Ads);
            act += 3;
          });
        } else {
          $.each(data.result, function(indexInArray, content) {
            Ads = '<div class="card justify-content-md-center ' +
            'activity card-outline-Act">' +
            '<div class="card-body"><span class="id">' + content.Ads_Id +
            '</span><h5 class="card-title all-title activity-title">' +
            content.Ads_Name + '</h5><p class="card-text"></p>' +
            '<div class="row"><div class="col-lg-5 col-sm-12">' +
            '<img src="' + content.Photo + '" class="card-img-top">' +
            '</div><div class="col-lg-7 col-sm-12">' +
            '<div class="row font-7 mt-2">' +
            '<div class="col-2 ml-2 mt-1"><i class="fas fa-store">' +
            '</i></div><div class="col">' + content.Source +
            '</div></div><div class="row font-7 mt-2">' +
            '<div class="col-2 ml-2 mt-1"><i class="far fa-comment-dots">' +
            '</i></i></div><div class="col-6">' + content.Content +
            '</div></div><div class="row mt-2"><div class="col mt-2 taglist">' +
            '<div class="act-tag">搖滾</div>' +
            '</div></div></div></div><p></p></div></div>';
            $('.activity').append(Ads);
            return false;
          });
        }
      }
    },
  });
}
