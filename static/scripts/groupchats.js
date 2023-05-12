

function appendGroupChatSender(sender,chat,ts){
    let div = document.createElement("div")
    div.className = "outgoing_msg"
    let lines = chat.split("\n")
    let paragraphString = ""

    lines.forEach((line)=>{
        paragraphString = paragraphString + `${line}<br>`
    })

    //remove last br
    paragraphString = paragraphString.slice(0, -4)

    paragraphString = "<p>" + paragraphString + "</p>"

    div.innerHTML = `
    <div class="sent_msg">
        <p>${paragraphString}</p>
        <span class="time_date"> ${ts}</span>
    </div>
    `
    groupMsgHistory.appendChild(div)
}

function appendGroupChatReceiver(sender,chat,ts){
    let div = document.createElement("div")
    div.className = "incoming_msg"
    let lines = chat.split("\n")
    let paragraphString = ""

    lines.forEach((line)=>{
        paragraphString = paragraphString + `${line}<br>`
    })

    //remove last br
    paragraphString = paragraphString.slice(0, -4)

    paragraphString = "<p>" + paragraphString + "</p>"
    div.innerHTML = `
    <div class="incoming_msg_img"> <img src=${profilePic} alt="sunil"> </div>
    <div class="received_msg">
        <div class="received_withd_msg">
            <p>User <b>${sender}</b></p>
            <p>${paragraphString}</p>
            <span class="time_date"> ${ts}</span>
        </div>
    </div>
    `
    groupMsgHistory.appendChild(div)
}

chatGroupSubmit.addEventListener("click", (e)=>{
    let data = {};
    data.sender = clientUsername;
    data.message = chatGroupInput.value;
    data.groupname = chatGroupSubmit.submitter;

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

    chatGroupInput.value = ""
    chatGroupInput.focus()

    let url = '/group/chat/add'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: data
        })
    }).then(
        (res) => {
            return res.json();
    }).then((res)=>{
        if(res.status == "Accepted"){
            socket.emit("groupMessage",data)
            appendGroupChatSender(data.sender,data.message,data.ts)
            groupMsgHistory.scrollTop = groupMsgHistory.scrollHeight
        }
    })
})

fetchGroupChats = (groupname) => {
    let url = '/group/getmessages'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            groupname: groupname
        })
    }).then(
        (res) => {
            return res.json();
    }).then((res)=>{

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/group/getimages", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            groupname: groupname
        }));

        xhr.onload = function(){
            let images = JSON.parse(xhr.response)
            let combinedData = res.result

            if(images.result.length > 0){
                combinedData = combinedData.concat(images.result)
            }

            combinedData.sort((a,b)=>{
                return compareTs(a,b)
            })

            combinedData.forEach((chat)=>{
                if(chat.SENDER == clientUsername){
                    if(chat.CHAT===undefined)
                        appendGroupImageSender(chat.SENDER,chat.IMAGE,chat.TS)
                    else
                        appendGroupChatSender(chat.SENDER,chat.CHAT,chat.TS)
                }else{
                    if(chat.CHAT===undefined)
                        appendGroupImageReceiver(chat.SENDER,chat.IMAGE,chat.TS)
                    else
                        appendGroupChatReceiver(chat.SENDER,chat.CHAT,chat.TS)
                }})

                groupMsgHistory.scrollTop = groupMsgHistory.scrollHeight

                removeLeaveButton()
                addLeaveButton()
        
                if(chatGroupSubmit.role =="ADMIN"){
                    addButton()
                    addUserListButton()
                }

                else{
                    removeButton()
                    removeUserListButton()
                }

            }

        // res.result.sort((a,b)=>{
        //     return compareTs(a,b)
        // })
        
        // res.result.forEach((chat)=>{
        //     if(chat.SENDER == clientUsername){
        //         appendGroupChatSender(chat.SENDER,chat.CHAT,chat.TS)
        //     }else{
        //         appendGroupChatReceiver(chat.SENDER,chat.CHAT,chat.TS)
        //     }
        //     groupMsgHistory.scrollTop = groupMsgHistory.scrollHeight
        // })

    })
}

chatGroupInput.addEventListener("keyup", (e)=>{
    if(e.key == "Enter"){
        chatGroupSubmit.click()
    }
})

chatGroupInput.addEventListener("keypress", (e)=>{
    socket.emit("groupTyping",{groupname: chatGroupSubmit.submitter, sender: clientUsername})
})
