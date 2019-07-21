import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // GET /filteredimage?image_url={{URL}}
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage/", async (req, res) => {
    let image_url = req.query.image_url;

    const imageValidator = String(image_url).includes('.png')  || String(image_url).includes('.jpg') ||
                           String(image_url).includes('.jpeg') || String(image_url).includes('.bmp') && 
                           !String(image_url).includes('http');

    if(!imageValidator) {
      res.status(400).send('Image url invalid');
    }

    const filteredImage = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredImage, err =>{
      if(err){
        res.status(404).send(err)
      }
      deleteLocalFiles([filteredImage]);
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();