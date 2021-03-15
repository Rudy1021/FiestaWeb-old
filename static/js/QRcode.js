$(document).ready(function() {
  $('.check-user').show();
  getQrcode();
});

/**
 * 取得Qrcode
 */
function getQrcode() {
  dataGetQRcode = {
    Input: location.protocol + '//' +
    location.hostname + '/check?id=' + $.cookie('QRcode'),
  };
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/QRcode',
    data: JSON.stringify(dataGetQRcode),
    contentType: 'application/json',
    datatype: JSON,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $('.QRcodeBig').prop('src', 'data:image/bmp;base64,' + data);
    },
  });
}
