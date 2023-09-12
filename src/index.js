const express = require('express')
const app = express()
const port = 3000
const {areas, getBrands, getAllAreas, areasByBrands} = require('./database')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/area', async (req, res) => {
    const {area_id, fromDate, toDate} = req.body

    try {
        const area = await areas(area_id, fromDate, toDate)
        res.json({status: 'success', data:area, msg:[]})
        
    } catch (error) {
        res.status(500).json({ status: 'fail', msg: 'An error occurred' })
    }
})

app.post('/area_by_brand', async (req, res) => {
    const {area_id, fromDate, toDate} = req.body

    try {
        const area = await areasByBrands(area_id, fromDate, toDate)

        const groupedData = area.reduce((result, item) => {
            // Use the 'category' property as the grouping key
            const key = item.area_name;
          
            // If the key doesn't exist in the result, create an array for it
            if (!result[key]) {
              result[key] = [];
            }
          
            // Push the item to the corresponding group
            result[key].push(item);
          
            return result;
          }, {});
          

        res.json({status: 'success', data:groupedData, msg:[]})
        
    } catch (error) {
        res.status(500).json({ status: 'fail', msg: 'An error occurred' })
    }
})

app.get('/brand', async (req, res) => {
    try {
        const brand = await getBrands()
        res.status(201).json({status:'success', data: brand, msg: []})
    } catch (error) {
        res.status(500).json({ status: 'fail', msg: 'An error occurred' })
    }
})

app.get('/all_area', async (req, res) => {
    try {
        const brand = await getAllAreas()
        res.status(201).json({status:'success', data: brand, msg: []})
    } catch (error) {
        res.status(500).json({ status: 'fail', msg: 'An error occurred' })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})