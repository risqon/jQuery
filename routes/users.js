var express = require('express');
var router = express.Router();
var moment = require('moment');


module.exports = (db) => {
  //Load Data
  router.get('/', function (req, res) {

    //Search
    let isSearch = false;
    const page = parseInt(req.query.page) || 1;
    const { id, string, integer, float, startDate, endDate, boolean, checkId, checkString, checkInteger, checkFloat, checkDate, checkBoolean } = req.query;
    let query = [];
    if (checkId && id) {
      query.push(`id = '${id}'`);
      isSearch = true;
    }
    if (checkString && string) {
      query.push(`string LIKE '%${string}%'`);
      isSearch = true;
    }
    if (checkInteger && integer) {
      query.push(`integer = ${integer}`);
      isSearch = true;
    }
    if (checkFloat && float) {
      query.push(`float = ${float}`);
      isSearch = true;
    }
    
    if (checkDate && startDate && endDate) {
      query.push(` dated BETWEEN '${startDate}' AND '${endDate}'`);
      isSearch = true;
    }

    if (checkBoolean && boolean) {
      query.push(`boolean = '${boolean}'`);
      isSearch = true;
    }
    

    let search = "";
    if (isSearch) {
      search += `WHERE ${query.join(' AND ')}`;
    
    }
   

    //Pagination
    const limit = 2;
    const offset = (page - 1) * limit;

    let sqlPages = `SELECT COUNT (id) as total FROM laporan ${search}`;
    db.query(sqlPages, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      else if (data.rows[0].total == 0) {
        return res.send(`Data tidak ditemukan`);
      }
      const totalData = parseInt(data.rows[0].total);
      const pages = Math.ceil(totalData / limit);

      let sql = `SELECT * FROM laporan ${search} ORDER BY id LIMIT $1 OFFSET $2`;
      db.query(sql, [limit, offset], (err, data) => {
        if (err) {
          return res.send(err);
        } else if (data.rows == 0) {
          return res.send(`Data tidak ditemukan`);
        }
        else {
          res.status(200).json({
            data: data.rows,
            pages,
            page
          });
        }
      });
    })
  });

  router.get('/:id', function (req, res, next) {
    db.query(`SELECT * FROM laporan WHERE id = ${req.params.id}`, (err, response) => {
      if (err) return res.status(500).json((err))
      //  console.log(response.rows)
      res.json(response.rows)
    })

  });

  router.post('/', function (req, res, next) {
    db.query('INSERT INTO laporan(string,integer,float,date,boolean) VALUES ($1,$2,$3,$4,$5)', [req.body.string, Number(req.body.integer), req.body.float, req.body.date, req.body.boolean],
      (err, response) => {
        if (err) return res.status(500).json((err))

        res.json(response.rows)
      })
  });
  router.put('/:id', function (req, res, next) {
    db.query('UPDATE laporan SET string = $1, integer = $2, float = $3, date = $4, boolean = $5 WHERE id = $6', [req.body.string, Number(req.body.integer), req.body.float, req.body.date, req.body.boolean, Number(req.params.id)],
      (err, response) => {
        if (err) return res.status(500).json((err))

        res.json(response.rows)
      })

  });

  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM laporan WHERE id = $1', [Number(req.params.id)],
      (err, response) => {
        if (err) return res.status(500).json((err))

        res.json(response.rows)
      })
  });

  return router;
}

// 'UPDATE laporan SET string = $1, integer = $2, float = $3, date = $4, boolean = $5  WHERE id = $6', [req.body.string, Number(req.body.integer), req.body.float, req.body.date, req.body.boolean, req.params.id],
// 'INSERT INTO laporan(string,integer,float,date,boolean) VALUES ($1,$2,$3,$4,$5)', [req.body.string,Number(req.body.integer),req.body.float,req.body.date,req.body.boolean],