$(document).ready(function() {
  getActScore();
});

/**
 * 取得問卷
 */
function getActScore() {
  allReview = 0;
  allReviewPlus = 2;
  dataGetActScore = {
    act_Id: $.cookie('actid'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/FeedBack/Score/Act/SelectByAct',
    data: JSON.stringify(dataGetActScore),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        allReview+=1;
        if (allReviewPlus >= 3) {
          allReviewPlus+=1;
        }
        starScore = parseInt($('.stars' + content.Stars).text());
        $('.stars' + content.Stars).text(starScore+=1);
        star = parseInt($('.starAvg').text());
        starAvg = ((allReviewPlus-1) * (star + parseInt(content.Stars))) /
        allReview;
        $('.starAvg').text(starAvg);
        priceScore = parseInt($('.price' + content.Price).text());
        $('.price' + content.Price).text(priceScore+=1);
        star = parseInt($('.priceAvg').text());
        priceAvg = ((allReviewPlus-1) * (star + parseInt(content.Price))) /
        allReview;
        $('.priceAvg').text(starAvg);
        musicScore = parseInt($('.music' + content.Music).text());
        $('.music' + content.Music).text(musicScore+=1);
        star = parseInt($('.musicAvg').text());
        musicAvg = ((allReviewPlus-1) * (star + parseInt(content.Music))) /
        allReview;
        $('.musicAvg').text(starAvg);
        flowScore = parseInt($('.flow' + content.Flow).text());
        $('.flow' + content.Flow).text(flowScore+=1);
        star = parseInt($('.flowAvg').text());
        flowAvg = ((allReviewPlus-1) * (star + parseInt(content.Flow))) /
        allReview;
        $('.flowAvg').text(starAvg);
        vibeScore = parseInt($('.vibe' + content.Vibe).text());
        $('.vibe' + content.Vibe).text(vibeScore+=1);
        star = parseInt($('.vibeAvg').text());
        vibeAvg = ((allReviewPlus-1) * (star + parseInt(content.Vibe))) /
        allReview;
        $('.vibeAvg').text(starAvg);
        lightScore = parseInt($('.light' + content.Light).text());
        $('.light' + content.Light).text(lightScore+=1);
        star = parseInt($('.lightAvg').text());
        lightAvg = ((allReviewPlus-1) * (star + parseInt(content.Light))) /
        allReview;
        $('.lightAvg').text(starAvg);
        movelineScore = parseInt($('.moveline' + content.Moveline).text());
        $('.moveline' + content.Moveline).text(movelineScore+=1);
        star = parseInt($('.movelineAvg').text());
        movelineAvg = ((allReviewPlus-1) * (star +
          parseInt(content.Moveline))) / allReview;
        $('.movelineAvg').text(starAvg);
        siteScore = parseInt($('.site' + content.Site).text());
        $('.site' + content.Site).text(siteScore+=1);
        star = parseInt($('.siteAvg').text());
        siteAvg = ((allReviewPlus-1) * (star + parseInt(content.Site))) /
        allReview;
        $('.siteAvg').text(starAvg);
        staffScore = parseInt($('.staff' + content.Staff).text());
        $('.staff' + content.Staff).text(staffScore+=1);
        star = parseInt($('.staffAvg').text());
        staffAvg = ((allReviewPlus-1) * (star + parseInt(content.Staff))) /
        allReview;
        $('.staffAvg').text(starAvg);
        $('.feedbackBox').append(
            '<div class="feedback">'+ content.Detail + '</div>',
        );
      });
    },
  });
  $('.badge').text(allReview + '則');
}
