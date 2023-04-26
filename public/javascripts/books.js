const borrowBtn = document.getElementById('borrow-btn');

// borrowBtn.addEventListener('click', (e) => {
//     e.preventDefault()
//     console.log("clicked")
// })
$("#borrow-dialog").dialog({autoOpen: false, modal: true, height: "auto", width: 800});
$(borrowBtn).click(function(e) {
    e.preventDefault();
    console.log("clicked")
    $("#borrow-dialog").dialog("open");
    $("#borrow-dialog").dialog({
        classes: {
            "ui-dialog": "highlight"
        },
    });
});

$("#borrow-dialog-close-btn").click(function(e) {
    $("#borrow-dialog").dialog("close");
})