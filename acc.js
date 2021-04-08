// Function that will toggle accordion state
function toggleAccordion(button) {
    // Toggle button active state
    button.classList.toggle('active');

    // Get panel
    var panel = button.nextElementSibling;

    // If panel is already shown
    if (panel.style.display === "block") {
        // Put drop-down arrow facing down
        button.innerHTML = "<span class=\"glyphicon glyphicon-chevron-down\"></span> " + button.innerHTML.slice(button.innerHTML.indexOf("</span>") + 8);
        // Hide it
        panel.style.display = "none";
    }
    else {
        // Otherwise point the drop-down arrow upwards
        button.innerHTML = "<span class=\"glyphicon glyphicon-chevron-up\"></span> " + button.innerHTML.slice(button.innerHTML.indexOf("</span>") + 8);
        // Show the panel content
        panel.style.display = "block";
    }
}

// Function that will initiate the lesson accordion
function startAccordion() {
    // Get all accordion button elements with less-acc and par-acc classes
    var acc = document.querySelectorAll(".less-acc, .par-acc");

    // For each accordion button
    for (var i = 0; i < acc.length; i++) {
        // Hide any sibling elements and add drop-down arrow
        acc[i].nextElementSibling.style.display = "none";
        acc[i].innerHTML = "<span class=\"glyphicon glyphicon-chevron-down\"></span> " + acc[i].innerHTML;

        // Add a toggle click listener to the button
        acc[i].addEventListener("click", function() {
            toggleAccordion(this);
        });

        // On key press for accessible navigation
        acc[i].onkeypress = function(key) {
            // If key pressed is either space or any other non alpha-numeric character
            if (key.keyCode == 0 || key.keycode == 32) {
                // Toggle accordion
                toggleAccordion(this);
            }
        }
    }
}
