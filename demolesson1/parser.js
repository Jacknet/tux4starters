/*
    Tux For Starters - Demonstration prototype code
    Authored by Joaquin under GPLv3
*/

// No-refresh patch for form
// If "?#" is not present in the URL
if(!(/\?#$/.exec(window.location.href))) {
    // Make sure that gets added to the href
    window.location.href = window.location.href + '?#';
}

// Main Regular Expression
var mainRegEx = /^\s*curl\s+(((-s)|(--silent))\s+)?((("|')(http(s)?:\/\/)?(www\.)?example\.com\/?("|'))|((http(s)?:\/\/)?(www\.)?example\.com\/?))\s+\|\s+grep\s+("|')?<?\/?h1>?("|')?\s*$/;

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
var param2RegEx = /("|')?<?\/?h1>?("|')?\s*$/;

// Check function
function demoOneExec(cmdIn) {
    // Clear any prior messages
    document.getElementById('suggestionsArea').innerHTML = "";
    
    // If the main regular expression is satistfied, then it is correct
    if (mainRegEx.exec(cmdIn)) {
        // If silent flag is declared
        if (param1RegEx.exec(cmdIn)) {
            // Set the header markup output and congratulate
            document.getElementById('outCmdArea').innerHTML = "<h1>Header One</h1>";
            document.getElementById('suggestionsArea').innerHTML = "You got it! Congrats!<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
        } else {
            // Otherwise, set output with "bytes received" from curl and leave a hint for next time
            document.getElementById('outCmdArea').innerHTML = "Bytes received: 94\n<h1>Header One</h1>";
            document.getElementById('suggestionsArea').innerHTML = "You got the header! We can improve this command further to remove the \"Bytes received\" line.<br/><br/>Try using the <code>--silent</code> flag to get rid of that.<h1><span class=\"glyphicon glyphicon-star\"></span> <span class=\"glyphicon glyphicon-star\"></span></h1>";
        }
    // If not right
    } else {
        // If first or second command is not present
        if (!cmd1RegEx.exec(cmdIn)) {
            // Treat it as an unknown command
            document.getElementById('outCmdArea').innerHTML = "Unknown command "
            // For loop that will add the invalid command to the output
            for (var i = 0; i < cmdIn.length; i++) {
                // We just output the first part of the input, so break if theres a space
                if (cmdIn[i] === " ") {
                    break;
                }
                // Add the char in to the output
                document.getElementById('outCmdArea').innerHTML += cmdIn[i];
            }
            // Suggest that the command is not valid
            document.getElementById('suggestionsArea').innerHTML = "Hmm... It appears that this command is not valid.<br/><br/>Make sure you are using the commands from the lesson.";
        // If only "curl" is provided
        } else if (/^\s*curl\s*(((-)|(--))([A-Z]|[a-z])*)*\s*$/.exec(cmdIn)) {
            // Print curl usage
            document.getElementById('outCmdArea').innerHTML = "Usage: curl [options...] <url>";
            // Suggest the user to give curl a URL
            document.getElementById('suggestionsArea').innerHTML = "Looks like you ran <code>curl</code> but have not provided a URL for it to use.<br/><br/>Try giving it the URL that is stated in the prompt.";
        // If curl is provided with an invalid site link
        } else if (!siteRegEx.exec(cmdIn)) {
            // Treat it as an unknown website
            document.getElementById('outCmdArea').innerHTML = "Could not resolve host: ";
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
                        // Print character
                        document.getElementById('outCmdArea').innerHTML += cmdIn[i];
                    }
                }                
            }
            // Ask the user that the URL is invalid
            document.getElementById('suggestionsArea').innerHTML = "The <code>curl</code> program couldn't connect to that website.<br/><br/>Try using <code>example.com</code> instead.";
        // If no pipe nor grep command is present
        } else if (!pipeRegEx.exec(cmdIn) && !cmd2RegEx.exec(cmdIn)) {
            // Set the whole HTML contents
            document.getElementById('outCmdArea').innerHTML = "<html>\n<head>\n<title>Example</title>\n</head>\n<body>\n<h1>Header One</h1>\n</body>\n</html>";
            // If the first parameter is not provided
            if (!param1RegEx.exec(cmdIn)) {
                // Add in the "bytes received" bit to the output
                document.getElementById('outCmdArea').innerHTML = "Bytes received: 94\n" + document.getElementById('outCmdArea').innerHTML;
            }
            // Provide suggestion
            document.getElementById('suggestionsArea').innerHTML = "Welp, you got the whole site markup but we only need the header.<br/><br/>We just have to select the line containing \"Header One\", which is wrapped within the <code>h1</code> tag.<h1><span class=\"glyphicon glyphicon-star\"></span></h1>";
        // If pipe is present but second command is not correct
        } else if (pipeRegEx.exec(cmdIn) && !cmd2RegEx.exec(cmdIn)) {
            // Treat it as an unknown command
            document.getElementById('outCmdArea').innerHTML = "Unknown command " + cmdIn.substring(cmdIn.indexOf("|") + 1).replace(/\s/g,'');
            // Suggest that the piper command is not valid
            document.getElementById('suggestionsArea').innerHTML = "Hmm... It appears that the command that will handle the piped output is not valid.<br/><br/>Make sure you are using the commands from the lesson.";   
        // If grep and pipe are present but no match parameter is given
        } else if ((pipeRegEx.exec(cmdIn) && cmd2RegEx.exec(cmdIn)) && !param2RegEx.exec(cmdIn)) {
            // State grep usage
            document.getElementById('outCmdArea').innerHTML = "Usage: grep [OPTION]... PATTERNS [FILE]...\nFailed writing body";
            // Provide hint
            document.getElementById('suggestionsArea').innerHTML = "Almost there! You need to make sure you match the heading tag.<br/><br/>The text we are looking for is in a <code>h1</code> tag.";
        // Otherwise if an unknown error occurs
        } else {
            // State that it's an unknown command and that something unexpected had occurred
            document.getElementById('outCmdArea').innerHTML = "Unknown command";
            document.getElementById('suggestionsArea').innerHTML = "Hmm... It appears that something wrong has occurred.<br/><br/>Check to see if you formatted your command correctly.";
        }
    }
}
