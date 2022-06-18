import express, {Router, Request, Response, response} from 'express';
import bodyParser from 'body-parser';
import { request } from 'http';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async(req:Request, res:Response) => {
    let imageURL  = req.query.image_url; 
    console.log(imageURL);
    try{
      if (!imageURL){                                                                           // IT SHOULD
        res.send("Invalid! Image URL is needed.");                                              //    1. validate the image_url query
      }
        else{
        filterImageFromURL(imageURL).then((response) => {res.status(200)                                     //    2. call filterImageFromURL(image_url) to filter the image
                                                            .sendFile(response,                              //   3. send the resulting file in the response
                                                              () => {deleteLocalFiles([response]);});        //   4. deletes any files on the server on finish of the response
        })                                                                                                                
      }
  } catch(error){
    res.status(422).send("Unprocessable!");
  }
});
  
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req:Request, res:Response ) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();