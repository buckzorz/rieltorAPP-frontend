function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("mySidenav").style.padding = "25px";
    document.getElementById("main").style.marginLeft = "400px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").style.padding = "0";
    document.getElementById("main").style.marginLeft = "0";
}
/*

$('.carousel').carousel({
    interval: false
});
*/

$(document).on('ready', function() {
    $("#imgUpload").fileinput({
        maxFileCount: 10,
        allowedFileExtensions: ["jpg", "gif", "png"]
    });
});