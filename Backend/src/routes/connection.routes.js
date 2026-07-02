import express from "express"
import { acceptConnection, getConnectionRequest, getConnections, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controller.js";
import { isAuth } from "../middleware/isAuth.js";


let connectionRouter = express.Router()

connectionRouter.get("/send/:id" ,isAuth, sendConnection)
connectionRouter.get("/send/:connectionId" ,isAuth, acceptConnection)
connectionRouter.get("/reject/:connectionId" , isAuth , rejectConnection )
connectionRouter.get("/get-status/:userId", getConnections)
connectionRouter.get("/remove/:userId", isAuth, removeConnection)
connectionRouter.get("/requests" ,isAuth , getConnectionRequest)
connectionRouter.get("/" , isAuth , getUserConnections)




export default connectionRouter;