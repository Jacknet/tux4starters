/*
    Tux For Starters - Support Code
    Under GPLv3
*/

// Try instantiating terminal
try {
    // Instantiate new terminal variable
    var term = new Terminal();
} catch (e) {
    // Log that terminal did not load, possibly due to being in a page without terminal.
    console.log("Terminal simulation not loaded (" + e + ")");
}

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

// Function that will append star rating to accordion objects.
function appendToAccordion(res) {
    // If data was received
    if (res.data) {
        // For every module
        for (moduleName in res.data) {
            // For every lesson
            for (lessonName in res.data[moduleName]) {
                
                // For each part
                for (partName in res.data[moduleName][lessonName]) {
                    // If part rating is greater than 0
                    if (res.data[moduleName][lessonName][partName] > 0) {
                        // Use yellow design color for background to completed module
                        $(
                            "#" + moduleName + " ." + lessonName + " ." + partName
                        )[0].style.backgroundColor = "#F9DC5C";

                        // Append X amount of stars to lesson name given the data
                        $(
                            "#" + moduleName + " ." + lessonName + " ." + partName
                        )[0].innerHTML += " " + "<span class=\"glyphicon glyphicon-star\"></span>".repeat(
                            res.data[moduleName][lessonName][partName]
                        );
                    }
                }
            }
        }
    }
}

// Function that stores a given session ID to the client after successful log-on.
function signIn(sessionId) {
    // Store session ID as a cookie
    document.cookie = "sessid=" + sessionId + ";SameSite=Strict";
    // Refresh client, sending back to the homepage
    window.location.href = "/"
}
// Function that devalidates the current client session.
// User must log in again and obtain a new session ID.
function signOut() {
    // Blank session ID cookie and make it expire immediately (Midnight 01/01/1970 is 0 in UNIX time!)
    document.cookie = "sessid=;expires=Thu, 01 Jan 1970";
    // Refresh client, sending back to the homepage
    window.location.href = "/"
}

// Code that will run on page ready to check session ID
$(document).ready(
    function() {
        /*
            A session token is stored as a cookie, which identifies a logged on user with the back-end.

            Check for the cookie and that the server has the token logged on in the database.
            If its active, then just store the token in a variable for POSTing and change the "sign in" text to say "sign out", otherwise clear the cookie.
            Have it cleared when clicking sign out.
            Have code that checks if you are in the sign in page or register page to clear session!
            
            Upon sign-out, reload the page!
        */

        // Cookie name is "sessid"
        var cookieName = "sessid=";
        // Split each cookie into an array
        var cookieArray = decodeURIComponent(document.cookie).split(';');
        // For each cookie
        for(var i = 0; i < cookieArray.length; i++) {
            // Get current cookie to check
            var cookie = cookieArray[i];
            // For any spaces preceeding the cookie string
            while (cookie.charAt(0) == ' ') {
                // Remove it
                cookie = cookie.substring(1);
            }
            // If cookie is found by name
            if (cookie.indexOf(cookieName) == 0) {
                // If cookie has content
                if (cookie.split("=")[1]) {
                    // Get "Sign In" button from navbar
                    var sessionBtn = document.getElementById("sessionBtn");

                    // Disable link
                    sessionBtn.innerText = "Checking...";
                    sessionBtn.href = "#";

                    // Post to server if session is valid in the database
                    axios.post('/check-session', {
                        "sessionId": cookie.split("=")[1]
                    }).then(function(res) {
                        // If server responded "OK"
                        if (res.data == "OK") {
                            // Store cookie value to global sessionId variable
                            sessionId = cookie.split("=")[1];
                            // Replace text with "Sign Out" and enable button for log off
                            sessionBtn.innerText = "Sign Out";
                            sessionBtn.onclick = signOut;

                            // If in main lessons page ("lessons or lessons/index.html")
                            if (/^\/?lessons\/?(index\.html)?\/?$/.test(window.location.pathname)) {
                                // Check progress with server
                                axios.post('/check-progress', {
                                    "sessionId": cookie.split("=")[1]
                                }).then(function(res) {
                                    // Append data to accordion
                                    appendToAccordion(res);
                                });
                            }
                        } else {
                            // Sign out if server did not respond with "OK"
                            signOut();
                        }
                    });
                    // Break for loop
                    break;
                }
            }
        }
    }
);

// This would be overwritten by the lesson. Default term parse returns nothing.
function termParse(cmdIn) {
    // If no session ID is stored
    if (!sessionId) {
        // Send client to login page
        window.location.href = "/signin.html"
        // Return, ensuring function does not execute
        return "";
    }
    // Return no string
    return "";
}

// This default multiple choice check would also be overwritten. 
function checkMultipleChoice() {
    // If no session ID is stored
    if (!sessionId) {
        // Send client to login page
        window.location.href = "/signin.html"
        // Return, ensuring function does not execute
        return "";
    }
}

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
    $.post("/post",
        {
            "multStarRating": result,
            "termStarRating": "",
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
    $.post("/post",
        {
            "multStarRating": "",
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
            // Three stars if one attempt
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            //show answer is correct
            $("#result")[0].innerHTML ="Correct!";
            // Return 3 stars
            return 3;
        case 2: // Two attempts
            // Two stars if two attempts
            $("#suggestionsArea")[0].innerHTML = "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            //show answer is correct
            $("#result")[0].innerHTML ="Correct!";
            // Return 2 stars
            return 2;
        default: // Other number of attempts
            // One star for more than two attempts
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
        case 4: // Four attempts
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
