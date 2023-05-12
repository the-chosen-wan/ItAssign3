var mysql_package = require("mysql");

var conn = mysql_package.createConnection({
    host: "localhost",
    user: "root",
    password: "leo@2002",
    database: "it_assignment_3",
},(err)=>{
    if(err)
        console.log("Error occured")
});

function promisifyUpdate(conn,sql,insertData){
    return new Promise((resolve,reject)=>{
        conn.query(sql,[insertData],(err,result)=>{
            if(err)
                reject(err)
            resolve(result)
        })
    })
}

function promisifyQuery(conn,sql){
    return new Promise((resolve,reject)=>{
        conn.query(sql,(err,result)=>{
            if(err)
                reject(err)
            resolve(result)
        })
    })
}

function addUser(conn,data){
    insertData  = [[data.fname,data.lname,data.username,data.password]]
    return promisifyUpdate(conn,"INSERT INTO users (FNAME,LNAME,USERNAME,PASSWRD) VALUES ?",insertData)
}

function checkUser(conn,data){
    return promisifyQuery(conn,"SELECT * FROM users WHERE USERNAME = '"+data.username+"'")
}

function verifyUser(conn,data){
    return promisifyQuery(conn,"SELECT * FROM users WHERE USERNAME = '"+data.username+"' AND PASSWRD = '"+data.password+"'")
}

function modifyUser(conn,data){
    return promisifyQuery(conn,"UPDATE users SET FNAME = '"+data.fname+"', LNAME = '"+data.lname+"', TAG = '"+data.tag+"' WHERE USERNAME = '"+data.username+"'")
}

function addGroup(conn,data){
    return promisifyQuery(conn,"INSERT INTO groupnames (GROUPNAME,USERNAME,ROLE) VALUES ('"+data.groupname+"','"+data.username+"','"+data.role+"')")
}

function leaveGroup(conn,data){
    return promisifyQuery(conn,"DELETE FROM groupnames WHERE GROUPNAME = '"+data.groupname+"' AND USERNAME = '"+data.username+"'")
}

function getGroups(conn,data){
    return promisifyQuery(conn,"SELECT * FROM groupnames WHERE USERNAME = '"+data.username+"'")
}

function getGroupMembers(conn,data){
    return promisifyQuery(conn,"SELECT * FROM groupnames WHERE GROUPNAME = '"+data.groupname+"'")
}

function verifyGroup(conn,data){
    return promisifyQuery(conn,"SELECT * FROM groupnames WHERE GROUPNAME = '"+data.groupname+"' AND USERNAME = '"+data.username+"'")
}

function makeAdmin(conn,data){
    return promisifyQuery(conn,"UPDATE groupnames SET ROLE = 'ADMIN' WHERE GROUPNAME = '"+data.groupname+"' AND USERNAME = '"+data.username+"'")
}

function addImage(conn,data){
    return promisifyQuery(conn,"UPDATE users SET IMAGE = '"+data.image+"' WHERE USERNAME = '"+data.username+"'")
}

function insertContact(conn,data){
    insertData = [[data.username,data.contact]]
    return promisifyUpdate(conn,"INSERT INTO contacts (USERNAME,CONTACT)  VALUES ?",insertData)
}

function getContacts(conn,data){
    //select details from users table of all contacts using database join
    return promisifyQuery(conn,'SELECT FNAME,LNAME,users.USERNAME,users.TAG FROM users INNER JOIN contacts ON users.USERNAME = contacts.CONTACT WHERE contacts.USERNAME = "'+data.username+'"')
}

function getImages(conn,data){
    return promisifyQuery(conn,'SELECT IMAGE FROM users INNER JOIN contacts ON users.USERNAME = contacts.CONTACT WHERE contacts.USERNAME = "'+data.username+'"')
}

function insertChat(conn,data){
    insertData = [[data.hash,data.sender,data.receiver,data.message,data.ts]]
    return promisifyUpdate(conn,"INSERT INTO personalchats (ID,SENDER,RECEIVER,CHAT,TS) VALUES ?",insertData)
}

function insertImage(conn,data){
    insertData = [[data.id,data.sender,data.receiver,data.image,data.ts]]
    return promisifyUpdate(conn,"INSERT INTO personalimages (ID,SENDER,RECEIVER,IMAGE,TS) VALUES ?",insertData)
}

function insertGroupChat(conn,data){
    insertData = [[data.groupname,data.sender,data.message,data.ts]]
    return promisifyUpdate(conn,"INSERT INTO groupchats (GROUPNAME,SENDER,CHAT,TS) VALUES ?",insertData)
}

function getGroupChats(conn,data){
    return promisifyQuery(conn,"SELECT * FROM groupchats WHERE GROUPNAME = '"+data.groupname+"'")
}

function getChats(conn,data){
    return promisifyQuery(conn,"SELECT * FROM personalchats WHERE ID = '"+data.hash+"'")
}

function getPersonalImages(conn,data){
    return promisifyQuery(conn,"SELECT * FROM personalimages WHERE ID = '"+data.hash+"'")
}

function getUserProfile(conn,data){
    return promisifyQuery(conn,"SELECT * FROM users WHERE USERNAME = '"+data.username+"'")
}

function insertGroupImage(conn,data){
    insertData = [[data.groupname,data.sender,data.image,data.ts]]
    return promisifyUpdate(conn,"INSERT INTO groupimages (GROUPNAME,SENDER,IMAGE,TS) VALUES ?",insertData)
}

function getGroupImages(conn,data){
    return promisifyQuery(conn,"SELECT * FROM groupimages WHERE GROUPNAME = '"+data.groupname+"'")
}

module.exports = {
    conn: conn,
    addUser: addUser,
    checkUser: checkUser,
    verifyUser: verifyUser,
    addImage: addImage,
    modifyUser: modifyUser,
    insertContact: insertContact,
    getContacts: getContacts,
    insertChat: insertChat,
    getChats: getChats,
    getImages: getImages,
    getUserProfile: getUserProfile,
    addGroup: addGroup,
    getGroups: getGroups,
    verifyGroup: verifyGroup,
    insertGroupChat: insertGroupChat,
    getGroupChats: getGroupChats,
    makeAdmin: makeAdmin,
    leaveGroup: leaveGroup,
    getGroupMembers: getGroupMembers,
    insertImage: insertImage,
    getPersonalImages: getPersonalImages,
    insertGroupImage: insertGroupImage,
    getGroupImages: getGroupImages
}
