const addContactName = document.getElementById("addContactName");
const submitContactName = document.getElementById("submitContactName");
const close = document.getElementsByClassName("close")[0];
const chatList = document.getElementById("chatList");
const chatInput  = document.getElementById("chatInput");
const chatSubmit = document.getElementById("chatSubmit");
const msgHistory = document.getElementById("msgHistory");
const usernameHeader = document.getElementById("usernameHeader");
const profilePic = "https://ptetutorials.com/images/user-profile.png"

var clientUsername;

function contactClicker(e,clientUsername)  {
    if(e.target.className == "chat_list"){
    msgHistory.innerHTML = ""
    let id = e.target.id
    chatSubmit.submitter = id
    chatInput.submitter = id
    e.target.className = "chat_list active_chat"
    usernameHeader.value = id
    fetchChats(id)
    }

    if(e.target.className == "chat_list active_chat"){
    let id = e.target.id
    e.target.className = "chat_list"
    }
}

function makeActive(e){
    if(e.target.className == "chat_list"){
    let id = e.target.id
    e.target.className = "chat_list active_chat"
    }
}

function makeInactive(e){
    if(e.target.className == "chat_list active_chat"){
    let id = e.target.id
    e.target.className = "chat_list"
    }
}

function parentClicker(e){
    let id = e.target.parentElement.id
    chatSubmit.submitter = id
    chatInput.submitter = id
    e.target.parentElement.className = "chat_list active_chat"
}

function parentMakeActive(e){
    let id = e.target.parentElement.id
    e.target.parentElement.className = "chat_list active_chat"
}

function parentMakeInactive(e){
    let id = e.target.parentElement.id
    e.target.parentElement.className = "chat_list"
}


fetch(`/personal/contacts/getall`, {
  method: "POST",
})
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    clientUsername = res.username
    socket.emit("connectionInit", {username: clientUsername})

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/personal/contacts/getimages", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({username:clientUsername}));


    xhr.onload = function () {
      if(xhr.readyState == 4 ) {
        images= JSON.parse(xhr.response)
        let count=0

        if(images.status=="Accepted"){

          res.result.forEach((contact) => {
            let div = document.createElement("div");
            div.className = "chat_list";
            div.innerHTML = `
                <div class="chat_people">
                            <div class="chat_img"> <img src=${images.result[count].IMAGE} alt="sunil"> </div>
                            <div class="chat_ib">
                              <h5>${contact.FNAME} ${contact.LNAME} </h5>
                              <p>${contact.TAG}</p>
                            </div>
                </div>
                `;
            div.id = contact.USERNAME
    
            div.addEventListener("click", (e)=>{
                contactClicker(e,clientUsername)
            })
    
            div.addEventListener("mouseover", (e)=>{
                makeActive(e)
            })
    
            div.addEventListener("mouseout", (e)=>{
                makeInactive(e)
            })
    
            chatList.appendChild(div);
            count+=1
        });
      }
      }
    }


    // res.result.forEach((contact) => {
    //     let div = document.createElement("div");
    //     div.className = "chat_list";
    //     div.innerHTML = `
    //         <div class="chat_people">
    //                     <div class="chat_img"> <img src=${profilePic} alt="sunil"> </div>
    //                     <div class="chat_ib">
    //                       <h5>${contact.FNAME} ${contact.LNAME} <span class="chat_date">Dec 25</span></h5>
    //                       <p>Test, which is a new approach to have all solutions 
    //                         astrology under one roof.</p>
    //                     </div>
    //         </div>
    //         `;
    //     div.id = contact.USERNAME

    //     div.addEventListener("click", (e)=>{
    //         contactClicker(e,clientUsername)
    //     })

    //     div.addEventListener("mouseover", (e)=>{
    //         makeActive(e)
    //     })

    //     div.addEventListener("mouseout", (e)=>{
    //         makeInactive(e)
    //     })

    //     chatList.appendChild(div);
    // });
  });

submitContactName.addEventListener("click", () => {
  if (addContactName.value != "") {
    fetch(`/personal/contacts`, {
      method: "POST",
      body: JSON.stringify({
        contact: addContactName.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        addContactName.value = "";
        location.reload()
        close.click();
      });
  }
});
