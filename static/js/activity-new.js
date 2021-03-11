$(document).ready(function() {
  $(window).scroll(function() {
    if ($(window).scrollTop() >= 56) {
      // $('#activity-background').addClass('activity-background-fixed');
      // console.log($(window).scrollTop() - 56);
      if ((1742 - 650 - $(window).scrollTop()) * 0.1 <= 100) {
        percent = (1742 - 1000 - $(window).scrollTop()) * 0.1;
        console.log(percent);
        if (percent <= 20) {
          percent = 20;
        }
        $('.activity-animate').css('margin-top', percent + '%');
      }
    } else {
      // $('#activity-background').removeClass('activity-background-fixed');
    }
  });
});
