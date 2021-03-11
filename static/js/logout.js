$(document).ready(function() {
  $('#logout').click(function(e) {
    $.removeCookie('Id', {path: '/'});
    $.removeCookie('qsacw', {path: '/'});
    location.href = '/';
  });
});
