/*
    Tux For Starters - Demonstration prototype code
    Authored by Joaquin under GPLv3
*/

// INTENDED FOR EARLIER DEMO. DISREGARD THIS FOR NOW.
// No-refresh patch for form
// If "?#" is not present in the URL
// if(!(/\?#$/.exec(window.location.href))) {
//     // Make sure that gets added to the href
//     window.location.href = window.location.href + "?#";
// }

// Command buffer
var cmdBuff = ""

// Main Regular Expression
var mainRegEx = /^\s*curl\s+(((-s)|(--silent))\s+)?((("|')(http(s)?:\/\/)?(www\.)?example\.com\/?("|'))|((http(s)?:\/\/)?(www\.)?example\.com\/?))\s+\|\s+grep\s+((("|')<?\/?h1>?("|'))|(\/?h1))\s*$/;

// Specific expressions
// First command and parameter
var cmd1RegEx = /^\s*curl/;
var param1RegEx = /\s+((-s)|(--silent))/;
// Site regular expression
var siteRegEx = /\s+((("|')(http(s)?:\/\/)?(www\.)?example\.com\/?("|'))|((http(s)?:\/\/)?(www\.)?example\.com\/?))/;
// Pipe check
var pipeRegEx = /\|/;
// Second command and parameter
var cmd2RegEx = /grep\s*/;
var param2RegEx = /\s+((("|')<?\/?h1>?("|'))|(\/?h1))\s*$/;

// Attempt counter to determine when to provide hints; default to 1 for first attempt
var attemptCount = 1;

// Check function
function demoOneExec(cmdIn) {
    // If command entered is empty
    if (cmdIn == "") {
        // Return no string
        return "";
    }

    // Clear any prior messages
    $("#suggestionsArea").innerHTML = "";
    
    // If the main regular expression is satistfied, then it is correct
    if (mainRegEx.exec(cmdIn)) {
        // If silent flag is declared
        if (param1RegEx.exec(cmdIn)) {
            // Output the header and congratulate
            $("#suggestionsArea").innerHTML = "You got it! Congrats!<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            return "\r\n<h1>Header One</h1>";
        } else {
            // Otherwise, set output with "bytes received" from curl and leave a hint for next time
            $("#suggestionsArea").innerHTML = "You got the header! We can improve this command further to remove the \"Bytes received\" line.";
            // If attempt is 3 or over
            if (attemptCount >= 3) {
                // Add hint
                $("#suggestionsArea").innerHTML += "<br/><br/>Try using the <code>--silent</code> flag for <code>curl</code> to get rid of that.";
            } else {
                // Otherwise increment attempt counter
                attemptCount++;
            }
            // Append star rating
            $("#suggestionsArea").innerHTML += "<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Print result
            return "\r\nBytes received: 94\r\n<h1>Header One</h1>";
        }
    // If not right
    } else {
        // If first or second command is not present
        if (!cmd1RegEx.exec(cmdIn)) {
            // Treat it as an unknown command
            outputErrStr = "\r\nUnknown command "
            // For loop that will add the invalid command to the output
            for (var i = 0; i < cmdIn.length; i++) {
                // We just output the first part of the input, so break if theres a space
                if (cmdIn[i] === " ") {
                    break;
                }
                // Add the char in to the output
                outputErrStr += cmdIn[i];
            }
            // Suggest that the command is not valid
            $("#suggestionsArea").innerHTML = "Hmm... It appears that this command is not valid.<br/><br/>Make sure you are using the commands from the lesson. In this case, <code>curl</code> and <code>grep</code>.";
            // If attempt counter less than 3
            if (attemptCount < 3) {
                // Increment attempt counter
                attemptCount++;
            }
            // Print result
            return outputErrStr;
        // If only "curl" is provided
        } else if (/^\s*curl\s*(((-)|(--))([A-Z]|[a-z])*)*\s*$/.exec(cmdIn)) {
            // Suggest the user to give curl a URL
            $("#suggestionsArea").innerHTML = "Looks like you ran <code>curl</code> but have not provided a URL for it to use.";
            // If attempt counter is 3 or over
            if (attemptCount >= 3) {
                // Add hint
                $("#suggestionsArea").innerHTML += "<br/><br/>Give the command the <code>example.com</code> URL.";
            } else {
                // Otherwise increment attempt counter
                attemptCount++;
            }
            // Print curl usage
            return "\r\nUsage: curl [options...] <url>";
        // If curl is provided with an invalid site link
        } else if (!siteRegEx.exec(cmdIn)) {
            // Treat it as an unknown website
            outputErrStr = "\r\nCould not resolve host: ";
            // Boolean flag that will indicate whether we already crossed "curl" (indicated by a space) through the loop
            var passedSpaceChk = false
            // For loop that will add the invalid command to the output
            for (var i = 0; i < cmdIn.length; i++) {
                // If a parameter is spotted
                if ((cmdIn[i] == "-")) {
                    // Reset space check
                    passedSpaceChk = false;
                // Break if we finished printing the url
                } else if ((cmdIn[i] == " ") && passedSpaceChk) {
                    break;
                // Else if passed space chk isnt marked yet after a space
                } else if (cmdIn[i] == " ") {
                    // Do so now
                    passedSpaceChk = true;
                }
                // If passed space chk is marked
                if (passedSpaceChk) {
                    // If not a space
                    if (!(cmdIn[i] == " ")) {
                        // Store character
                        outputErrStr += cmdIn[i];
                    }
                }                
            }
            // Ask the user that the URL is invalid
            $("#suggestionsArea").innerHTML = "The <code>curl</code> program couldn't connect to that website.";
            // If attempt counter is 3 or over
            if (attemptCount >= 3) {
                // Append hint
                $("#suggestionsArea").innerHTML += "<br/><br/>Use the <code>example.com</code> website instead.";
            } else {
                // Else increment counter
                attemptCount++;
            }
            // Print result
            return outputErrStr;
        // If no pipe nor grep command is present
        } else if (!pipeRegEx.exec(cmdIn) && !cmd2RegEx.exec(cmdIn)) {
            // Set the whole HTML contents
            outputErrStr = "\r\n<html>\r\n<head>\r\n<title>Example</title>\r\n</head>\r\n<body>\r\n<h1>Header One</h1>\r\n</body>\r\n</html>";
            // If the first parameter is not provided
            if (!param1RegEx.exec(cmdIn)) {
                // Add in the "bytes received" bit to the output
                outputErrStr = "Bytes received: 94\r\n" + outputErrStr;
            }
            // Provide suggestion
            $("#suggestionsArea").innerHTML = "Welp, you got the whole site markup but we only need the header.";
            // If attempt counter is 3 or over
            if (attemptCount >= 3) {
                // Append hint
                $("#suggestionsArea").innerHTML += "<br/><br/>We just have to select the line containing \"Header One\", which is wrapped within the <code>h1</code> tag.";
            } else {
                // Else increment counter
                attemptCount++;
            }
            // Append star rating
            $("#suggestionsArea").innerHTML += "<h1><span class=\"glyphicon glyphicon-star\"></span></h1>";
            // Print result
            return outputErrStr;
        // If pipe is present but second command is not correct
        } else if (pipeRegEx.exec(cmdIn) && !cmd2RegEx.exec(cmdIn)) {
            // Suggest that the piper command is not valid
            $("#suggestionsArea").innerHTML = "Hmm... It appears that the command that will handle the piped output is not valid.";
            // If attempt counter is 3 or over
            if (attemptCount >= 3) {
                // Append hint
                $("#suggestionsArea").innerHTML += "<br/><br/>Make sure you are using the commands from the lesson. In this case, <code>curl</code> and <code>grep</code>.";
            } else {
                // Else increment counter
                attemptCount++;
            }
            // Treat it as an unknown command
            return "\r\nUnknown command " + cmdIn.substring(cmdIn.indexOf("|") + 1).replace(/\s/g,"");
        // If grep and pipe are present but no correct match parameter is given
        } else if ((pipeRegEx.exec(cmdIn) && cmd2RegEx.exec(cmdIn)) && !param2RegEx.exec(cmdIn)) {
            // If tag in angle brackets without quotation marks
            if (/(([^"]*<+.*>*[^"]*)|([^']*<+.*>*[^']*)|([^"]*<*.*>+[^"]*)|([^']*<*.*>+[^']*))/.exec(cmdIn)) {
                // Provide suggestion
                $("#suggestionsArea").innerHTML = "Bare angle brackets are mistaken by the terminal as output redirect.";
                // If attempt counter is 3 or over
                if (attemptCount >= 3) {
                    // Append hint
                    $("#suggestionsArea").innerHTML += "<br/><br/>Make sure the <code>h1</code> tag is wrapped in quotation marks.";
                } else {
                    // Else increment counter
                    attemptCount++;
                }
                // State redirect error
                return "\r\nAn error occurred while redirecting file";
            // If a match parameter other than h1 is provided
            } else if (!(/grep\s*$/.exec(cmdIn))) {
                // State issue
                $("#suggestionsArea").innerHTML = "Looks like this lesson is expecting to match a certain tag.";
                // If attempt counter is 3 or over
                if (attemptCount >= 3) {
                    // Append hint
                    $("#suggestionsArea").innerHTML += "<br/><br/>We only have to match <code>h1</code>.";
                } else {
                    // Else increment counter
                    attemptCount++;
                }
                // Print error
                return "\r\nLesson error: Incorrect match case " + cmdIn.substring(cmdIn.indexOf("grep") + 4).replace(/\s/g,"");
            // If nothing was provided
            } else {
                // Provide what happened
                $("#suggestionsArea").innerHTML = "Almost there! You need to make sure you match the heading tag.";
                // If attempt counter is 3 or over
                if (attemptCount >= 3) {
                    // Append hint
                    $("#suggestionsArea").innerHTML += "<br/><br/>The line we are looking for is in a <code>h1</code> tag.";
                } else {
                    // Else increment counter
                    attemptCount++;
                }
                // State grep usage
                return "\r\nUsage: grep [OPTION]... PATTERNS [FILE]...\r\nFailed writing body";
            }
        // Otherwise if an unknown error occurs
        } else {
            // State that it's an unknown command and that something unexpected had occurred
            $("#suggestionsArea").innerHTML = "Hmm... It appears that something wrong has occurred.<br/><br/>Check to see if you formatted your command correctly.";
            // If attempt counter less than 3
            if (attemptCount < 3) {
                // Increment attempt counter
                attemptCount++;
            }
            // Return error
            return "\r\nUnknown command";
        }
    }
}


// Prototype Xterm code begins here

// Function that will output initial prompt
function prompt(term) {
    term.write("\r\nlesson1@tux4starters $ ");
}
// Core xterm code
function xTermDemo() {
    // If terminal is already initialized
    if (term._initialized) {
        // No need to do anything else
        return;
    }

    // Set terminal initialize state to true
    term._initialized = true;

    // Set terminal prompt
    term.prompt = () => {
        term.write("\r\nlesson1@tux4starters $ ");
    };

    // Print welcome message
    term.writeln("Tux For Starters");
    // term.writeln("This is a local terminal emulation, without a real terminal in the back-end.");
    // term.writeln("Type some keys and commands to play around.");
    // term.writeln("");

    // Print out prompt
    prompt(term);

    // Set on data listener
    term.onData(e => {
        // Switch statement that will check output
        switch (e) {
            case "\r": // Enter key
                // Send current command buffer to exec code and write output
                term.write(demoOneExec(cmdBuff));
                // Continue to next case for prompt; no break
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
                // Add character to buffer and write to terminal
                cmdBuff += e;
                term.write(e);
        }
    });
}
