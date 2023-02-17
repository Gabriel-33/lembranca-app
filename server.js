const express = require("express");

const cors = require("cors");

const app = express();

const multer = require('multer')

const mongoose = require('mongoose');

var bodyParser = require('body-parser');

const moment = require('moment');

const { resolve } = require("path");

const fs = require("fs-extra");

app.use(bodyParser.json())

app.use(cors());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("Olá mundo!");
});

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/lembranca', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB...')
  /* MyModel.find({}, (err, docs) => {
    if (err) throw err;
    console.log(docs);
  }); */
}).catch(err => console.log(err));
/* console.log(mongoose); */


const LembrancaSchema = new mongoose.Schema({
  shortId: String,
  lembranca: String,
  dataLembranca: {
    type: Date,
    get: function(value){
      if(value) return moment(value).format("yyyy-MM-dd");
    },
    set: function(value){
      return moment(value).toDate();
    }
  },
  textoLembranca: String,
  imgLembranca:String
});
const Lembranca = mongoose.model('lembranca', LembrancaSchema);

/* const apagar = async() =>{
  await Lembranca.deleteMany({});
}
apagar(); */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/img/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.fileName);
    /* cb(null, file.originalname); */
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb(new Error("Invalid file type. Only jpeg or png"), false);
  }else{
    cb(null, true);
  }
};
const limits = {
  fileSize: 2 * 1024 * 1024,
};

const upload = multer({ storage: storage,fileFilter: fileFilter,limits:limits}).single('image');

async function readData(filepath,resolve) {
  try {
    const data = await fs.readFile(filepath);
    console.log("arquivo lido!");
  } catch (err) {
    console.error(err);
  }
  resolve("arquivo lido!")
}

app.post('/listarLembracas',(req,res) =>{
  Lembranca.find({}, (err, documents) => {
    /* console.log(documents) */
    if (err) {
      res.send(err);
    } else {
      res.json(documents);
    }
  });
});

app.post('/cadastrarLembranca', async(req,res) => {
  var status = 0;
  const start = Date.now();
  await upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.json({message:'Imagem muito grande!. Envie imagens até 2 megas!'});
    }else if (err){
      res.json({message:'Envie somente imagens!'});
    }else{
      const fileSize = parseInt(req.file.size/1024);
      // your upload code
      const end = Date.now();

      const processingTime = end - start;

      const transferStart = Date.now();
      
      const image = await fs.readFile("./src/img/"+req.body.fileName);

      const transferEnd = Date.now();

      const transferTime = transferEnd - transferStart;

      const totalDelay = (processingTime) + 50;

      console.log(`Total delay: ${processingTime + 10} + 50=${totalDelay * 10}ms`);

      const delayPromisse = new Promise((resolve, reject) => {

        setTimeout(() => {
          resolve('I did something async');
        }, totalDelay * 10);

      });
      delayPromisse.then(() =>{

        res.json({message:true});
        
        const lembranca = new Lembranca({
          shortId: req.body.shortId, 
          lembranca: req.body.lembranca,
          dataLembranca: req.body.dataLembranca,
          textoLembranca: req.body.textoLembranca,
          imgLembranca: req.body.fileName 
        });
        lembranca.save().then(() => 
          console.log('User saved!')).catch(error => console.log(error));
      });
    };
  });
});

app.post('/uploadImage',async (req, res,file) => {
  
  const start = Date.now();
  
  await upload(req, res, async function (err) {

    if (err instanceof multer.MulterError) {

      res.json({message:'Imagem muito grande!. Envie imagens até 2 megas!'});

    }else if (err){

      res.json({message:'Envie somente imagens!'});

    }else{
      const fileSize = parseInt(req.file.size/1024);
      // your upload code
      const end = Date.now();

      const processingTime = end - start;

      const transferStart = Date.now();
      
      const image = await fs.readFile("./src/img/"+req.body.fileName);

      const transferEnd = Date.now();

      const transferTime = transferEnd - transferStart;

      const totalDelay = (processingTime) + 40;

      console.log(`Total delay: ${processingTime + 10} + 50=${totalDelay * 10}ms`);

      const delayPromisse = new Promise((resolve, reject) => {

        setTimeout(() => {
          resolve('I did something async');
        }, totalDelay * 10);

      });

      delayPromisse.then(()=>{

        res.send({message:true})
        Lembranca.findOne({ shortId: req.body.shortId }).select('imgLembranca').exec(function (err, data) {
          if (err) {
            // handle error
          } else {
            const pathFile = "./src/img/"+data.imgLembranca;
            fs.unlink(pathFile, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                //file removed
                console.log('file deleted successfully!')
            });
          }
        });
      });
    }
  });
});

app.post('/atualizarLembranca',async (req, res,file) => {
  const result = await Lembranca.findOneAndUpdate({ shortId: req.body.shortId },req.body,{ new:true});
  res.send({message:true});
});

app.post('/excluirLembranca',async (req, res,file) => {
  Lembranca.findOne({ shortId: req.body.shortId }).select('imgLembranca').exec(async function (err, data) {
    if (err) {
      // handle error
      res.send("ok");
    } else {
      const pathFile = "./src/img/"+data.imgLembranca;
      console.log(pathFile)
      try {
        fs.unlink(pathFile, (err) => {
          if (err) {
            console.error(err)
            return
          }
          //file removed
          console.log('file deleted successfully!')
        });
      } catch (error) {
        
      }
      await Lembranca.deleteMany({ shortId: req.body.shortId});
    }
  });
  res.send("ok");
});

  


