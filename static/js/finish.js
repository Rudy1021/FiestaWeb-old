$(document).ready(function() {
  confirmEmail();
});
$(document).on('click', '.buttonclick', function() {
  location.href = 'http://163.18.42.222:8888';
});
/**
 * 確認信箱是否驗證成功
 */
function confirmEmail() {
  token = location.pathname;
  token = token.substr(13);
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/ValidateEmail?token=' + token,
    success: function(response) {
      if (response.code == '001') {
        $('.success').show();
      } else if (response.code == '009') {
        $('.fail').show();
      }
    },
  });
}
