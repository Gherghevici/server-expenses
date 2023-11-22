require("dotenv").config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3001"
}))
console.log("started")
const users = [];

app.get('/users',(req,res)=>{
    res.json(users);
})

app.post('/users',async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const user = {email:req.body.email,password:hashedPassword};
        users.push(user);
        res.status(201).send();
    }catch{
        res.status(500).send();
    }
})

app.post('/users/login', async (req,res)=>{
    const user = users.find(user=>user.email == req.body.email);
    if(user == null){
        return res.status(400).send("Cannot find user");
    }
    try{
        if(await(bcrypt.compare(req.body.password,user.password))){
             res.send('Succes');
        }else{
            res.status(404);
            res.send("Not allowed");
        }
    }catch{
        res.status(500).send();
    }
})

app.listen(3000);