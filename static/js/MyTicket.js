$(document).ready(function() {
  getTicket();
});


$(document).on('click', $('.ticket-all'), function() {
  showQrcode();
});


/**
 * 取得會員票
 */
function getTicket() {
  dataGetticket = {
    authId: $.cookie('Id'),
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Account/getUnexpiredAct',
    data: JSON.stringify(dataGetticket),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          if (content.ticketKinds == 'None') {
            ticket = '<div class="ticket-all"  data-toggle="modal"' +
            ' data-target="#QRModal"><span class="id">' +
            content.act_Id + '</span><div class="img-area">' +
            '<img src="' + content.Photo + '" class="img">' +
            '</div><div class="text-area"><div class="number">' +
            'No.' + (indexInArray+1) + '</div>' +
            '<div class="big clear-float">' + content.act_Name +
            '</div><div class="content"><div class="type">' +
            '免費票' + '</div>' + '<div class="time">' +
            content.startTime + '</div></div></div></div>';
          } else {
            ticket = '<div class="ticket-all"  data-toggle="modal"' +
            ' data-target="#QRModal"><span class="id">' +
            content.act_Id + '</span><div class="img-area">' +
            '<img src="' + content.Photo + '" class="img">' +
            '</div><div class="text-area"><div class="number">' +
            'No.' + (indexInArray+1) + '</div>' +
            '<div class="big clear-float">' + content.act_Name +
            '</div><div class="content"><div class="type">' +
            content.ticketKinds + '</div>' + '<div class="time">' +
            content.startTime + '</div></div></div></div>';
          }
          $('.ticketlist').append(ticket);
        });
      }
    },
  });
}


/**
 * 顯示Qrcode
 */
function showQrcode() {
  dataGetQRcode = {
    Input: location.href,
  };
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/QRcode',
    data: JSON.stringify(dataGetQRcode),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $('.QRcode').prop('src', 'data:image/bmp;base64,' + data);
    },
  });
}
