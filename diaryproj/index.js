var express = require('express');
var app = express();
const port = 5000
const path  = require('path')
const model = require('./connection.js')
const bodyparser = require('body-parser');
var nodemailer = require('nodemailer');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine','ejs');

app.get('/',function(req,res){
    model.query(`select *from todotable`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users:result.rows})
        
    })
})

app.get('/addform',function(req,res){
    res.render('addform')
})

app.post('/adddata',bodyparser.json(),async(req,res)=>{
    const user = req.body;
    console.log(user)
    let query = `insert into todotable (topicname,topicdescription,how,created,author) 
    values('${user.topicname}','${user.topicdescription}','${user.how}','${user.created}','${user.author}')`;
    model.query(query,function(err,result){
        if(err) throw err
        else if(!err) res.redirect('/');
        else res.status(500).render('500error')
    })
    model.end;
})

app.get('/delete/:id',(req,res)=>{
    model.query(`delete from todotable where id=${req.params.id}`,(err,result)=>{
        if(err) throw err
        else if(!err) res.redirect('/')
    })
})

app.get('/queryform',function(req,res){
    res.render('queryform')
})

app.post('/contactdata',function(req,res){
    console.log(req.body)
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S')
    const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();    
    const ampm = hours >= 12 ? 'pm' : 'am';
      
    hours %= 12;
    hours = hours || 12;    
    minutes = minutes < 10 ? `0${minutes}` : minutes;
      
    const strTime = `${hours}:${minutes} ${ampm}`;  
        return strTime;
    };
      
  console.log(formatted)
  
  console.log(formatAMPM(new Date()))
      
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vikkityagi1998@gmail.com',
      pass: 'lslmvihwerrjltqu'
    }
  });
  
  var mailOptions = {
    from: 'vikkityagi1998@gmail.com',
    to: 'vikkityagi1271998@gmail.com,req.body.email',
  //   subject: 'Datetime : '+formatted,
    subject: 'Time : '+ formatted+' '+formatAMPM(new Date()),
    text: 'Hi '+req.body.name+'\n'+
        +'\r'+
        req.body.query,
    // html: "<h1>This is case:</h1>",
    // attachments: [
    //     {
          
    //         image:req.body.image,
    //         path: path.join(__dirname, 'public/images/')+req.body.image,
    //         cid: 'uniq-req.file.originalname',
    //       //   cid: 'uniq-demo.png'
    //     }
    // ]
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
        model.query(`select *from todotable limit 7`,(err,result)=>{
            if(err) throw err
            else if(!err) res.render('home',{users: result.rows})
        })
    }
  });
})

app.post('/searchdata',async(req,res)=>{
    console.log(req.body)
    model.query(`select *from todotable where created > '${req.body.time}'`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users: result.rows})
    })
})


app.get('/3entry',function(req,res){
    model.query(`select *from todotable limit 3`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users: result.rows})
    })
    model.end;
})


app.get('/7entry',function(req,res){
    model.query(`select *from todotable limit 7`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users: result.rows})
    })
    model.end;
})

app.get('/21entry',function(req,res){
    model.query(`select *from todotable limit 21`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users: result.rows})
    })
    model.end;
})

app.get('/30entry',function(req,res){
    model.query(`select *from todotable limit 30`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('home',{users: result.rows})
    })
    model.end;
})


app.get('/updateform/:id',function(req,res){
    model.query(`select *from todotable where id=${req.params.id}`,(err,result)=>{
        if(err) throw err
        else if(!err) res.render('updateform',{user: result.rows[0]})
    })
    model.end;
})

app.post('/edit/:id',async(req,res)=>{
    console.log(req.body)
    const user = req.body;
    let query = `update todotable set topicname='${user.topicname}',topicdescription='${user.topicdescription}'
    ,how='${user.how}',created='${user.created}',author='${user.author}' where id = ${req.params.id}`;
    model.query(query,(err,result)=>{
        if(err) throw err
        else if(!err) res.redirect('/')
    })
    model.end;
})

app.listen(port,function(){
    console.log(`server is running on port ${port}`)
})

model.connect(function(err){
    if(err) throw err
    console.log("Connected")
})