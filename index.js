const express = require('express');
const cors=require('cors');
 const app = express();
 const port=process.env.PORT || 5000;
 require('dotenv').config()





 //middleware
 app.use(cors());
 app.use(express.json());



//genarrel server 

app.get('/', (req, res) => {
    res.send('doctorsprotal server');
}
)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@474.79d3jxt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//doctors.apoinmentoption

const reun=async()=>{

try{

const apoinmentoptionCollection =client.db("doctors").collection("apoinmentoption")
const bookingCollection = client.db("doctors").collection("bookings")


//get all apoinmentoption 
app.get("/apoinmentoption",async (req, res)=>{
    const date=req.query.date

    const query={};
    const options=await apoinmentoptionCollection.find(query).toArray();
    const bookingquery={trementDate:date}
    const alredybooked=await bookingCollection.find(bookingquery).toArray();

options.forEach(option=>{
  //partyculler date booking
    const optionbook=alredybooked.filter(book=> book.trementName===option.name)

    //find slots
   const optionslots=optionbook.map(bookslot=>bookslot.slot)

   //remening slot
   const  remeningslot=option.slots.filter(slot=>!optionslots.includes(slot))
    option.slots=remeningslot;


   
})
    
   
res.send(options)

})




///post bookings


app.post("/booking",async (req, res)=>{
    const booking =req.body;
    console.log(booking)
    const query={
        trementDate:booking.trementDate,
        email:booking.email,
         trementName:booking.trementName
    }


   const allredybook=await bookingCollection.find(query).toArray();

   if(allredybook.length){
const message=`you have alredy book ${booking.trementDate}`
return res.send({acknowledged:false,message});
   }



    const result=await bookingCollection.insertOne(booking)
    res.send(result);
    
})




}
finally{

}



}
reun().catch(eroo=>console.log(eroo))

