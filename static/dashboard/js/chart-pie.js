Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui' +
'BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
$(document).ready(function() {
  selectTicket();
});

/**
 * 圓餅圖
 */
function selectTicket() {
  dataTicketbyAct = {
    act_Id: $.cookie('actid'),
  };
  label = [];
  dataMount = [];
  $.ajax({
    type: 'POST',
    url: 'https://fiesta-o2o.tw/Fiestadb/Ticket/SelectByAct',
    data: JSON.stringify(dataTicketbyAct),
    contentType: 'application/json',
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '001') {
        $.each(data.result, function(indexInArray, content) {
          ticketLabel = '<span class="mr-2">' +
          '<i class="fas fa-circle text-main"></i>' + content.ticketKinds +
        '</span>';
          $('.chart-text').append(ticketLabel);
          label.push(content.ticketKinds);
          dataMount.push(content.Mounts);
        });
        const ctx = document.getElementById('myPieChart');
        // eslint-disable-next-line no-unused-vars
        const myPieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: label,
            datasets: [{
              data: dataMount,
              backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#BCDEBD',
                '#BFADD9', '#FFD463', '#FFD9D9', '#F56774', '#F3F1A6'],
              hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
              hoverBorderColor: 'rgba(234, 236, 244, 1)',
            }],
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: 'rgb(255,255,255)',
              bodyFontColor: '#858796',
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            legend: {
              display: false,
            },
            cutoutPercentage: 80,
          },
        });
      } else if (data.code == '013') {
        $('.chart-text').remove();
        $('.chart-pie').remove();
        text = '<span>尚未開啟進階活動模組</span>';
        $('.onlyticket').append(text);
      }
    },
  });
}

