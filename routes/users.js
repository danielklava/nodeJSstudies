var express = require('express');
var router = express.Router();

//Database
var pg = require('pg');
var conString = 'postgres://postgres:admindb@localhost/nodejs_db'

/*
 * GET userlist. 
 */
router.get('/', function(req, res){
    res.render('users', {title : "User Management"})
})

/*
 * GET userlist. 
 */
router.get('/userlist',function(req, res){

	//var collection = db.get('userlist');
	//collection.find({},{},function(e,docs){
	//	res.json(docs);
	//})
})

/*
 * GET USERS - Postgre
 */
router.get('/get', function(req, res, next){

    const results = [];

    pg.connect(conString, function(err, client, done){
        if (err){
            done();
            console.log(err);
            return res.status(500).json({success:false, data:err});
        }
        const query = client.query('SELECT * FROM users;');

        query.on('row', (row)=> {
            results.push(row);
        })

        query.on('end', () =>{
            done();
            return res.json(results);
        });
    });
})

/*
 * POST to adduser.
 */
router.post('/add', function(req, res, next) {
    const results= [];

    const data = req.body;

    pg.connect(conString, function(err,client,done){
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        const query = client.query('INSERT INTO users (username, name, email, location, age, gender) VALUES ($1, $2, $3, $4, $5, $6);'
            , [data.username, data.name, data.email, data.location, data.age, data.gender]);

        query.on("end", function (result) {          
            client.end(); 
            res.write('Success');
            res.end();  
        });
    })
});

/*
 * DELETE to deleteuser.
 */
router.delete('/delete/:user_id', function(req, res, next) {

    var userId = req.params.user_id;

    pg.connect(conString,function(err,client,done){
        if (err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        const query = client.query('DELETE FROM users WHERE username = ($1);', [userId]);

        query.on("end", function (result) {          
            client.end(); 
            res.write('Success');
            res.end();  
        });
    });
});

module.exports = router;
