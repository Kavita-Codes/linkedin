import express from "express"
import { acceptConnection, getConnectionRequest, getConnections, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controller.js";
import { isAuth } from "../middleware/isAuth.js";


let connectionRouter = express.Router()

connectionRouter.post("/send/:id" ,isAuth, sendConnection)
connectionRouter.put("/send/:connectionId" ,isAuth, acceptConnection)
connectionRouter.put("/reject/:connectionId" , isAuth , rejectConnection )
connectionRouter.post("/get-status/:userId", isAuth, getConnections)
connectionRouter.get("/get-status/:userId", isAuth, getConnections)
connectionRouter.delete("/remove/:userId", isAuth, removeConnection)
connectionRouter.get("/requests" ,isAuth , getConnectionRequest)
connectionRouter.get("/" , isAuth , getUserConnections)




export default connectionRouter;