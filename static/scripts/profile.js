
const profileForm = document.getElementById('profileForm');
let img = document.getElementById('image');
const savePOrofile = document.getElementById('saveProfile');

let xhr = new XMLHttpRequest();

xhr.open('POST', '/personal/profile', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send(JSON.stringify({status:"fetch"}));

xhr.onload = function() {
    if(this.status==200){
        let userData = JSON.parse(this.response);

        if(userData.status=="Accepted"){
            userImage = userData.result[0].IMAGE
            userFname = userData.result[0].FNAME
            userLname = userData.result[0].LNAME
            userTag = userData.result[0].TAG
            userUsername = userData.result[0].USERNAME

            profileForm.elements['fname'].value = userFname
            profileForm.elements['lname'].value = userLname
            profileForm.elements['tag'].value = userTag
            profileForm.elements['username'].value = userUsername
            img.setAttribute('src',`${userImage}`)
            
        }
    }
}

saveProfile.addEventListener('click',()=>{
    let xhr = new XMLHttpRequest();

    let fname = profileForm.elements['fname'].value;
    let lname = profileForm.elements['lname'].value;
    let tag = profileForm.elements['tag'].value;
    
    data = {
        status:"update",
        fname:fname,
        lname:lname,
        tag:tag
    }

    xhr.open('POST', '/personal/profile', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));

        // xhr.onload = function() {
        //     userImage = userData.result[0].IMAGE
        //     userFname = userData.result[0].FNAME
        //     userLname = userData.result[0].LNAME
        //     userTag = userData.result[0].TAG
        //     userUsername = userData.result[0].USERNAME

        //     profileForm.elements['fname'].value = userFname
        //     profileForm.elements['lname'].value = userLname
        //     profileForm.elements['tag'].value = userTag
        //     profileForm.elements['username'].value = userUsername
        //     img.setAttribute('src',`${userImage}`)
        // } 

})