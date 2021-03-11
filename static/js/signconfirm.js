$(document).ready(function () {
    $(document).on('click', '#capture', function () {
        $(this).parent().append('<video id="video" autoplay style="width: 480px;height: 320px"></video>')
    });
});