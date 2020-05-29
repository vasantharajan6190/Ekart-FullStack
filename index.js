const express =require("express")
const app = express()
const bcrypt = require("bcrypt")
const cors = require("cors")
const pool = require("./db")
app.use(cors())
app.use(express.json())

//Register Route
app.post("/register",async (req,res)=>{
    const {email,name,password,mobile} = req.body
    try{
    const users =await pool.query("SELECT * FROM users WHERE users.email=$1",[email])
    if(users.rows.length>0){
        return res.json("false")
    }
    else{
        if(mobile.length!==10){
            return res.json("error")
        }
        else{
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt)
       const newuser = await pool.query("INSERT INTO users (name,email,password,mobile_no) values($1,$2,$3,$4) RETURNING *",[name,email,hashedpassword,mobile])
       res.json(newuser.rows)
        }
    }
}
catch(error){
   return res.send("Server Error")
}
})
//Login Route
app.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await pool.query("SELECT * FROM users WHERE users.email = $1",[email])
        if(user.rows.length>0){
           const dbpassword = user.rows[0].password
           const passwordverify = await bcrypt.compare(password,dbpassword)
           console.log(passwordverify)
           if(passwordverify){
               return res.json(user)
           }
           else{
               return res.json("incorrect")
           }
        }
        else{
             return res.json("false")
        }
    } catch (error) {
        return res.send(error)
    }
})

//items section
//view all items
app.get("/items",async (req,res)=>{
    const items = await pool.query("SELECT title,img,rating,price,favback,cartback FROM items")
    res.json(items.rows)
})
//create items
app.post("/items",async(req,res)=>{
    const {title,img,price,rating,currentname} = req.body
    try {
        const check = await pool.query("SELECT * FROM items WHERE items.title=$1",[title])
        if(check.rows.length>0){
            return res.json("false")
        }
        else{
            const user = await pool.query("SELECT user_id FROM users WHERE email=$1",[currentname])
            const userid = user.rows[0].user_id
            const add = await pool.query("INSERT INTO items(user_id,title,img,price,rating) values($1,$2,$3,$4,$5) RETURNING *",[userid,title,img,price,rating])
            res.json(add.rows)
        }
    } catch (error) {
        return res.json("server Error")
    }
})

//favourites section
//fav by user
app.get("/fav",async(req,res)=>{
    const currentname = req.query.search
    try {
        const user = await pool.query("SELECT user_id FROM users WHERE email=$1",[currentname])
        const userid = user.rows[0].user_id
        const check = await pool.query("SELECT title,img,rating,price,favback,cartback FROM fav INNER JOIN users ON fav.user_id=users.user_id WHERE fav.user_id=$1",[userid])
        const ans = check.rows
        res.json(ans)
    } catch (error) {
        return res.send("Server Error")
    }
})
//add to fav
app.post("/fav",async(req,res)=>{
    const {title,img,rating,price,currentname} = req.body
    try {
    
            const user = await pool.query("SELECT user_id FROM users WHERE email=$1",[currentname])
            const userid = user.rows[0].user_id
            const add = await pool.query("INSERT INTO fav(user_id,title,img,price,rating) values($1,$2,$3,$4,$5) RETURNING *",[userid,title,img,price,rating])
            res.json(add.rows)
        
    } catch (error) {
        return res.send("Server Error")
    }
})
//delete from fav
app.delete("/fav",async(req,res)=>{
    const favid = req.query.favid
    const userid = req.query.userid
    const response = await pool.query("DELETE FROM fav WHERE fav.title=$1 AND fav.user_id=$2 RETURNING *",[favid,userid])
    res.json("Data Deleted")
})


//cart section
//cart by user
app.get("/cart",async(req,res)=>{
    const currentname = req.query.search
    try {
        const user = await pool.query("SELECT user_id FROM users WHERE email=$1",[currentname])
        const userid = user.rows[0].user_id
        const check = await pool.query("SELECT title,img,rating,price,favback,cartback FROM cart INNER JOIN users ON cart.user_id=users.user_id WHERE cart.user_id=$1",[userid])
        const ans = check.rows
        res.json(ans)
    } catch (error) {
        return res.send("Server Error")
    }
})
//add to cart
app.post("/cart",async(req,res)=>{
    const {title,img,rating,price,currentname} = req.body
    try {
    
            const user = await pool.query("SELECT user_id FROM users WHERE email=$1",[currentname])
            const userid = user.rows[0].user_id
            const add = await pool.query("INSERT INTO cart(user_id,title,img,price,rating) values($1,$2,$3,$4,$5) RETURNING *",[userid,title,img,price,rating])
            res.json(add.rows)
        
    } catch (error) {
        return res.send("Server Error")
    }
})
//delete from cart
app.delete("/cart",async(req,res)=>{
    const favid = req.query.favid
    const userid = req.query.userid
    const response = await pool.query("DELETE FROM cart WHERE cart.title=$1 AND cart.user_id=$2 RETURNING *",[favid,userid])
    res.json("Data Deleted")
})

app.listen(5000,()=>{
    console.log("Server Started")
})