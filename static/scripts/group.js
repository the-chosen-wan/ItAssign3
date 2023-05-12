const submitGroupName = document.getElementById('submitGroupName');
const addGroupName = document.getElementById('addGroupName');
const closeGroup = document.getElementsByClassName("close")[1];
const groupChatList = document.getElementById('groupChatList');
const chatGroupSubmit   = document.getElementById('chatGroupSubmit');
const chatGroupInput    = document.getElementById('chatGroupInput');
const groupMsgHistory   = document.getElementById('groupMsgHistory');
const groupnameHeader   = document.getElementById('groupnameHeader');
const groupNavHeader = document.getElementById('groupNavHeader');
const groupNav = document.getElementById('groupNav');
const seeMembersModalBody = document.getElementById('seeMembersModalBody');
const seeMembersModalHeader = document.getElementById('seeMembersModalHeader');

function getMembers(groupname){
    const url = '/group/getMembers';
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
        if(res.status == "Accepted"){
            let headerHtml = `<h4 class="modal-title">Members of ${groupname}</h4>`
            seeMembersModalHeader.innerHTML = headerHtml

            let bodyHtml = ""
            res.result.forEach((member) => {
                bodyHtml += `<p class="text-info">Username ${member.USERNAME}</p>`
                bodyHtml += `<p class="text-info">Role ${member.ROLE.toLowerCase()}</p>`
                bodyHtml+= `<hr>`
            })

            seeMembersModalBody.innerHTML = bodyHtml
        }
    })
}

function getMemberButtonHTML(groupname){
    return `<button class="btn btn-info" onclick="getMembers('${groupname}')" id="${groupname}" data-toggle="modal" data-target="#seeMembers">Members</button>`
}

// Get all group chats
function groupClicker(e){
    if(e.target.className == "chat_list"){
        groupMsgHistory.innerHTML = ""
        let id = e.target.id

        chatGroupSubmit.submitter = id
        chatGroupInput.submitter = id
        chatGroupSubmit.role   = e.target.role
        chatGroupInput.role   = e.target.role

        e.target.className = "chat_list active_chat"
        groupnameHeader.value = id
        fetchGroupChats(id)
        }
    
    if(e.target.className == "chat_list active_chat"){
        let id = e.target.id
        e.target.className = "chat_list"
        }
}


const url = '/group/getall';
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: username
    })
}).then(
    (res) => {
        return res.json();
}).then((res)=>{
    socket.emit("groupNames",res.result)

    res.result.forEach((group) => {
        let div = document.createElement("div");
        div.className = "chat_list";
        div.innerHTML = `
            <div class="chat_people">
                        <div class="chat_ib">
                            <h5>${group.GROUPNAME} <span class="justify-content-right">${getMemberButtonHTML(group.GROUPNAME)}</span></h5>
                            <p>Group Description</p>
                        </div>
            </div>
            `;
        div.id = group.GROUPNAME
        div.role = group.ROLE

        div.addEventListener("click", (e)=>{
            groupClicker(e)
        })

        div.addEventListener("mouseover", (e)=>{
            makeActive(e)
        })

        div.addEventListener("mouseout", (e)=>{
            makeInactive(e)
        })


        groupChatList.appendChild(div);
    })
})

submitGroupName.addEventListener('click', (e) => {
    e.preventDefault();
    const groupname = addGroupName.value;
    const url = '/group/add';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            groupname,
            role:"ADMIN"
        })
    }).then(
        res => {
            return res.json();
        }
    )
    .then(()=>{
        addGroupName.value = ""
        location.reload()
        closeGroup.click();
    })
})
