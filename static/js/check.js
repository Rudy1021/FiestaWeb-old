$(document).ready(function() {
  vaildTicket();
});
/**
 * 驗票
 */
function vaildTicket() {
  if ($.cookie('Id') == undefined) {
    url = new URL(location.href);
    id = url.searchParams.get('id');
    $.cookie('check', id);
    location.href = '/login';
  } else {
    url = new URL(location.href);
    id = url.searchParams.get('id');
    data = {
      act_Id: id,
      authId: $.cookie('Id'),
    };
    $.ajax({
      type: 'POST',
      url: 'http://163.18.42.222:8888/Fiestadb/Ticket/vaild',
      data: JSON.stringify(data),
      async: false,
      contentType: 'application/json',
      datatype: JSON,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      success: function(data) {
        console.log(data.code);
        $.cookie('code', data.code, {path: '/'});
        setInterval(function() {
          location.href = '/success';
        }, 1500);
      },
    });
  }
}
