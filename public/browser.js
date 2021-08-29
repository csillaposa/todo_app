//to set up what should happen if one of the edit buttons are clicked
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        //post returns a promise
        //a promise is very useful when we do not know how long an action is going to take
        if (userInput) {
            axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
            }).catch(function() {
                console.log("Please try again later")
            });
        }
    }
})