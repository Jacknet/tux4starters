var acc = document.querySelectorAll("less-acc, par-acc");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function(){
        this.classList.toggle('active');
        var panel= this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            }
            else {
                panel.style.display = "block";
            }
    });


    acc[i].onkeypress = function(key) {
        if (key.keyCode == 0 || key.keycode == 32) {
            this.classList.toggle("active");
            var panel= this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            }
            else {
                panel.style.display = "block";
            }
        }
    }
    
}