/*
    Tux For Starters - Support Code
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

// Current directory
var currWd = "~";

// Variable that will hold a user session ID
var sessionId = "";

/*
    Below is vital code to get stuff working properly.
*/

// Code that will run on page ready to check session ID
$(document).ready(
    function() {
        /*
            PLACEHOLDER

            A session token is stored as a cookie, which identifies a logged on user with the back-end.

            Check for the cookie and that the server has the token logged on in the database.
            If its active, then just store the token in a variable for POSTing and change the "sign in" text to say "sign out", otherwise clear the cookie.
            Have it cleared when clicking sign out.
            Have code that checks if you are in the sign in page or register page to clear session!
            
            Upon sign-out, reload the page!
        */
        // console.log("COOKIE CHECK GOES HERE");
        // document.getElementById("sessionBtn").innerText = "Sign Out";
    }
);

// This would be overwritten by the lesson. Default term parse returns nothing.
function termParse(cmdIn) {
    // Return no string
    return "";
}

// This blank multiple choice check would also be overwritten. 
function checkMultipleChoice() {}

// Function that will assign a hint to the suggestion area
function giveHint(hintMsg){
    $("#suggestionsArea")[0].innerHTML = hintMsg;
    $("#result")[0].innerHTML ="Incorrect!";
}

// Functions that will POST a star rating to the server to be stored, as long as a session is active
function postMult(result) {
    // POST multiple choice star rating, with module and lesson to store at.
    // The window.location.pathname DOM parameter has the site path.
    // We just strip the current module and lesson.
    $.post("/post.html",
        {
            "multStarRating": result,
            "module": window.location.pathname.split("/")[2],
            "lesson": window.location.pathname.split("/")[3],
            "sessionId": sessionId
        }
    );
}
function postTerm(result) {
    // POST terminal star rating, with module and lesson to store at.
    // The window.location.pathname DOM parameter has the site path.
    // We just strip the current module and lesson.
    $.post("/post.html",
        {
            "termStarRating": result,
            "module": window.location.pathname.split("/")[2],
            "lesson": window.location.pathname.split("/")[3],
            "sessionId": sessionId
        }
    );
}

// Function that will assign stars given the amount of attempts made for a multiple choice quiz
function giveStarsMult(count) {
    // Clear any prior messages
    $("#suggestionsArea")[0].innerHTML = "";
    // Switch that will add the appropriate star rating
    switch (count){
        case 1: // One attempt
        case 2: // Two attempts
            // Three stars if one or two attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            //show answer is correct
            $("#result")[0].innerHTML ="Correct!";
            // Return 3 stars
            return 3;
        case 3: // Three attempts
        case 4: // Three attempts
            // Two stars if three or four attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            //show answer is correct
            $("#result")[0].innerHTML ="Correct!";
            // Return 2 stars
            return 2;
        default: // Other number of attempts
            // One star for more than four attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span></h1>";
            //show answer is correct
            $("#result")[0].innerHTML ="Correct!";
            // Return 1 star
            return 1;
    }
}

// Function that will assign stars given the amount of attempts made for a term assignment
function giveStarsTerm(count) {
    // Clear any prior messages
    $("#suggestionsArea")[0].innerHTML = "";
    // Switch that will add the appropriate star rating
    switch (count){
        case 1: // One attempt
        case 2: // Two attempts
            // Three stars if one or two attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Return 3 stars
            return 3;
        case 3: // Three attempts
        case 4: // Three attempts
            // Two stars if three or four attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Return 2 stars
            return 2;
        default: // Other number of attempts
            // One star for more than four attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Return 1 star
            return 1;
    }
}

// Function that will output initial prompt
function prompt(term) {
    term.write("\r\n\x1B[1;34mstudent@tux4starters\x1B[0m:" + currWd + "$ ");
}

// Function that will print a prompt. Also overwritten later.
// Seems that JS doesn't need some sort of "override" thing declared.
// This is too easy i guess.
function termInstr(term) {}

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
        term.write("\r\n\x1B[1;34mstudent@tux4starters\x1B[0m:" + currWd + "$ ");
    };

    // Print welcome message
    term.writeln("\x1B[1;33mTux For Starters\x1B[0m\r\n");

    // Print instructions
    termInstr(term);

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
