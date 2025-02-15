
const express =require("express")
const app =express();
const dotenv=require("dotenv")
const mongoose = require("mongoose")
const ShortUrl = require('./models/shortUrl.js')

dotenv.config();
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
var mongoUrl = process.env.DATABASE_URI
connectToDatabase();

async function connectToDatabase() {
    try {
        // Connect to MongoDB using the provided connection string
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    console.log(shortUrls)
    res.render('index', { shortUrls: shortUrls })
  })

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl',async(req,res)=>{
const shortUrl=await ShortUrl.findOne({
    short:req.params.shortUrl})
    if(shortUrl==null)return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    
    res.redirect(shortUrl.full)

})

app.listen(process.env.PORT || 5000)