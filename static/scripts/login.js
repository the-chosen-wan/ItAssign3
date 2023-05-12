var form = document.getElementById("login-form");
var submit = document.getElementById("submit-login-form");

function checkform(form) {
    var inputs = form.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute("required")) {
            if (inputs[i].value == "") {
                alert("Please fill all required fields");
                return false;
            }
        }
    }
    return true;
}

submit.addEventListener("click", () => {
    if (checkform(form)) {
        fetch("/login", {
            method: "POST",

            body: JSON.stringify({
                username: form.elements["username"].value,
                password: form.elements["password"].value,
            }),

            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json()})
            .then((res) => {
                form.reset();
                if (res.validated == "Rejected") {
                    document.getElementById("warning").style.display = "block";
                } else {
                    window.location.href = "/personal";
                }
            });
    }
});
