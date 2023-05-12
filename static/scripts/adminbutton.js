const addGroupNormalName = document.getElementById("addGroupNormalName")
const submitGroupNormalName = document.getElementById("submitGroupNormalName")
const closeGroupNormal = document.getElementsByClassName("close")[2]
const closeMakeAdmin = document.getElementsByClassName("close")[3]
const submitMakeAdmin = document.getElementById("submitMakeAdmin")
const addMakeAdmin = document.getElementById("addMakeAdmin")

submitGroupNormalName.addEventListener("click", (e)=>{
    let groupname = chatGroupSubmit.submitter
    let username = addGroupNormalName.value
    const url = '/group/add';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                groupname: groupname,
                username: username,
                role: "NORMAL"
            }
        )
    }).then(
        (res) => {
            return res.json();
    }).then((res)=>{
        if(res.status == "Accepted"){
            addGroupNormalName.value = ""
            closeGroupNormal.click()
            location.reload()
        }
    })
})

submitMakeAdmin.addEventListener("click", (e)=>{
    let groupname = chatGroupSubmit.submitter
    let username = addMakeAdmin.value
    const url = '/group/add/makeAdmin';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                groupname: groupname,
                username: username,
                role: "ADMIN"
            }
        )
    }).then(
        (res) => {
            return res.json();
    }).then((res)=>{
        if(res.status == "Accepted"){
            addMakeAdmin.value = ""
            closeMakeAdmin.click()
            location.reload()
        }
    })
})

function removeButton(){
    const rem = document.getElementById("addUserButton")
    if(rem){
        groupNavHeader.removeChild(rem)
    }
}

function addButton(){
    removeButton()
    let button = document.createElement("button");
    button.className = "btn btn-info justify-content-right";
    button.id = "addUserButton"
    button.innerHTML = "Add User"
    button.setAttribute("data-target","#modalGroupNormalUserForm")
    button.setAttribute("data-toggle","modal")
    button.type = "button"
    console.log(button)
    groupNavHeader.appendChild(button)
}

function removeUserListButton(){
    const rem = document.getElementById("userListButton")
    if(rem){
        groupNavHeader.removeChild(rem)
    }
}

function addUserListButton(){
    removeUserListButton()
    let button = document.createElement("button");
    button.className = "btn btn-info justify-content-right";
    button.id = "userListButton"
    button.innerHTML = "Admin"
    button.setAttribute("data-target","#modalMakeAdmin")
    button.setAttribute("data-toggle","modal")
    button.type = "button"
    console.log(button)
    groupNavHeader.appendChild(button)
}

function removeLeaveButton(){
    const rem = document.getElementById("leaveButton")
    if(rem){
        groupNavHeader.removeChild(rem)
    }
}

function leaveGroup(){
    let groupname = chatGroupSubmit.submitter
    const url = '/group/leave';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                groupname: groupname,
                username: clientUsername
            }
        )
    }).then(
        (res) => {
            return res.json();
    }).then((res)=>{
        if(res.status == "Accepted"){
            socket.emit("leaveGroup",{username:clientUsername,groupname:groupname})
            location.reload()
        }
    })
}

function addLeaveButton(){
    removeLeaveButton()
    let button = document.createElement("button");
    button.className = "btn btn-info justify-content-right";
    button.id = "leaveButton"
    button.innerHTML = "Leave"
    button.type = "button"
    button.addEventListener("click",leaveGroup)
    groupNavHeader.appendChild(button)
}


