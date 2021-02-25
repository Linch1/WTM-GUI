$(document).ready( evt => {
    $(".folder-path header").click( evt => {
        evt.stopPropagation();
        let folderTarget = $( evt.currentTarget ).parent(".folder-path");
        folderTarget.toggleClass('close-folder');
    });
});