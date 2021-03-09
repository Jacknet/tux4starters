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

/*
    Below is vital code to get stuff working properly.
*/

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
        term.write("\r\n\x1B[1;34mlesson1@tux4starters\x1B[0m:" + currWd + "$ ");
    };

    // Print welcome message
    term.writeln("\x1B[1;33mTux For Starters\x1B[0m\r\n");

    // Print instructions
    termInstr()

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
// Launch the session now
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
        term.write("\r\n\x1B[1;34mlesson1@tux4starters\x1B[0m $ ");
    };

    // Print welcome message
    term.writeln("\x1B[1;33mTux For Starters\x1B[0m");
    // Print out prompt
    prompt(term);

    // Set on data listener
    term.onData(e => {
        // If not solved
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
