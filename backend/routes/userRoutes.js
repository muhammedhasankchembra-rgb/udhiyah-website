const express = require('express');
const router = express.Router();
const User = require('../models/User'); // നിങ്ങളുടെ മോഡൽ ഫയലിന്റെ പാത്ത്

// 1. എല്ലാ കോൺട്രിബ്യൂട്ടർമാരെയും കാണാൻ (Admin Panel-ൽ കാണിക്കാൻ)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "ആളുകളുടെ ലിസ്റ്റ് എടുക്കാൻ സാധിച്ചില്ല" });
    }
}

// 2. പുതിയ ആളുകളെ അഡ്മിൻ പാനൽ വഴി നേരിട്ട് ആഡ് ചെയ്യാൻ
router.post('/users/add', async (req, res) => {
    try {
        const { name, mobile, address, amount } = req.body;
        const newUser = new User({ name, mobile, address, amount });
        await newUser.save();
        res.json({ message: "പുതിയ ആളെ വിജയകരമായി ചേർത്തു!" });
    } catch (err) {
        res.status(400).json({ error: "ആളെ ചേർക്കാൻ സാധിച്ചില്ല (മിക്കവാറും മൊബൈൽ നമ്പർ നിലവിലുള്ളതാകാം)" });
    }
});

// 3. ഒരാളുടെ ക്യാഷ് മാത്രം എഡിറ്റ് ചെയ്യാൻ (Edit Amount)
router.put('/users/:id/amount', async (req, res) => {
    try {
        const { amount } = req.body;
        await User.findByIdAndUpdate(req.params.id, { amount: amount });
        res.json({ message: "തുക വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!" });
    } catch (err) {
        res.status(400).json({ error: "തുക മാറ്റാൻ സാധിച്ചില്ല" });
    }
});

// 4. ഒരാളെ ലിസ്റ്റിൽ നിന്നും പൂർണ്ണമായി ഒഴിവാക്കാൻ (Remove User)
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "അംഗത്തെ വിജയകരമായി ഒഴിവാക്കി!" });
    } catch (err) {
        res.status(400).json({ error: "ഒഴിവാക്കാൻ സാധിച്ചില്ല" });
    }
});

// 5. വെബ്‌സൈറ്റിന്റെ മെയിൻ പേജിലെ ടോട്ടൽ കണക്കുകൾ കാണിക്കാൻ (Summary)
router.get('/summary', async (req, res) => {
    try {
        const users = await User.find();
        const totalAmount = users.reduce((sum, user) => sum + (user.amount || 0), 0);
        const totalUsers = users.length;
        res.json({ totalAmount, totalUsers, users });
    } catch (err) {
        res.status(500).json({ error: "കണക്കുകൾ ലോഡ് ചെയ്യാൻ സാധിച്ചില്ല" });
    }
});

module.exports = router;