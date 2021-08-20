const router = require("express").Router();
const noteController = require("../controllers/noteContoller");
const withAuth = require("../middlewares/authMiddleware");

router.get("/notes", withAuth, noteController.getAllNotes);

router.post("/notes", withAuth, noteController.createNote);

router.patch("/notes", withAuth, noteController.updateNote);

router.delete("/notes", withAuth, noteController.deleteNote);

module.exports = router;
