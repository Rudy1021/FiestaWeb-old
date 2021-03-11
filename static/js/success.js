$(document).ready(function() {
  confirmTicket();
});
/**
 * 確認驗票是否成功
 */
function confirmTicket() {
  if ($.cookie('code') == '001') {
    $('.success').show();
  } else if ($.cookie('code' == '010')) {
    $('.fail').show();
  }
  $.removeCookie('code', {path: '/'});
    setInterval(function() {
    location.href='/';
  }, 3000);
}
