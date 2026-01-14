import { Router } from "express";
import { v4 as uuid } from "uuid";
import store from "../store/memory.store";

const router = Router();

router.post("/", (req, res) => {
  const roomId = uuid();
  store.rooms.set(roomId, {
    id: roomId,
    users: [],
    status: "lobby",
    hostId: roomId
  });

  res.json({ roomId });
});

router.get("/:roomId/summary", (req, res) => {
  const room = store.rooms.get(req.params.roomId);
  res.json(room);
});

export default router;
