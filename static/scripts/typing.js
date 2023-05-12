const personalNavHeader = document.getElementById('personalNavHeader');

function createTypingEffect(){
    if(!document.getElementById("typing")){
        const typing = document.createElement("div");
        typing.className = "text-info";
        typing.id = "typing";
        typing.innerHTML = "Typing...";
        personalNavHeader.appendChild(typing);
    }
}

function removeTypingEffect(){
    const typing = document.getElementById("typing");
    if(typing){
        personalNavHeader.removeChild(typing);
    }
}

function removeGroupTypingEffect(){
    const typing = document.getElementById("typing");
    if(typing){
        groupNavHeader.removeChild(typing);
    }
}

function createGroupTypingEffect(typer="Someone"){
    removeGroupTypingEffect();

    if(!document.getElementById("typing")){
        const typing = document.createElement("div");
        typing.className = "text-info";
        typing.id = "typing";
        typing.innerHTML = `${typer} is typing...`;
        groupNavHeader.appendChild(typing);
    }
}

