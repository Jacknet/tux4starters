/*
    Tux For Starters - Parser Template Code
    Parser code authored by Joaquin, multiple choice code by Mayank
    Under GPLv3
*/
var stepOneDone = false;

// Instructions for lesson
function termInstr(term) {
    /*
        Print instructions

        This is where you place your lesson prompt.
        writeln() is basically like println().
    */
    /*
    term.writeln("This sample module asks that you change your active directory to \"folder1\".");
    */
}

// Check function
function termParse(cmdIn) {
    // If command entered is empty
    if (cmdIn == "") {
        // Return no string
        return "";
    }

    // Clear any prior messages
    $("#suggestionsArea")[0].innerHTML = "";
    


    /*
        Your check code starts here.

        This is where you compare the command input to a format you are expecting.

        There are three ways to match for command input:
            1. You can check string equality using ==.
            cmdIn == "match" will return true if and only if cmdIn stores "match" exactly.
            2. You can use includes() for string comparison.
            cmdIn.includes("match") will return true if "match" is found anywhere in the string.
            3. You can opt for exec() for regular expression.
            /^module[0-9]$/.exec(cmdIn) will return true if cmdIn matches "module#" exactly, but # can be any digit from 0 to 9.

        Regular expression can get nauseating to work with, but it is
        the most optimal choice for powerful dynamic input parsing.

        A sample check to see if the user inputted a directory change to "newlesson" is provided.
        This example uses regular expression.
    */
    /*
        If string is any of the following combinations, with and without spacing on either side:
        "cd newlesson"
        "cd newlesson/"
        "cd ./newlesson"
        "cd ./newlesson/"
        "cd ~/newlesson"
        "cd ~/newlesson/"
    */
    // Step 1 code
    if ((/^\s*touch ABC\s*$/.exec(cmdIn)) && !(stepOneDone)) {
        // If first step is correct and step one is not done
        // Mark step 1 as done
        stepOneDone = true;
        // Print result
        return "\r\nYou have created a file called ABC, next list everything.\r\n";
    } else if (!(stepOneDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "Remember to use the command to quickly create empty files. Remember that the file will be called ABC.";
        // If attempt is 3 or over
        if (attemptCount > 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use the <strong>touch</strong> command to create an empty file.";
        }
        // Increment attempt counter
        attemptCount++;
        // Print error
        return "\r\nUnknown command";
    }

    // Step 2 code
    if ((/^\s*ls\s*$/.exec(cmdIn)) && (stepOneDone)) {
        // Append star rating
        postTerm(giveStarsTerm(attemptCount));
        // Append reset button
        $("#suggestionsArea")[0].innerHTML += "<button class=\"tuxButton\" id=\"Started\" onclick=\"resetTerm()\"><span>Reset Lesson</span></button></a>";
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"../cp/content.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
        // Mark solved
        isSolved = true;
        // Reset variables
        stepOneDone = false;
        // Print result
        term.writeln ("\r\n\nABC Documents Example Music Pictures");
        return "";
    } else if ((stepOneDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "Use the command to list all the files and folders in this directory.";
        // If attempt is 3 or over
        if (attemptCount > 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use <strong>ls</strong> to list all the files.";
        }
        // Increment attempt counter
        attemptCount++;
        // Print error
        return "\r\nUnknown command";
    }



}

// This function will check the radio buttons and determine if the correct answer was chosen. 
function checkMultipleChoice(){



    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans3")[0];



    // Check if the valid radio button is marked
    if (ansChoice.checked) {
        // Mark that the question has been solved
        isSolved = true;
        // Show and POST star rating based on attempts
        postMult(giveStarsMult(attemptCount));
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"assignment.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after three failed attempts
        if (attemptCount >= 3) {
            giveHint("Remember that the command starts with a 't'.");
        } else {
            giveHint("Try again!");
        }
    }
}
