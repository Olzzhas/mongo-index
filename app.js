const express = require('express')
const mongoose =  require('mongoose')
const mongodb = require('mongodb')

const app = new express()

const start = async() => {
    try{
        await app.listen(5000, ()=> {
            console.log('Server started on port 5000...');
        })
    
        await mongoose.connect('mongodb+srv://olzzhas:olzzhas@cluster0.vszl1s1.mongodb.net/?retryWrites=true&w=majority').then(()=>{
            console.log('Database connected successfully...');
        })
    }catch(error){
        console.log(error);
    }
}

start()

const dataSchema = new mongoose.Schema({
    title: {type: String},
    tradeAmount: {type: String},
    averageStar: {type: Number},
    wishedCount: {type: Number},
    quantity: {type: Number},
    AverageDiscountPrice: {type: Number},
    MinDiscountPrice: {type: Number},
    MaxDiscountPrice: {type: Number},
})

const dataModel = new mongoose.model('aliexpress', dataSchema)

app.get('/explain', async(req, res)=>{

    const data = await dataModel.find().explain();

    return res.json({data})
})


app.get('/averageDiscountPrice', async(req, res)=>{
    const averageDiscountPipeline = [
        {
          $group: {
            _id: null,
            averageDiscountPrice: { $avg: "$AverageDiscountPrice" },
          },
        },
      ];
      
      const data = await dataModel.aggregate(averageDiscountPipeline);

    return res.json({data})
})

app.get('/wishedCountPipeline', async(req, res)=>{
    const wishedCountPipeline = [
        {
            $match: {
            wishedCount: { $gt: 10 },
            },
        },
    ];
      
    const data = await dataModel.aggregate(wishedCountPipeline);
    return res.json({data})
})

app.get('/averageQuantityPipeline', async(req, res)=>{
    const averageQuantityPipeline = [
        {
          $group: {
            _id: "$title",
            averageQuantity: { $avg: "$quantity" },
          },
        },
    ];
      
      const data = await dataModel.aggregate(averageQuantityPipeline);
    return res.json({data})
})

app.get('/minMaxDiscountPricePipeline', async(req, res)=>{
    const minMaxDiscountPricePipeline = [
        {
          $group: {
            _id: "$title",
            minDiscountPrice: { $min: "$MinDiscountPrice" },
            maxDiscountPrice: { $max: "$MaxDiscountPrice" },
          },
        },
      ];
      
      const data = await dataModel.aggregate(minMaxDiscountPricePipeline);
      
    return res.json({data})
})