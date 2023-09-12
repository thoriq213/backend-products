const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'area'
})

const cekConn = db.getConnection((err) => {
    if (err) {
      console.error('Error koneksi ke MySQL: ' + err.stack);
      return;
    }
    console.log('Berhasil terhubung ke MySQL');
  })

   async function areas(area_id, from, to){

    const conn = await cekConn

    let sql = `SELECT c.area_name, SUM(a.compliance) AS total_compliance, COUNT(a.report_id) AS total_report, ((SUM(a.compliance) / COUNT(a.report_id)) * 100) AS percentage from report_product AS a INNER JOIN store AS b ON a.store_id = b.store_id INNER JOIN store_area AS c ON b.area_id = c.area_id`
    let where = ''

    if(area_id && from && to){
        sql += ` WHERE b.area_id IN(?) AND a.tanggal BETWEEN ? AND ?`
        where = [area_id, from, to]
    } else if(area_id){
        sql += ` WHERE b.area_id IN(?)`
        where = [area_id]
    } else if(from && to){
        sql += ` WHERE a.tanggal BETWEEN ? AND ?`
        where = [from, to]
    }

    sql += ` GROUP BY b.area_id`

    try {
        const [rows] = await conn.query(sql, where)
        return rows
    } catch (error) {
        return error
    }
  }

  async function areasByBrands(area_id, from, to){

    const conn = await cekConn

    let sql = `SELECT c.area_name, SUM(a.compliance) AS total_compliance, COUNT(a.report_id) AS total_report, ((SUM(a.compliance) / COUNT(a.report_id)) * 100) AS percentage, d.brand_id, e.brand_name from report_product AS a INNER JOIN store AS b ON a.store_id = b.store_id INNER JOIN store_area AS c ON b.area_id = c.area_id INNER JOIN product AS d ON a.product_id = d.product_id INNER JOIN product_brand AS e ON d.brand_id = e.brand_id`
    let where = ''

    if(area_id && from && to){
        sql += ` WHERE b.area_id IN(?) AND a.tanggal BETWEEN ? AND ?`
        where = [area_id, from, to]
    } else if(area_id){
        sql += ` WHERE b.area_id IN(?)`
        where = [area_id]
    } else if(from && to){
        sql += ` WHERE a.tanggal BETWEEN ? AND ?`
        where = [from, to]
    }

    sql += ` GROUP BY b.area_id, d.brand_id`

    try {
        const [rows] = await conn.query(sql, where)
        return rows
    } catch (error) {
        return error
    }
  }

  async function getBrands(){
    const conn = await cekConn

    let sql = 'SELECT * FROM product_brand'

    try {
        const [rows] = await conn.query(sql)
        return rows
    } catch (error) {
        return error
    }
  }

  async function getAllAreas(){
    const conn = await cekConn

    let sql = 'SELECT * FROM store_area'

    try {
        const [rows] = await conn.query(sql)
        return rows
    } catch (error) {
        return error
    }
  }

  module.exports = {
    areas,
    getBrands,
    getAllAreas,
    areasByBrands
  }