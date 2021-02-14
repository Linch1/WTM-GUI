$(document).ready( evt => {
    const allDragAndDrops = $(".drag-drop");
    allDragAndDrops.each( (i, dragDropContainer ) => {
        new Sortable(dragDropContainer, {
            animation: 350,
            filter: '.ignore-drag',
            group: `drag-drop-${i}`,
            forceFallback: true,
            onStart() {
                Sortable.ghost.style.opacity = 0;
            }
        });
    });
});