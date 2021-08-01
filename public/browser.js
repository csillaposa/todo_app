document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter new text");
        //post returns a promise
        axios.post('/update-item', {text: userInput}).then(function() {
            //comes later
        }).catch(function() {
            console.log("Please try again later")
        });
    }
})