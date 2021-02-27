$(document).ready( evt => {
    const allDragAndDrops = $(".drag-drop");
    allDragAndDrops.each( (i, dragDropContainer ) => {
        new Sortable(dragDropContainer, {
            animation: 350,
            group: `drag-drop-${i}`,
            draggable: [".item", ".drag-drop"],
            forceFallback: true,
            onStart() {
                Sortable.ghost.style.opacity = 0;
            }
        });
    });
});