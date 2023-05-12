let socket = io()

socket.on('chatMessage', (data) => {
    if(data.hash == chatSubmit.submitter.hashCode() + clientUsername.hashCode()){
        appendChatReceiver(data.message,data.ts)
    }
})


socket.on("personalImage", (data) => {
    console.log("Here")
    if(data.id == chatSubmit.submitter.hashCode() + clientUsername.hashCode()){
        appendImageReceiver(data.image,data.ts)
    }
})

socket.on("groupMessage", (data) => {
    if(data.groupname == chatGroupSubmit.submitter){
        appendGroupChatReceiver(data.sender,data.message,data.ts)
    }
})

socket.on("groupImage", (data) => {
    if(data.groupname == chatGroupSubmit.submitter){
        appendGroupImageReceiver(data.sender,data.image,data.ts)
    }
})

socket.on("leaveGroup",(data)=>{
    if(data.groupname == chatGroupSubmit.submitter){
        appendGroupChatReceiver("Server",data.username + " left the group","")
    }
})


socket.on("personalTyping",(data)=>{

    if(data.sender == chatSubmit.submitter){
        createTypingEffect()

        setTimeout(()=>{
            removeTypingEffect()
        },2000)
    }
})

socket.on("groupTyping",(data)=>{
    if(data.groupname == chatGroupSubmit.submitter){
        createGroupTypingEffect(data.sender)

        setTimeout(()=>{
            removeGroupTypingEffect()
        },2000)
    }
})