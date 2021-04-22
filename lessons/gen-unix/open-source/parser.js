/*
    Tux For Starters - Parser Template Code
    Parser code authored by Joaquin, multiple choice code by Mayank
    Under GPLv3
*/

// This function will check the radio buttons and determine if the correct answer was chosen. 
function checkMultipleChoice(){



    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans1")[0];



    // Check if the valid radio button is marked
    if (ansChoice.checked) {
        // Mark that the question has been solved
        isSolved = true;
        // Show star rating based on attempts
        giveStarsMult(attemptCount);
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"../start/content.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after three failed attempts
        if (attemptCount >= 3) {
            giveHint("You would receive something that also contains the word 'Source'.");
        }
    }
}
