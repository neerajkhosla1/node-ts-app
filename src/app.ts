import express from 'express'

import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import * as bodyParser from 'body-parser'
import cors from "cors";
import { userRoutes } from './user.controller';
import { ContainerTypes, ExpressJoiError } from 'express-joi-validation'

class App {
  private httpServer: any

  constructor() {
    const options = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: '*',
      preflightContinue: false
    };
    this.httpServer = express()
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
    this.httpServer.use(cors(options));
    this.httpServer.use(userRoutes);
    this.httpServer.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.httpServer.use((err: any|ExpressJoiError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      // ContainerTypes is an enum exported by this module. It contains strings
      // such as "body", "headers", "query"...
      if (err) {
        const e: ExpressJoiError = err
        // e.g "you submitted a bad query paramater"
        res.status(400).end(`You submitted a bad ${e.type} paramater`)
      } else {
        res.status(500).end('internal server error')
      }
    })
  }

  public Start = (port: number) => {
    return new Promise((resolve, reject) => {

      this.httpServer.listen(
        port,
        () => {
          resolve(port)
        })
        .on('error', (err: object) => reject(err));
    })
  }
}

export default App;
