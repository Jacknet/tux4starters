/*
    Tux For Starters - Parser Template Code
    Parser code authored by Joaquin, multiple choice code by Mayank
    Under GPLv3
*/

// Set variables
var stepOneDone = false;
var stepTwoDone = false;

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
    // If no session ID is stored
    if (!sessionId) {
        // Send client to login page
        window.location.href = "/signin.html"
        // Return, ensuring function does not execute
        return "";
    }
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
    if ((/^\s*ls\s*$/.exec(cmdIn)) && !(stepOneDone)) {
        // If mkdir is correct and step one is not done
        // Mark step 1 as done
        stepOneDone = true;
        // Print result
        term.writeln ("\r\n\nABC Documents Example Music Pictures");
        return "";
    } else if (!(stepOneDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "List all of the files in the root directory first.";
        // Increment attempt counter
        attemptCount++;
        // If attempt is 3 or over
        if (attemptCount > 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use the <strong>ls</strong> command to list everything in the directory.";
        }
        // Print error
        return "\r\nUnknown command";
    }

    // Step 2 code
    if ((/^\s*rm ABC\s*$/.exec(cmdIn)) && (stepOneDone) && !(stepTwoDone)) {
        stepOneDone = true;
        stepTwoDone = true;
        // Change working directory
        return "\r\nYou removed ABC, list everything next.\r\n";
    } else if ((stepOneDone) && !(stepTwoDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "The second step is to remove the file named ABC.";
        // Increment attempt counter
        attemptCount++;
        // If attempt is 3 or over
        if (attemptCount > 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use <strong>rm</strong> to remove the file.";
        }
        // Print error
        return "\r\nUnknown command";
    }

    // Step 3 code
    if ((/^\s*ls\s*$/.exec(cmdIn)) && (stepOneDone) && (stepTwoDone)) {
        // Append star rating
        postTerm(giveStarsTerm(attemptCount));
        // Append reset button
        $("#suggestionsArea")[0].innerHTML += "<button class=\"tuxButton\" id=\"Started\" onclick=\"resetTerm()\"><span>Reset Lesson</span></button></a>";
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"../cat/content.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
        // Mark solved
        isSolved = true;
        // Reset variables
        stepOneDone = false;
        stepTwoDone = false;
        // Print result
        term.writeln ("\r\n\nDocuments Example Music Pictures");
        return "";
    } else if ((stepOneDone) && (stepTwoDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "Finally, list all the files and folders again.";
        // Increment attempt counter
        attemptCount++;
        // If attempt is 3 or over
        if (attemptCount > 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use the same <strong>ls</strong> command you used in the first step.";
        }
        // Print error
        return "\r\nUnknown command";
    }


}

// This function will check the radio buttons and determine if the correct answer was chosen. 
function checkMultipleChoice(){
    // If no session ID is stored
    if (!sessionId) {
        // Send client to login page
        window.location.href = "/signin.html"
        // Return, ensuring function does not execute
        return "";
    }



    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans1")[0];



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
            giveHint("Remember that the command to remove a directory, it is rmdir, so removing a file would be that command without the 'dir'.");
        } else {
            giveHint("Try again!");
        }
    }
}
