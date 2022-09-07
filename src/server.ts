import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    let { image_url } = req.query;
    if (!image_url) {
      res.status(400).send("Error: Empty image url");
    } else {
      await filterImageFromURL(image_url).then(function (filtered_path) {
        res.sendFile(filtered_path, () => {
          deleteLocalFiles([filtered_path]);
        });
      }).catch(function (error) {
        res.status(400).send('Error:' + error);
      });

    }
  });

  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();