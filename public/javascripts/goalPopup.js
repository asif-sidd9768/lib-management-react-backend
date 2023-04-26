var modal = document.getElementById("myModal");
var goalAddModal = document.getElementById("goalAddPopUp")
var btn = document.getElementsByClassName("goalPopUp");
var goalAddBtn = document.getElementById("goal-add-button")
var span = document.getElementById("goal-detail-popup")
// var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementById("goal-add-close-btn");
var goalHeading = document.getElementById("goalHeading")
var goalDescription = document.getElementById("goal-description")
var goalDeadline = document.getElementById("goal-deadline")
var goalPriority = document.getElementById("goal-priority")
var goalCardD = document.getElementById("goal-card-d")
var goalPriorityDisplay = document.getElementById("goal-priority-display")


span.onclick = function () {
    goalPriorityDisplay.innerHTML = ""
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        goalPriorityDisplay.innerHTML = ""
        modal.style.display = "none";
    }
}

// window.onclick = function (event) {
//     if (event.target == goalAddPopUp) {
//         goalAddPopUp.style.display = "none";
//     }
// }

goalAddBtn.onclick = () => {
    goalAddPopUp.style.display = "block";
}

span1.onclick = function(){
    goalAddPopUp.style.display = "none"
}


function goalClick(){
    console.log("Clicked")
    console.log("================")
    console.log(event.target)
    const goalTitle = event.target.parentNode.children[0].outerText
    const goalDesc = event.target.parentNode.children[1].outerText
    const priority = event.target.parentNode.children[2].outerText
    const goalDeadlne = event.target.parentNode.nextElementSibling.children[1].outerText

    goalHeading.innerHTML = goalTitle
    goalDescription.innerHTML = goalDesc
    goalDeadline.innerHTML = goalDeadlne
    
    for(let i=0; i<priority; i++){
        goalPriorityDisplay.innerHTML += "<span class=\"fa fa-star goal-priority-star\"></span>"
    }
    for(let j=0; j<5-priority; j++){
        goalPriorityDisplay.innerHTML += "<span class=\"fa fa-star\"></span>"
    }   
    console.log(span)
    modal.style.display = "block";
}