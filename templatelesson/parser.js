/*
    Tux For Starters - Parser Template Code
    Parser code authored by Joaquin, multiple choice code by Mayank
    Under GPLv3
*/

// Instnatiate new terminal variable
var term = new Terminal();

// Command buffer
var cmdBuff = "";

// Attempt counter to determine when to provide hints; default to 1 for first attempt
var attemptCount = 1;

// Flag to check if lesson is solved
var isSolved = false;

// Current directory for demonstration
var currWd = "~";

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
    if (/^\s*cd ((.|~)\/)?newlesson\/?\s*$/.exec(cmdIn)) {
        // Append star rating
        $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
        // Append reset button
        $("#suggestionsArea")[0].innerHTML += "<button class=\"tuxButton\" id=\"Started\" onclick=\"resetTerm()\"><span>Reset Lesson</span></button></a>";
        // Append next button
        $("#suggestionsArea")[0].innerHTML += " <a href=\"#\"><button class=\"tuxButton\"><span>Next Lesson</span></button></a>";
        // Set current directory to newlesson
        currWd = "newlesson";
        // Set solved flag to true
        isSolved = true;
        // Print result
        return "";
    } else {
        // Otherwise, set a suggestion
        $("#suggestionsArea")[0].innerHTML = "Suggestion stuff.";
        // If attempt is 3 or over
        if (attemptCount >= 3) {
            // Add hint
            $("#suggestionsArea")[0].innerHTML += "<br/><br/>Appended hint.";
        } else {
            // Otherwise increment attempt counter
            attemptCount++;
        }
        // Print error
        return "\r\nUnknown command";
    }



}

// This function will check the radio buttons and determine if the correct answer was chosen. 
function checkMultipleChoice(){



    // Get pointer of valid response
    // Replace "#ans2" with the ID of the valid answer, such as "#ans6" and what not
    var ansChoice = $("#ans2")[0];



    // Check if the valid radio button is marked
    if (ansChoice.checked) {
        // Mark that the question has been solved
        isSolved = true;
        // Show star rating based on attempts
        giveStars(attemptCount);
    } else {
        // Increment attempt if invalid response is given
        attemptCount++;
        // Show a hint after three failed attempts
        if (attemptCount >= 3) {
            giveHint("Suggestion stuff.");
        }
    }
}

/*
    Below is vital code to get stuff working properly.

    This can be tweaked to meet the needs of the lesson,
    such as the instructions that will be outputted to
    the terminal, but a majority of this is best left as-is.
*/
// Function that will assign a hint to the suggestion area
function giveHint(hintMsg){
    $("#suggestionsArea")[0].innerHTML = hintMsg;
}

// Function that will assign stars given the amount of attempts made
function giveStars(count){
    // Clear any prior messages
    $("#suggestionsArea")[0].innerHTML = "";
    // Switch that will add the appropriate star rating
    switch (count){
        case 1: // One attempt
        case 2: // Two attempts
            // Three stars if one or less attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Break switch
            break;
        case 3: // Three attempts
        case 4: // Four attempts
            // Two stars if three to four attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Break switch
            break;
        default: // Other number of attempts
            // One star for five or more attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span></h1>";
    }
}
// Function that will output initial prompt
function prompt(term) {
    term.write("\r\n\x1B[1;34mlesson1@tux4starters\x1B[0m:" + currWd + "$ ");
}
// Function that will launch xterm lesson code
function launchLesson() {
    // If terminal is already initialized
    if (term._initialized) {
        // No need to do anything else
        return;
    }

    // Set terminal initialize state to true
    term._initialized = true;

    // Set terminal prompt
    term.prompt = () => {
        term.write("\r\n\x1B[1;34mlesson1@tux4starters\x1B[0m:" + currWd + "$ ");
    };

    // Print welcome message
    term.writeln("\x1B[1;33mTux For Starters\x1B[0m\r\n");



    /*
        Print instructions

        This is where you place your lesson prompt.
        writeln() is basically like println().
    */
    term.writeln("Your instructions go here!");
    term.writeln("This sample module asks that you change your active directory to \"newlesson\".");



    // Print out prompt
    prompt(term);

    // Set on data listener
    term.onData(e => {
        // If solved flag for demonstration is not set
        if (!isSolved) {
            // Switch statement that will check output
            switch (e) {
                case "\r": // Enter key
                    // If "clear" command was entered
                    if (cmdBuff == "clear") {
                        // Clear terminal and break
                        term.clear($("#terminal")[0]);
                        while (!(cmdBuff == "")) {
                            // Remove last char by slicing it off
                            cmdBuff = cmdBuff.slice(0, -1);
                            // Backspace
                            term.write("\b \b");
                        }
                        break;
                    } else {
                        // Else send current command buffer to exec code and write output
                        term.write(termParse(cmdBuff));
                        // Continue to next case for prompt; no break
                    }
                case "\u0003": // Ctrl+C
                    // Clear buffer
                    cmdBuff = "";
                    // Call for prompt reset
                    prompt(term);
                    break;
                case "\u007F": // Backspace (DEL)
                    // If buffer is not empty
                    if (!(cmdBuff == "")) {
                        // Remove last char by slicing it off
                        cmdBuff = cmdBuff.slice(0, -1);
                        // Backspace
                        term.write("\b \b");
                    }
                    // Break off statement
                    break;
                default:
                    // If input is not a control sequence (e.g. cursor keys)
                    if (!(e.includes("\x1B"))) {
                        // Add character to buffer and write to terminal
                        cmdBuff += e;
                        term.write(e);
                    }
            }
        }
    });
}
// Function that will initialize a terminal and launch the lesson
function newTerm() {
    // Open the terminal in #terminal <div>
    term.open($("#terminal")[0]);
    // Launch lesson now
    launchLesson();
}
// Function that will reset the simulation
function resetTerm() {
    // Clear command buffer
    cmdBuff = "";
    // Reset attempt counter
    attemptCount = 1;

    // Reset current directory for demonstration
    currWd = "~";

    // Set terminal initialize state to false
    term._initialized = false;
    // Set solved flag to false
    isSolved = false;
    // Clear any prior messages
    $("#suggestionsArea")[0].innerHTML = "";
    // Dispose current terminal
    term.dispose();
    // Create new terminal object
    term = new Terminal();
    // Initialize the new terminal
    newTerm();
}
