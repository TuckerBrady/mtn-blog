const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//Update
router.put("/:id", async(req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You do not have permission to update this user");
    }
});

//Delete
router.delete("/:id", async(req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You do not have permission to delete this user");
    }
});

//Get User
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...otherStuff } = user._doc;
        res.status(200).json(otherStuff);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;