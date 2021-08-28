//to set up what should happen if one of the edit buttons are clicked
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter new text");
        //post returns a promise
        //a promise is very useful when we do not know how long an action is going to take
        axios.post('/update-item', {text: userInput}).then(function() {
            //comes later
        }).catch(function() {
            console.log("Please try again later")
        });
    }
})