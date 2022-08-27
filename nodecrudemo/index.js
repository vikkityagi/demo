var express = require("express");
var app = express();
const model = require('./connectpost.js')
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser')


app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('home')
})

app.get('/insert',function(req,res){
    res.render('insert')
})

app.post('/data',function(req,res){
    const user = req.body;
    console.log(user)
    if(user.password===user.cpassword){
        const query = `insert into demo (fname,lname,password,cpassword) values('${user.fname}','${user.lname}','${user.password}',
    '${user.cpassword}')`;
    model.query(query,async(err,result)=>{
        if(!err){
            res.redirect('/showall')
        }
        else{
            res.send(err.message);
        }    
    })     
    } 
    else{
        return res.status(401).json({ sucess: false, message: 'password does not match'});
    }
    model.end;    
});


app.get('/show',function(req,res){
    const userdata = req.body;
    let selectquery = `Select * from demo where fname='${userdata.fname}' and password='${userdata.password}'`;
    model.query(selectquery,(err,result)=>{
        if(err) throw err
        if(!err) return res.send(result.rows)
    })
    model.end;
});


app.get('/showall',function(req,res){
    model.query(`select *from demo`,async(err,result)=>{
        if(err) throw err
        else{
            res.render("showall",{users:result.rows})
        }
    })
    model.end;
});


// external update begin
app.get('/updateform',function(req,res){
    res.render('updateid')
})


app.post('/updateid',function(req,res){
    console.log(req.body)
    model.query(`select *from demo where id=${req.body.id}`,(err,result)=>{
        console.log(result.rows)
        console.log(result.rows[0])
        console.log(result.rows.length)
        if(result.rows.length==0) return res.status(401).json({message: 'id wrong'})
        if(!err && result.rows.length!=0) res.render('edit',{user:result.rows[0]})
    })
})
//end

app.get('/update/:id',function(req,res) {
    model.query(`select *from demo where id = ${req.params.id}`,(err,result) => {
        console.log(result.rows)
        
        if(!err) res.render('edit',{user:result.rows[0]})
    })
    model.end;
})


app.post('/edit/:id',async(req,res)=>{
    const userdata = req.body;
    let query = `update demo set fname='${userdata.fname}',lname='${userdata.lname}',password='${userdata.password}',
    cpassword='${userdata.cpassword}' where id=${req.params.id}`;
    if(userdata.password==userdata.cpassword){
        await model.query(query,(err,result)=>{
            if(err) throw err
            if(!err) res.redirect('/showall')
        })
    }
    else{
        res.status(401).send('password check')
    }
    
    model.end;
})


// external delete begin
app.get('/deleteform',function(req,res){
    res.render('deleteform')
})


app.post('/deleteid',async(req,res)=>{
    await model.query(`delete from demo where id=${req.body.id}`,(err,result)=>{
        console.log(result)
        console.log(result.rows)
        console.log(result.rows[0])
    })
})
// end

app.get('/delete/:id',async(req,res)=>{
    await model.query(`delete from demo where id=${req.params.id}`,(err,result)=>{
        if(err) throw err
        if(!err) res.redirect('/showall')
    })
    model.end;
})


const port = 3100



app.listen(port,function(){
    console.log(`app listening on port ${port}`);
})
model.connect(function(err){
    if(err) throw err;
    console.log('connected')
});


