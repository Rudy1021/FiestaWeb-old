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
    url: 'https://fiesta-o2o.tw/Fiestadb/QRcode',
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
