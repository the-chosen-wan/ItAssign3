var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var path = require("path");
var dbUtils = require("./database.js");
const cookieParser = require('cookie-parser');


var app = express();
var http= require('http').createServer(app);
var io = require('socket.io')(http);
var conn = dbUtils.conn;
var pub = path.join(__dirname, "static");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:true}));
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));

app.get("/", (req, res) => {
    //destroy the cookie
    res.clearCookie("username")
    res.sendFile(path.join(pub, "/html/register.html"));
})

app.post("/", (req, res) => {
    dbUtils.checkUser(conn, req.body).then((result) => {
        if (result===undefined||result.length == 0) {
            dbUtils.addUser(conn, req.body).then((result) => {
                //create cookie to store username
                res.cookie("username", req.body.username)
                res.send({ status: "Accepted" });
            }).catch((err) => {
                res.send({ status: "Rejected" });
            })
        } else {
            res.send({ status: "Rejected" });
        }
    }).catch((err) => {
        res.send({ status: "Rejected" });
    })
})

app.post("/addImage/:username", (req, res) => {
    req.on('data', (chunk) => {
        data  = Object()
        data.username = req.params.username
        data.image = chunk
        dbUtils.addImage(conn,data).then((result) => {
        }).catch((err) => {
            console.log(err);
        })
    })
})


app.get("/login", (req, res) => {
    //destroy the cookie
    res.clearCookie("username")
    res.sendFile(path.join(pub, "/html/login.html"));
})

app.post("/login", (req, res) => {
    dbUtils.verifyUser(conn, req.body).then((result) => {
        if (result===undefined||result.length == 0) {
            res.json({ validated: "Rejected" });
        } else {
            //create cookie to store username
            res.cookie("username", req.body.username)
            res.json({ validated: "Accepted" });
        }
    }).catch((err) => {
        res.json({ validated: "Rejected" });
    })
})

app.get("/personal", (req, res) => {
    res.sendFile(path.join(pub, "/html/personal.html"));
})

app.post("/personal/contacts", (req, res) => {
    data = {}
    //get from cookie not sesion
    console.log(req.cookies.username)
    data.username = req.cookies.username
    data.contact = req.body.contact
    console.log(data)
    checkData = {}
    checkData.username = req.body.contact
    //check if contact is present in db
    dbUtils.checkUser(conn, checkData).then((result) => {
        if (result===undefined||result.length == 0) {
            res.send({ status: "Rejected" });
        } else {
            dbUtils.insertContact(conn, data).then((result) => {
                res.send({ status: "Accepted" });
            }).catch((err) => {
                res.send({ status: "Rejected" });
            })
        }
    }).catch((err) => {
        res.send({ status: "Rejected" });
    }
    )
})

app.post("/personal/image", (req, res) => {
    
    dbUtils.insertImage(conn, req.body).then((result) => {
        res.send({ status: "Accepted" });
    }
    ).catch((err) => {
        console.log(err)
    })
})


app.post("/personal/contacts/getall", (req, res) => {
    console.log(req.cookies.username)
    data = {}
    data.username = req.cookies.username
    dbUtils.getContacts(conn, data).then((result) => {

        res.send({result:result,username:req.cookies.username});
    }).catch((err) => {
        console.log(err)
        res.send({ status: "Rejected" });
    })
})

app.post("/personal/profile", (req, res) => {
    data = {}
    data.username = req.cookies.username
    console.log(data)
    if(req.body.status=="fetch"){
        dbUtils.getUserProfile(conn, data).then((result) => {
            result[0].IMAGE = result[0].IMAGE.toString()
            res.send({result:result,status:"Accepted"});
        }).catch((err) => {
            console.log(err)
            res.send({ status: "Rejected" });
        })
    }else if(req.body.status=="update"){
        data.status = req.body.status
        data.fname = req.body.fname
        data.lname = req.body.lname
        data.tag = req.body.tag


        dbUtils.modifyUser(conn, data).then((result) => {
            res.send({ status: "Accepted" });
        }).catch((err) => {
            console.log(err)
            res.send({ status: "Rejected" });
        })
    }
})


app.post("/personal/contacts/sendmessage",(req,res)=>{
    let data = {}
    data.hash = req.body.hash
    data.message = req.body.message
    data.sender = req.body.sender
    data.receiver = req.body.receiver
    data.ts = req.body.ts
    
    dbUtils.insertChat(conn,data).then((result)=>{
        res.send({status:"Accepted"})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/personal/contacts/getmessages",(req,res)=>{
    let data = {}
    data.hash = req.body.hash
    dbUtils.getChats(conn,data).then((result)=>{
        result.map((element)=>{
            element.CHAT = element.CHAT.toString()
        })
        
        res.send({status:"Accepted",result:result})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/personal/contacts/getimages",(req,res)=>{
    let data = {}
    data.username = req.body.username
    dbUtils.getImages(conn,data).then((result)=>{

        if(result===undefined||result.length==0){
            res.send({status:"Rejected"})
        }
        
        else{
            result.forEach((element)=>{
                element.IMAGE = element.IMAGE.toString()
            })
            res.send({status:"Accepted",result:result})
        }   
        
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/personal/getPersonalImages",(req,res)=>{
    let data = {}
    data.hash = req.body.hash
    console.log(req.body)
    dbUtils.getPersonalImages(conn,data).then((result)=>{
        if(result===undefined||result.length==0){
            res.send({status:"Rejected"})
        }
        
        else{
            result.forEach((element)=>{
                element.IMAGE = element.IMAGE.toString()
            })
            res.send({status:"Accepted",result:result})
        }   
        
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/insertImage",(req,res)=>{
    dbUtils.insertGroupImage(conn, req.body).then((result) => {
        res.send({ status: "Accepted" });
    }
    ).catch((err) => {
        console.log(err)
    })
})

app.post("/group/chat/add",(req,res)=>{
    let data = {}
    data.groupname = req.body.data.groupname
    data.message = req.body.data.message
    data.sender = req.body.data.sender
    data.ts = req.body.data.ts


    dbUtils.insertGroupChat(conn,data).then((result)=>{
        res.send({status:"Accepted"})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/add",(req,res)=>{
    let data = {}

    if(req.body.username){
        data.username = req.body.username
    }
    else{
        data.username = req.cookies.username
    }
    
    data.groupname = req.body.groupname
    data.role = req.body.role

    dbUtils.verifyGroup(conn,data).then((result)=>{
        if(result===undefined||result.length==0){
            dbUtils.addGroup(conn,data).then((result)=>{
                res.send({status:"Accepted"})
            }).catch((err)=>{
                console.log(err)
                res.send({status:"Rejected"})
            })
        }
        else{
            res.send({status:"Rejected"})
        }
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/add/makeAdmin",(req,res)=>{
    let data = {}
    data.username = req.body.username
    data.groupname = req.body.groupname

    dbUtils.verifyGroup(conn,data).then((result)=>{
        if(result===undefined||result.length==0){
            res.send({status:"Rejected"})
        }
        else{
            dbUtils.makeAdmin(conn,data).then((result)=>{
                res.send({status:"Accepted"})
            }).catch((err)=>{
                console.log(err)
                res.send({status:"Rejected"})
            })
        }
    })
})

app.post("/group/getall",(req,res)=>{
    let data = {}
    data.username = req.cookies.username

    dbUtils.getGroups(conn,data).then((result)=>{
        res.send({status:"Accepted",result:result})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/getMembers",(req,res)=>{
    let data = {}
    data.groupname = req.body.groupname

    dbUtils.getGroupMembers(conn,data).then((result)=>{
        res.send({status:"Accepted",result:result})
    }
    ).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/getmessages",(req,res)=>{
    let data = {}
    data.groupname = req.body.groupname

    dbUtils.getGroupChats(conn,data).then((result)=>{
        result.map((element)=>{
            element.CHAT = element.CHAT.toString()
        })
        res.send({status:"Accepted",result:result})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/getimages",(req,res)=>{
    let data = {}
    data.groupname = req.body.groupname

    dbUtils.getGroupImages(conn,data).then((result)=>{
        result.map((element)=>{
            element.IMAGE = element.IMAGE.toString()
        })
        res.send({status:"Accepted",result:result})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

app.post("/group/leave",(req,res)=>{
    let data = {}
    data.username = req.body.username
    data.groupname = req.body.groupname


    dbUtils.leaveGroup(conn,data).then((result)=>{
        res.send({status:"Accepted"})
    }).catch((err)=>{
        console.log(err)
        res.send({status:"Rejected"})
    })
})

var socketIds = {}
var groupCounts = {}

io.on('connection', (socket) => {
    socket.on('connectionInit', (data) => {
        if(socketIds[data.username]==null) {
            socketIds[data.username] = [socket.id]
        }
        else{
            socketIds[data.username].push(socket.id)
        }
    })

    socket.on('disconnect', () => {
        for(var key in socketIds) {
            socketIds[key] = socketIds[key].filter((id) => id != socket.id)
        }

        for(room in socket.rooms){
            if(groupCounts[room]!=null){
                groupCounts[room]--
            }

            if(groupCounts[room]==0){
                delete groupCounts[room]
                socket.leave(room)
            }
        }
    })

    socket.on('chatMessage',(data)=>{
        if(socketIds[data.receiver] != null) {
            socketIds[data.receiver].forEach((id) => {
                io.to(id).emit('chatMessage', data)
            })
        }
    })

    socket.on("groupNames",(data)=>{
        data.forEach((element)=>{
            if(groupCounts[element]==null){
                groupCounts[element.GROUPNAME] = 1
            }
            else{
                groupCounts[element.GROUPNAME]++
            }

            socket.join(element.GROUPNAME)
        })
    })

    socket.on("groupMessage",(data)=>{
        console.log(data)
        socket.to(data.groupname).emit("groupMessage",data)
    })

    socket.on("personalTyping",(data)=>{
        if(socketIds[data.receiver] != null) {
            socketIds[data.receiver].forEach((id) => {
                io.to(id).emit('personalTyping', data)
            })
        }
    })

    socket.on("groupTyping",(data)=>{
        socket.to(data.groupname).emit("groupTyping",data)
    })

    socket.on("leaveGroup",(data)=>{
        socket.to(data.groupname).emit("leaveGroup",data)
        
        if(groupCounts[data.groupname]!=null){
            groupCounts[data.groupname]--
        }

        if(groupCounts[data.groupname]==0){
            delete groupCounts[data.groupname]
            socket.leave(data.groupname)
        }
    })

    socket.on("groupImage", (data) => {
        socket.to(data.groupname).emit("groupImage", data)
    })


    socket.on("personalImage", (data) => {
        if(socketIds[data.receiver] != null) {
            socketIds[data.receiver].forEach((id) => {
                io.to(id).emit("personalImage", data)
            })
        }
    })
})


http.listen(('172.28.7.157',3000), () => {
    console.log("Server started at port 3000");
})