// Main Regular Expression
var mainRegEx = /^\s*curl\s+(((-s)|(--silent))\s+)?((("|')(http(s)?:\/\/)?(www\.)?example\.com\/?("|'))|((http(s)?:\/\/)?(www\.)?example\.com\/?))\s+\|\s+grep\s+("|')h1("|')\s*$/;

// Specific expressions
// First command and parameter
var cmd1RegEx = /curl\s+/;
var param1RegEx = /((-s)|(--silent))/;
// Site regular expression
var siteRegEx = /((("|')(http(s)?:\/\/)?(www\.)?example\.com\/?("|'))|((http(s)?:\/\/)?(www\.)?example\.com\/?))/;
// Pipe check
var pipeRegEx = /\|/;
// Second command and parameter
var cmd2RegEx = /grep\s+/;
var param2RegEx = /("|')h1("|')/;

function checkTest(cmdIn) {
    // Clear any prior messages
    document.getElementById('suggestionsArea').innerHTML = "";
    
    // If the main regular expression is satistfied, then it is correct
    if (mainRegEx.exec(cmdIn)) {
        // If silent flag is declared
        if (param1RegEx.exec(cmdIn)) {
            // Set the header markup output and congratulate
            document.getElementById('outCmdArea').innerHTML = "<h1>Header One</h1>";
            document.getElementById('suggestionsArea').innerHTML = "You got it! Congrats!";
        } else {
            // Otherwise, set output with "bytes received" from curl and leave a hint for next time
            document.getElementById('outCmdArea').innerHTML = "Bytes received: 1024\n<h1>Header One</h1>";
            document.getElementById('suggestionsArea').innerHTML = "Nice job!<br/><br/>Hint: Try using the <code>--silent</code> flag to get rid of the \"Bytes received\" part.";
        }
    // If not right
    } else {
        // If first command is not set
        if (!cmd1RegEx.exec(cmdIn)) {
            // Treat it as an unknown command
            document.getElementById('outCmdArea').innerHTML = "Unknown command ";
            // For loop that will add the invalid command
            for (var i = 0; i < cmdIn.length; i++) {
                // We just output the first part of the input, so break if theres a space
                if (cmdIn[i] === " ") {
                    break;
                }
                // Add the char in to the output
                document.getElementById('outCmdArea').innerHTML += cmdIn[i];
            }
            // Suggest that the command is not valid
            document.getElementById('suggestionsArea').innerHTML = "Hmm... It appears that the command is not valid.";
        // If no pipe is present
        } else if (!pipeRegEx.exec(cmdIn)) {
            // Set the whole HTML contents
            document.getElementById('outCmdArea').innerHTML = "<html>\n<head>\n<title>Example</title>\n</head>\n<body>\n<h1>Header One</h1>\n</body>\n</html>";
            document.getElementById('suggestionsArea').innerHTML = "Welp, you got the whole site code but we only need the header.";
        } else {
            // TODO: Work on the other stuff later
            document.getElementById('outCmdArea').innerHTML = "Oops!";
        }
    }
}
