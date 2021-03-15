$('#groupName').change(function() {
  findName();
});


$(document).on('click', 'button.add-group-member', function() {
  addGroupMember();
});


$(document).on('click', '.btn-edit', function() {
  groupInfo($(this).parent().prop('id'), 'edit');
});


$(document).on('click', '.btn-info', function() {
  groupInfo($(this).parent().prop('id'), 'info');
});


$(document).on('click', 'button.del-member', function() {
  parent = $(this).parent();
  if ($(this).hasClass('exist')) {
    delMember(parent.prop('id'), $('.member-list').prop('id'), 'exist');
  } else {
    delMember(parent.prop('id'), '', 'none');
  }
});


$(document).on('click', '.del-group', function() {
  delGroup($(this).parent().prop('id'));
});


$(document).on('click', '#groupCreate', function() {
  uploadGroup();
});

// 返回
$(document).on('click', '#back', function() {
  $('div.member-list').children().remove();
  $('.CreateGroup').hide();
  $('.list').show();
  $('member-list').prop('id', '');
  $('.groupInput').val('').removeAttr('readonly');
  $('#groupCreate').hide();
  $('.member').hide();
});


$(document).on('click', '.group-create', function() {
  groupInfo('', 'create');
});


/**
 * 查詢是否有名稱重複的群組
 */
function findName() {
  $('div.member-list').children().remove('.createmember');
  if ($('#groupName').val() != '' && !$('#groupName').val().match(/^\s+/)) {
    dataFindName = {
      groupName: $('#groupName').val(),
    };
    $.ajax({
      type: 'POST',
      url: 'http://163.18.42.222:8888/Fiestadb/Group/FIndName',
      data: JSON.stringify(dataFindName),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      contentType: 'application/json',
      datatype: JSON,
      success: function(data) {
        if (data.code == '005') {
          $.confirm({
            title: '失敗！',
            animation: 'zoom',
            closeAnimation: 'scale',
            content: '群組名稱重複！',
            buttons: {
              確定: {
                btnClass: 'btn-success confirm',
                action: function() {
                  $('.groupName').val('');
                },
              },
            },
          });
        } else if (data.code == '001') {
          insertProfile();
        }
      },
    });
  }
}


/**
 * 若群組名稱沒重複，則把個人檔案的值填入表單
 */
function insertProfile() {
  $.ajax({
    type: 'POST',
    url: 'http://163.18.42.222:8888/Fiestadb/Account/ValidateLogin',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
    },
    success: function(data) {
      $.each(data.result, function(indexInArray, content) {
        $.cookie('qsacw', content.token, {expires: 7}, {path: '/'});
        if (content.Address != 'None') {
          $('#groupAddress').val(content.Address);
        }
        if (content.Phone != 'None') {
          $('#groupPhone').val(content.Phone);
        }
        if (content.Mail_1 != 'None') {
          $('#groupEmail').val(content.Mail_1);
        }
        member = '<hr class="createmember"><div class="row createmember">' +
        '<div class="col-2"><div class="test"></div></div>' +
        '<div class="col-3"><h6 class="lh-3">' + content.userName +
        '</h6></div></div>';
        $('div.member-list').prepend(member);
        $('div.createmember').children('.col-2').children('.test').css(
            'background-image', 'url("' + content.Photo + '")');
      });
    },
  });
}


/**
 * 查看群組內容
 * @param {string} id 群組id
 * @param {string} name 看是編輯或是查看
 */
function groupInfo(id, name) {
  $('html,body').animate({scrollTop: 0}, 'slow');
  $('.CreateGroup').show();
  $('.list').hide();
  if (name == 'info') {
    $('h5.title-group').html('群組資料');
    $('.groupInput').prop('readonly', 'readonly');
    $('.member').hide();
    $('.member-list').show();
    $('#groupCreate').hide();
    $('#back').show();
  } else if (name == 'edit') {
    $('#groupCreate').show().html('更新');
    $('button#Add').show();
    $('.member').show();
    $('h5.title-group').html('編輯群組');
    $('.member-list').prop('id', id);
    $('#back').show();
  }
  if (name == 'create') {
    $('h5.title-group').html('創建一個永久群組');
    $('.member').show();
    $('#groupCreate').show().html('創建');
  } else {
    dataGroupSelect = {
      groupId: id,
    };
    $.ajax({
      async: false,
      type: 'POST',
      url: 'http://163.18.42.222:8888/Fiestadb/Group/select',
      data: JSON.stringify(dataGroupSelect),
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      datatype: JSON,
      success: function(data) {
        $.each(data.result, function(indexInArray, content) {
          $('#groupName').val(content.groupName);
          $('#groupAddress').val(content.Address);
          $('#groupEmail').val(content.Mail);
          $('#groupPhone').val(content.Phone);
        });
      },
    });
    $.ajax({
      type: 'POST',
      async: false,
      url: 'http://163.18.42.222:8888/Fiestadb/Group/Member/select',
      data: JSON.stringify(dataGroupSelect),
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      datatype: JSON,
      success: function(data) {
        if (data.code == '001') {
          $.each(data.result, function(indexInArray, content) {
            if (name == 'info') {
              memberlist = '<div class="row" id="member-' + (indexInArray + 1) +
              '"><div class="col-2"><div ' +
              'class="test" id="member-pic-' + (indexInArray + 1) +
              '"></div></div>' +
              '<div class="col-3"><h6 class="lh-3">' + content.nickName +
              '</h6></div></div>';
            } else if (name == 'edit') {
              memberlist = '<div class="row"><div class="col-2"><div ' +
              'class="test" id="member-pic-' + (indexInArray + 1) +
              '"></div></div>' +
              '<div class="col-3"><h6 class="lh-3">' + content.nickName +
              '</h6></div><div class="col-7" id="' + content.authId +
              '"><button class="btn btn-danger ' +
              'btn-group del-member m-0 mt-2 p-1 float-right exist">' +
              '<i class="fas fa-times"></i></button></div></div>';
            }
            $('.member-list').append(memberlist);
            $('#member-pic-' + (indexInArray+
              1)).css('background-image', 'url("' + content.Photo + '")');
          });
        }
      },
    });
  }
}


/**
 * 刪除會員
 * @param {string} id 群組id
 * @param {string} groupNum 群組id
 * @param {string} method 看該成員是否存在
 */
function delMember(id, groupNum, method) {
  $.confirm({
    title: '警告',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '確定要刪除嗎？無法恢復',
    buttons: {
      確認: {
        btnClass: 'btn-danger',
        action: function() {
          if (method == 'exist') {
            dataMemberDelete = {
              authId: id,
              groupId: groupNum,
            };
            $.ajax({
              type: 'POST',
              url: 'http://163.18.42.222:8888/Fiestadb/Group/Member/delete',
              data: JSON.stringify(dataMemberDelete),
              contentType: 'application/json',
              beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + $.cookie('qsacw'));
              },
              datatype: JSON,
              success: function(data) {
                $('#' + id).parent().remove();
              },
            });
          } else if (method == 'none') {
            $('#' + id).parent().remove();
          }
        },
      },
      我再想想: function() {
      },
    },
  });
}


/**
 * 加入群組成員
 */
function addGroupMember() {
  if ($('input#member').val() != '' && !$('input#member').val().match(/^\s+/)) {
    dataMember = {
      Search: $('input#member').val(),
    };
    $.ajax({
      type: 'POST',
      url: 'http://163.18.42.222:8888/Fiestadb/Account/Search',
      data: JSON.stringify(dataMember),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
      },
      contentType: 'application/json',
      datatype: JSON,
      success: function(data) {
        if (data.code == '013') {
          $.alert({
            title: '喔不！',
            content: '查無此會員！',
          });
        } else if (data.code == '001') {
          console.log(data);
          $.each(data.result, function(indexInArray, content) {
            member = '<div class="row"><div class="col-2">' +
            '<div class="test" id="add-member-' + (indexInArray + 1) +
            '"></div></div><div class="col-3"><h6 class="lh-3">' +
            content.nickName +'</h6></div><div class="col-7 tempGroupMember" ' +
            'id ="' + content.Id + '">' +
            '<button class="btn btn-danger btn-group del-member ' +
            'm-0 mt-2 p-1 float-right"><i class="fas fa-times">' +
            '</i></button></div></div>';
            $('div.member-list').append(member);
            $('#add-member-' + (indexInArray + 1)).css(
                'background-image', 'url("' + content.Photo + '")');
          });
          $('input#member').val('');
        }
      },
    });
  }
}

/**
 * 刪除群組
 * @param {string} GroupNum 群組id
 */
function delGroup(GroupNum) {
  $.confirm({
    title: '警告',
    animation: 'zoom',
    closeAnimation: 'scale',
    content: '確定要刪除嗎？無法恢復',
    buttons: {
      確認: {
        btnClass: 'btn-danger confirm',
        action: function() {
          dataGroupDelete = {groupId: GroupNum};
          $.ajax({
            type: 'POST',
            url: 'http://163.18.42.222:8888/Fiestadb/Group/delete',
            data: JSON.stringify(dataGroupDelete),
            contentType: 'application/json',
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization',
                  'Bearer ' + $.cookie('qsacw'));
            },
            datatype: JSON,
            success: function(response) {
              location.reload();
            },
          });
        },
      },
      我再想想: function() {
      },
    },
  });
}

/**
 * 上傳或更新群組資料
 */
function uploadGroup() {
  if ($('#groupCreate').html() == '創建') {
    if ($('#groupName').val() == '') {
      $('#warring').html('活動名稱未填!');
      $('#warring').show();
    } else {
      Id = [];
      Id.push(parseInt($.cookie('Id')));
      for (i = 0; i < $('.tempGroupMember').length; i++) {
        Id.push(parseInt($('.tempGroupMember').eq(i).prop('id')));
      }
      dataGroupUpload = {
        authId: Id,
        groupName: $('#groupName').val(),
        Address: $('#groupAddress').val(),
        Mail: $('#groupEmail').val(),
        Phone: $('#groupPhone').val(),
        Useable: 'true',
      };
      $.ajax({
        type: 'POST',
        url: 'http://163.18.42.222:8888/Fiestadb/Group/upload',
        data: JSON.stringify(dataGroupUpload),
        contentType: 'application/json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
        },
        datatype: JSON,
        success: function(data) {
          if (data.code == '001') {
            $.confirm({
              title: '成功',
              animation: 'zoom',
              closeAnimation: 'scale',
              content: '立刻去建立活動吧！',
              buttons: {
                確定: {
                  btnClass: 'btn-success confirm',
                  action: function() {
                    location.reload();
                  },
                },
              },
            });
          }
        },
      });
    }
  } else if ($('#groupCreate').html() == '更新') {
    if ($('#groupName').val() == '') {
      $.confirm({
        title: '錯誤',
        animation: 'zoom',
        closeAnimation: 'scale',
        content: '群組名稱不得為空',
        buttons: {
          確定: {
            btnClass: 'btn-success confirm',
            action: function() {
            },
          },
        },
      });
    } else {
      dataGroupUpdate = {
        groupId: $('.member-list').prop('id'),
        groupName: $('#groupName').val(),
        Address: $('#groupAddress').val(),
        Mail: $('#groupEmail').val(),
        Phone: $('#groupPhone').val(),
      };
      $.ajax({
        type: 'POST',
        url: 'http://163.18.42.222:8888/Fiestadb/Group/update',
        data: JSON.stringify(dataGroupUpdate),
        contentType: 'application/json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('qsacw'));
        },
        datatype: JSON,
        success: function(response) {
        },
      });
      for (i = 0; i < $('.tempGroupMember').length; i++) {
        dataMemberUpload = {
          groupId: $('.member-list').prop('id'),
          authId: $('.tempGroupMember').eq(i).prop('id'),
        };
        $.ajax({
          type: 'POST',
          url: 'http://163.18.42.222:8888/Fiestadb/Group/Member/upload',
          data: JSON.stringify(dataMemberUpload),
          contentType: 'application/json',
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + $.cookie('qsacw'));
          },
          datatype: JSON,
          success: function(response) {
          },
        });
      }
    }
    $.confirm({
      title: '成功',
      animation: 'zoom',
      closeAnimation: 'scale',
      content: '更新成功！',
      buttons: {
        確認: {
          btnClass: 'btn-success confirm',
          action: function() {
            location.reload();
          },
        },
      },
    });
  }
}
