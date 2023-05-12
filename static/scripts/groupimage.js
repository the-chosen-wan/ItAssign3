const groupImageInput = document.getElementById('groupImageInput');
const groupImageSubmit = document.getElementById('groupImageSubmit');

function appendGroupImageSender(sender,image,ts){
    let div = document.createElement("div")
    div.className = "outgoing_msg"

    div.innerHTML = `
    <div class="sent_msg">
        <img src=${image} width="200" height="200"/>
        <span class="time_date"> ${ts}</span>
    </div>
    `
    groupMsgHistory.appendChild(div)
}

function appendGroupImageReceiver(sender,image,ts){
    let div = document.createElement("div")
    div.className = "incoming_msg"
    div.innerHTML = `
    <br>
    <div class="incoming_msg_img"> <img src=${profilePic} alt="sunil"> </div>
    <div class="received_msg" width="200'>
        <div class="received_withd_msg">
            <p>User <b>${sender}</b></p>
            <img src=${image} width="200" height="200"/>
            <span class="time_date"> ${ts}</span>
        </div>
    </div>
    `
    groupMsgHistory.appendChild(div)
}


groupImageSubmit.addEventListener('click', () => {
    let file = groupImageInput.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        let data = {};
        data.sender = clientUsername;
        data.groupname = chatGroupSubmit.submitter;

        let currentdate = new Date();

        data.ts =
            currentdate.getDate() +
            '/' +
            currentdate.getMonth() +
            '/' +
            currentdate.getFullYear() +
            ' @ ' +
            currentdate.getHours() +
            ':' +
            currentdate.getMinutes() +
            ':' +
            currentdate.getSeconds();
        data.image = e.target.result;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/group/insertImage', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        appendGroupImageSender(data.sender, e.target.result, data.ts);
        groupMsgHistory.scrollTop = groupMsgHistory.scrollHeight
        socket.emit('groupImage', data);
    }

    reader.readAsDataURL(file);
})
