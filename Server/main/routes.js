var express = require('express')
var router = express.Router()
var pool = require('./db')

/*specify api path*/
router.get('/hello', (req, res) => {
  res.json('hello world')
})


/*
  USER PROFILE SECTION
*/

router.post('/api/posts/userprofiletodb', (req, res, next) => {
  const values = [req.body.password,
    req.body.email,
    req.body.name
  ]
  pool.query(`INSERT INTO Users(password, email, name)
                VALUES($1, $2, $3)
                ON CONFLICT DO NOTHING`, values,
    (q_err, q_res) => {
      res.json("200")
    })
})


router.get('/api/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;
  pool.query(`SELECT id, name, email FROM users
                WHERE email=$1 AND password=$2`, [email, password],
    (q_err, q_res) => {
      res.json(q_res.rows); //Is there a better way to show if not found? currently if rows empty then means no account
    })
})

/*
  RESTAURANT SECTION
*/

router.get('/api/get/restaurantsfromdb', (req, res, next) => {
  pool.query(`SELECT * FROM Restaurants`,
    (q_err, q_res) => {
      res.json(q_res.rows); 
    })
})

router.get('/api/get/restaurantmenu', (req, res, next) => {
  const rname = req.query.rname;
  pool.query(`SELECT fname, price, category, rname 
              FROM Restaurants join Sells using (rname)
              WHERE rname=$1`, [rname],
    (q_err, q_res) => {
      console.log(q_res.rows);
      res.json(q_res.rows); 
    })
})

router.get('/api/get/gettherestaurantfromdb', (req, res, next) => {
  const rname = req.query.rname;
  pool.query(`SELECT descript, minorder
              FROM Restaurants
              WHERE rname=$1`, [rname],
    (q_err, q_res) => {
      console.log(q_res.rows);
      res.json(q_res.rows); 
    })

})

/*
  Manager
*/

router.get('/api/get/getMonthTotalOrders', (req, res, next) => {
  const monthSelected = req.query.monthSelected;
  pool.query(`SELECT orid, cartCost, deliveredtime
              FROM Orders join DeliveryTime using (orid)
              where date_part('month', deliveredtime) = $1`, [monthSelected],
    (q_err, q_res) => {
      res.json(q_res.rows); 
    })
})

router.get('/api/get/getNewCustomers', (req, res, next) => {
  const monthSelected = req.query.monthSelected;
  pool.query(`SELECT *
              FROM Users
              where date_part('month', date_signup) = $1`, [monthSelected],
    (q_err, q_res) => {
      res.json(q_res.rows);
    })
})

module.exports = router