var form = document.getElementById("register-form");
var submit = document.getElementById("submit-register-form");

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
        const fileBlob = document.getElementById("profile-pic").files[0];

        let reader = new FileReader();

        if (fileBlob==undefined||["png", "jpg","jpeg","jfif"].indexOf(fileBlob.name.split('.')[1]) != -1){
            reader.onload = ()=>{
                fetch("/", {
                    method: "POST",

                    body: JSON.stringify({
                        username: form.elements["username"].value,
                        password: form.elements["password"].value,
                        fname: form.elements["fname"].value,
                        lname: form.elements["lname"].value,
                    }),

                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((res) => {
                        if (res.status == "Rejected") {
                            document.getElementById("warning").style.display = "block";
                            form.reset()
                        } else {
                            xhr = new XMLHttpRequest();
                            xhr.open("POST", `/addImage/${form.elements["username"].value}`, true);
                            xhr.send(reader.result);
                            form.reset()
                            window.location.href = "/personal";
                        }
                    });
                }

            reader.readAsDataURL(fileBlob);
        }else{
            alert("Please upload a valid image file");
        }
    }
});
