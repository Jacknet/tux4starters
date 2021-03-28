//Parser for mv

function checkMultipleChoice(){

    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans1")[0];

    // Check if the valid radio button is marked
    if (ansChoice.checked) {
        // Mark that the question has been solved
        isSolved = true;
        // Show star rating based on attempts
        //this will also show "Correct!"
        giveStarsMult(attemptCount);
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after a failed attempts
        //this will also show "incorrect!"
        giveHint("Review section 1 again");
        
    }
}