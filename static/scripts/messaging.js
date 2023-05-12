String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function compareTs(a, b) {
  //ts of format dd/mm/yyyy @ hh:mm:ss
  let aDate = a.TS.split(" @ ")[0];
  let bDate = b.TS.split(" @ ")[0];
  let aTime = a.TS.split(" @ ")[1];
  let bTime = b.TS.split(" @ ")[1];

  let aDateArr = aDate.split("/");
  let bDateArr = bDate.split("/");
  let aTimeArr = aTime.split(":");
  let bTimeArr = bTime.split(":");

  let aDateObj = new Date(
    aDateArr[2],aDateArr[1],aDateArr[0],aTimeArr[0],aTimeArr[1],aTimeArr[2]
  );
  let bDateObj = new Date(
    bDateArr[2],bDateArr[1],bDateArr[0],bTimeArr[0],bTimeArr[1],bTimeArr[2]
  );

  if (aDateObj > bDateObj) {
    return 1;
  }
  if (aDateObj < bDateObj) {
    return -1;
  }
  return 0;
}

function appendChatSender(chat,ts=""){
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
    msgHistory.appendChild(div)
}

function appendChatReceiver(chat,ts=""){
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
            <p>${paragraphString}</p>
            <span class="time_date"> ${ts}</span>
        </div>
    </div>
    `
    msgHistory.appendChild(div)
}

chatSubmit.addEventListener("click", (e) => {
  console.log(chatSubmit.submitter);
  console.log(clientUsername);
  e.preventDefault();
  let data = {};
  data.sender = clientUsername;
  data.receiver = chatSubmit.submitter;
  data.message = chatInput.value
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

  console.log(data.ts)

  data.hash = data.sender.hashCode() + data.receiver.hashCode();

  fetch(`/personal/contacts/sendmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.status == "Accepted") {
        appendChatSender(chatInput.value,data.ts)
        socket.emit("chatMessage", data);
        chatInput.value = ""
        msgHistory.scrollTop = msgHistory.scrollHeight
      }
    });
});

function fetchChats(user){
    let data = {}
    data.sender = clientUsername
    data.receiver = user

    data.hash = data.sender.hashCode() + data.receiver.hashCode()
    fetch(`/personal/contacts/getmessages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((res)=>{
        return res.json()
    })
    .then((res)=>{

        let xhr = new XMLHttpRequest()
        xhr.open("POST","/personal/getPersonalImages",true)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data))

        xhr.onload = ()=>{
            let img = JSON.parse(xhr.response)
            console.log(img)

            let combinedData = res.result
            if(img.status=="Accepted")
              combinedData = combinedData.concat(img.result)

            combinedData.sort((a,b)=>{
                return compareTs(a,b)
            })

            combinedData.forEach((chat)=>{
                if(chat.SENDER == clientUsername){
                    if(chat.CHAT===undefined)
                        appendImageSender(chat.IMAGE,chat.TS)
                    else
                        appendChatSender(chat.CHAT,chat.TS)
                }else{
                    if(chat.CHAT===undefined)
                        appendImageReceiver(chat.IMAGE,chat.TS)
                    else
                        appendChatReceiver(chat.CHAT,chat.TS)
                }
                msgHistory.scrollTop = msgHistory.scrollHeight
            })
        }
        // if(res.status == "Accepted"){

        //     res.result.sort((a,b)=>{
        //         return compareTs(a,b)
        //     })

        //     res.result.forEach((chat)=>{
        //         if(chat.SENDER == clientUsername){
        //             appendChatSender(chat.CHAT,chat.TS)
        //         }else{
        //             appendChatReceiver(chat.CHAT,chat.TS)
        //         }
        //         msgHistory.scrollTop = msgHistory.scrollHeight
        //     })
        // }
    })

}

chatInput.addEventListener("keyup", (e) => {
  if(e.keyCode == 13){
    chatSubmit.click()
  }
})

chatInput.addEventListener("keypress", (e) => {
  socket.emit("personalTyping",{receiver:chatSubmit.submitter,sender:clientUsername})
})