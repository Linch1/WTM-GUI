$(document).ready( evt => {

    tippy("[data-tippy-content]"); // initialize tippy tooltips elements
    
    $(".card-header ").click(evt => {
        let target = $(evt.currentTarget);
        target.closest('.card').toggleClass('open');
    });

});