const express = require('express');
 const cors = require('cors');
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()
 const app = express();
 const port = process.env.PORT || 5000;


//  middleware
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
 app.use(express.json());


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e1mdmag.mongodb.net/?retryWrites=true&w=majority`;
 
 // Create a MongoClient with a MongoClientOptions object to set the Stable API version
 const client = new MongoClient(uri, {
   serverApi: {
     version: ServerApiVersion.v1,
     strict: true,
     deprecationErrors: true,
   }
 });
 
 async function run() {
   try {
     // Connect the client to the server	(optional starting in v4.7)


// collection here 
const ToyCollection = client.db('ToyZone').collection('Products');

// category collection
const TabCollection = client.db('ToyZone').collection('TabProducts')



 // search field 
app.get('/searchByToyName/:text', async (req, res) => {
  const searchText = req.params.text;
  const result = await ToyCollection.find({
    name: { $regex: searchText, $options: "i" }
  }).toArray();
  res.send(result);
});



// ShopCategory Get data
app.get('/shop', async(req,res)=>{
  const cursor = TabCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

// Shop category data post server side
app.post('/postCategoryZone',async(req,res)=>{
  const body =req.body;
  const result= await TabCollection.insertOne(body)
  res.send(result)
  console.log(body);
})



 
// 1st get the data
app.get('/Products',async(req,res)=>{
const cursor = ToyCollection.find();
const result = await cursor.toArray();
res.send(result);
})



// data post to the server side
app.post('/postToyZone', async(req,res)=>{
  const body =req.body;
  const result =await ToyCollection.insertOne(body);
  res.send(result)
  console.log(body);
})


 // data get and show data in ui 
app.get('/allProducts', async(req,res)=>{
  const result= await ToyCollection.find({}).limit(20).toArray();
  res.send(result)
})




// Load specific data and sort in ascending order based on price
app.get('/postToyZone', async (req, res) => {
  console.log(req.query);
  let query = {};
  if (req.query?.email) {
    query = { sellerEmail: req.query.email };
  }
  const result = await ToyCollection.find(query).sort({ price: 1 }).toArray();

  // Convert the "price" field to a numeric type for correct sorting
  const sortedResult = result.map((toy) => ({
    ...toy,
    price: parseFloat(toy.price),
  }));

  // Sort the array based on the numeric "price" field in ascending order
  sortedResult.sort((a, b) => a.price - b.price);

  res.send(sortedResult);
});



// update Data by using put request
app.get('/allProducts/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)}
  const result = await ToyCollection.findOne(query);
  res.send(result)
})

app.put('/allProducts/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)}
const options = {upsert:true}
const updatedToys= req.body;
  const updateToyData ={
    $set:{
      description:updatedToys.description,
       quantity:updatedToys.quantity,
        price:updatedToys.price
  
    }
  }
  const result= await ToyCollection.updateOne(query,updateToyData,options)
  res.send(result);
})





// HandleDelete data
app.delete('/postToyZone/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await ToyCollection.deleteOne(query);
  res.send(result)

})



     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
    //  await client.close();
   }
 }
 run().catch(console.dir);
 


















 app.get('/', (req,res)=>{
    res.send('server is running ')
 })





 app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
 })