/*
    Tux For Starters - Parser Template Code
    Parser code authored by Joaquin, multiple choice code by Mayank
    Under GPLv3
*/
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
    if ((/^\s*cd Music\s*$/.exec(cmdIn)) && !(stepOneDone)){
        // If ls is correct and step one is not done
        // Mark step 1 as done
        stepOneDone = true;
        // Change directory name
        currWd = "~/Music"
        return "";
    } else if (!(stepOneDone) & !(stepTwoDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "The first step is to change the directory to the Music folder.";
        // If attempt is 3 or over
        if (attemptCount >= 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use the <strong>cd</strong> command to go to the Music folder.";
        }
        // Increment attempt counter
        attemptCount++;
        // Print error
        return "\r\nUnknown command";
    }

    // Step 2 code
    if ((/^\s*ls\s*$/.exec(cmdIn)) && (stepOneDone) && !(stepTwoDone)) {
        stepOneDone = true;
        stepTwoDone = true;
        // Print result
        term.writeln ("\r\n\nAnthem Band Concert Lyrics Song-Title");
        return "";
    } else if ((stepOneDone) && !(stepTwoDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "The second step is to list everything in the Music folder.";
        // If attempt is 3 or over
        if (attemptCount >= 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use <strong>cd</strong> to go into a directory.";
        }
        // Increment attempt counter
        attemptCount++;
        // Print error
        return "\r\nUnknown command";
    }

    // Step 3 code
    if ((/^\s*cat Song-Title Lyrics\s*$/.exec(cmdIn)) && (stepOneDone) && (stepTwoDone)) {
        // Append star rating
        postTerm(giveStarsTerm(attemptCount));
        // Append reset button
        $("#suggestionsArea")[0].innerHTML += "<button class=\"tuxButton\" id=\"Started\" onclick=\"resetTerm()\"><span>Reset Lesson</span></button></a>";
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"/lessons\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
        // Mark solved
        isSolved = true;
        // Reset variables
        stepOneDone = false;
        stepTwoDone = false;
        // Print result
        term.writeln ("\r\n\nLa La La Music\r\nLa la la, I am singing a song, la la la");
        return "";
    } else if ((stepOneDone) && (stepTwoDone)) {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "The last step is to show the content of both of these files.";
        // If attempt is 3 or over
        if (attemptCount >= 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Use the <strong>cat</strong> command and the name of the two files starting with Song-Title.";
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
        $("#suggestionsArea")[0].innerHTML += " <a href=\"assignment.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after three failed attempts
        if (attemptCount >= 3) {
            giveHint("In the examples on the page, 'Documents' was a folder and 'Example' was a file.");
        }
    }
}


//Parser for cat
function checkMultipleChoice(){

    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans2")[0];

    // Check if the valid radio button is marked
    if (ansChoice.checked) {
        // Mark that the question has been solved
        isSolved = true;
        // Show and POST star rating based on attempts
        //this will also show "Correct!"
        postMult(giveStarsMult(attemptCount));
        $("#suggestionsArea")[0].innerHTML += " <a href=\"assignment.html\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after a failed attempts
        //this will also show "incorrect!"
        giveHint("Review the beginning of the lesson.");
        
    }
}