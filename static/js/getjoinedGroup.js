$(document).ready(function() {
  getJoinedGroup();
});

/**
 * 取得已加入的群組
 */
function getJoinedGroup() {
  datagetJoinedGroup = {authId: $.cookie('Id')};
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/getJoinedGroup',
    data: JSON.stringify(datagetJoinedGroup),
    contentType: 'application/json',
    datatype: JSON,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      if (data.code == '009' || data.code == '019') {
        $.confirm({
          title: '喔不！',
          animation: 'zoom',
          closeAnimation: 'scale',
          content: '工作階段過期，請重新登入！',
          buttons: {
            確認: {
              btnClass: 'btn-success',
              action: function() {
                $.removeCookie('Id', {path: '/'});
                $.removeCookie('qsacw', {path: '/'});
                location.href = '/login';
              },
            },
          },
        });
      } else if (data.code == '001') {
        if (location.pathname == '/CreateEvent') {
          $.each(data.result, function(indexInArray, content) {
            Group = '<option id="' + content.groupId + '">' +
            content.groupName + '</option>';
            $('#groupSelect').append(Group);
          });
        } else if (location.pathname == '/Group') {
          if (data.result.length == 0) {
            $('#warring').text('您尚未創立群組！');
            $('.danger').show();
            $('.CreateGroup').show();
            $('.list').hide();
            $('#back').hide();
          } else {
            $.each(data.result, function(indexInArray, content) {
              grouplist = '<li class="list-group-item list-group-li">' +
              '<h6 class="float-left">群組' + (indexInArray+1) +
              '</h6><div class="float-right group-' + (indexInArray+1) +
              '" id="' + content.groupId +
              '"><button class="group-btn btn btn-info btn-radius-2 mr-1">' +
              '<i class="far fa-eye"></i><button ' +
              'class="group-btn btn btn-edit btn-success btn-radius-2 mr-1">' +
              '<i class="fas fa-pencil-alt"></i></button>' +
              '<button class="group-btn btn btn-danger del-group btn-radi' +
              'us-2"><i class="fas fa-minus"></i></button>' +
              '</div><div class="clear-float"><h7>' +
              content.groupName + '</h7><br></div></li>';
              $('#allgroup').append(grouplist);
            });
          }
        }
      }
    },
  });
}
