import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../app.js";

export async function sendConnection(req, res) {
    try {
        let { id } = req.params;
        let sender = req.userId;

        let user = await User.findById(sender);

        if (sender === id) {
            return res.status(400).json({ message: "you cannot send connection to yourself" });
        }

        if (user.connection.includes(id)) {
            return res.status(400).json({ message: "connection already exists" });
        }

        let existingConnection = await Connection.findOne({
            sender,
            reciever: id,
            status: "pending"
        });

        if (existingConnection) {
            return res.status(400).json({ message: "connection already exists" });
        }

        let newRequest = await Connection.create({
            sender,
            reciever: id
        });

        let recieverSocketId = userSocketMap.get(id);
        let senderSocketId = userSocketMap.get(sender);

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", {
                updatedUserId: sender,
                newStatus: "received"
            });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: id,
                newStatus: "pending"
            });
        }

        return res.status(200).json(newRequest);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export const acceptConnection = async (req, res) => {
    try {
        let { connectionId } = req.params;
        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection not found" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: "request under process" });
        }

        connection.status = "accepted";
        await connection.save();

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender }
        });

        await User.findByIdAndUpdate(connection.sender, {
            $addToSet: { connection: req.userId }
        });

        let recieverSocketId = userSocketMap.get(connection.reciever.toString());
        let senderSocketId = userSocketMap.get(connection.sender.toString());

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", {
                updatedUserId: connection.sender.toString(),
                newStatus: "disconnect"
            });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: req.userId,
                newStatus: "disconnect"
            });
        }

        return res.status(200).json({ message: "connection accepted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const rejectConnection = async (req, res) => {
    try {
        let { connectionId } = req.params;
        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection not found" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: "request under process" });
        }

        connection.status = "rejected";
        await connection.save();

        return res.status(200).json({ message: "connection rejected" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getConnections = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        let currentUser = await User.findById(currentUserId);
        if (currentUser.connection.includes(targetUserId)) {
            return res.json({ status: "disconnect" });
        }

        const pendingRequests = await Connection.findOne({
            $or: [
                { sender: currentUserId, reciever: targetUserId, status: "pending" },
                { sender: targetUserId, reciever: currentUserId, status: "pending" }
            ]
        });

        if (pendingRequests) {
            if (pendingRequests.sender.toString() === currentUserId) {
                return res.json({ status: "pending" });
            } else {
                return res.json({ status: "received", requestId: pendingRequests._id });
            }
        }

        return res.json({ status: "connect" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        let recieverSocketId = userSocketMap.get(otherUserId);
        let senderSocketId = userSocketMap.get(myId);

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", {
                updatedUserId: myId,
                newStatus: "connect"
            });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: otherUserId,
                newStatus: "connect"
            });
        }

        await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
        await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

        res.status(200).json({ message: "connection removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await Connection.find({ reciever: userId, status: "pending" })
            .populate("sender", "firstName lastName profilePic headline");

        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("connection", "firstName lastName profilePic headline");

        return res.status(200).json(user.connection);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};