const personalImageInput = document.getElementById('personalImageInput');
const personalImageSubmit = document.getElementById('personalImageSubmit');

function appendImageSender(image,ts=""){
    let div = document.createElement("div")
    div.className = "outgoing_msg"

    div.innerHTML = `
    <div class="sent_msg">
        <img src=${image} width="200" height="200"/>
        <span class="time_date"> ${ts}</span>
    </div>
    `
    msgHistory.appendChild(div)
}

function appendImageReceiver(image,ts=""){
    let div = document.createElement("div")
    div.className = "incoming_msg"
    div.innerHTML = `
    <div class="incoming_msg_img"> <img src=${profilePic} alt="sunil"> </div>
    <div class="received_msg">
        <div class="received_withd_msg">
            <img src=${image} height="200" width="200"/>
            <span class="time_date"> ${ts}</span>
        </div>
    </div>
    `
    msgHistory.appendChild(div)
}

personalImageSubmit.addEventListener('click', () => {
    let data = {}
    data.sender = clientUsername;
    data.receiver = chatSubmit.submitter;

    let currentdate = new Date();

    data.ts =
    currentdate.getDate() +
    "/" +
    currentdate.getMonth() +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

    data.id = data.sender.hashCode() + data.receiver.hashCode();

    let file = personalImageInput.files[0];

    let reader = new FileReader();

    reader.onload = function (e) {
        data.image = e.target.result;


        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/personal/image", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

        appendImageSender(e.target.result, data.ts)
        socket.emit("personalImage", data)
        msgHistory.scrollTop = msgHistory.scrollHeight
    }

    reader.readAsDataURL(file);
})


