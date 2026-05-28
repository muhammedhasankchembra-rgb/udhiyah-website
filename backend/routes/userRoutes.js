const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AnimalConfig = require('../models/AnimalConfig');
const twilio = require('twilio');

// Twilio സെറ്റപ്പ് (നിങ്ങളുടെ ശരിക്കുള്ള SID-യും Token-ഉം ഇവിടെ നൽകാം)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TOKEN';
let client;
if(accountSid !== 'YOUR_SID') {
    client = twilio(accountSid, authToken);
}

// 1. ഉപയോക്താക്കൾക്ക് സ്വയം രജിസ്റ്റർ ചെയ്യാനുള്ള API (Signup)
router.post('/signup', async (req, res) => {
    try {
        const { name, mobileNumber, password, whatsappNumber, address, photoUrl } = req.body;
        
        // നമ്പർ നിലവിലുണ്ടോ എന്ന് നോക്കുന്നു
        const userExists = await User.findOne({ mobileNumber });
        if (userExists) return res.status(400).json({ error: 'ഈ മൊബൈൽ നമ്പർ നിലവിലുണ്ട്.' });

        const newUser = new User({ name, mobileNumber, password, whatsappNumber, address, photoUrl });
        await newUser.save();
        
        res.status(201).json({ message: 'രജിസ്‌ട്രേഷൻ വിജയകരം!', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'രജിസ്റ്റർ ചെയ്യാൻ സാധിച്ചില്ല.' });
    }
});

// 2. ലോഗിൻ ചെയ്യാനുള്ള API (Login)
router.post('/login', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        const user = await User.findOne({ mobileNumber, password });
        
        if (!user) return res.status(400).json({ error: 'തെറ്റായ നമ്പറോ പാസ്‌വേഡോ ആണ്.' });
        
        res.status(200).json({ message: 'ലോഗിൻ വിജയകരം!', user });
    } catch (error) {
        res.status(500).json({ error: 'ലോഗിൻ ചെയ്യാൻ പറ്റിയില്ല.' });
    }
});

// 3. അഡ്മിന് പണം ആഡ് ചെയ്യാനും വാട്സ്ആപ്പ് അയക്കാനുമുള്ള API
router.post('/add-cash', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'യൂസറെ കണ്ടെത്താനായില്ല.' });

        // തുക കൂട്ടുന്നു
        user.amountPaid += Number(amount);
        await user.save();

        // വാട്സ്ആപ്പിലേക്ക് മെസ്സേജ് അയക്കുന്നു (Twilio വഴി)
        if (client && user.whatsappNumber) {
            await client.messages.create({
                from: 'whatsapp:+14155238886', // Twilio Sandbox Number
                to: `whatsapp:+91${user.whatsappNumber}`,
                body: `*ഉളുഹിയ്യത് രസീത്*\n\nഅസ്സലാമു അലൈക്കും ${user.name},\nനിങ്ങളുടെ വിഹിതത്തിലേക്ക് ₹${amount} ലഭിച്ചിരിക്കുന്നു. ഇതുവരെ നൽകിയ ആകെ തുക: ₹${user.amountPaid}.\n\nഅല്ലാഹു സ്വീകരിക്കട്ടെ!`
            });
        } else {
            console.log(`WhatsApp Alert: ₹${amount} received from ${user.name}. (Twilio not configured)`);
        }

        res.status(200).json({ message: 'തുക ചേർത്തു, രസീത് വാട്സ്ആപ്പിലേക്ക് അയച്ചു!', user });
    } catch (error) {
        res.status(500).json({ error: 'തുക ചേർക്കാൻ സാധിച്ചില്ല.' });
    }
});

// 4. ഡാഷ്‌ബോർഡ് സമ്മറി API
router.get('/summary', async (req, res) => {
    try {
        const users = await User.find().sort({ date: -1 });
        const totalFund = users.reduce((sum, user) => sum + user.amountPaid, 0);
        const config = await AnimalConfig.findOne();
        const pricePerAnimal = config ? config.pricePerAnimal : 35000;

        res.status(200).json({ users, totalFund, pricePerAnimal });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching summary' });
    }
});

// 5. അഡ്മിൻ പ്രൈസ് സെറ്റിംഗ്സ്
router.post('/set-animal-price', async (req, res) => {
    try {
        const { price } = req.body;
        let config = await AnimalConfig.findOne();
        if (config) config.pricePerAnimal = price;
        else config = new AnimalConfig({ pricePerAnimal: price });
        await config.save();
        res.status(200).json({ message: 'വില പുതുക്കി!', config });
    } catch (error) {
        res.status(500).json({ error: 'Error saving price' });
    }
});

// 6. അഡ്മിൻ ലോഗിൻ API
router.post('/admin-login', (req, res) => {
    const { password } = req.body;
    // അഡ്മിൻ പാസ്‌വേഡ് ഇവിടെ സെറ്റ് ചെയ്യാം (ഉദാഹരണത്തിന്: admin@123)
    if (password === 'admin@123') {
        res.status(200).json({ message: 'അഡ്മിൻ ലോഗിൻ വിജയകരം!' });
    } else {
        res.status(400).json({ error: 'തെറ്റായ പാസ്‌വേഡ്!' });
    }
});

// 7. വിവരങ്ങൾ എഡിറ്റ് ചെയ്യാനുള്ള API
router.put('/edit-user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'വിവരങ്ങൾ വിജയകരമായി പുതുക്കി!', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'എഡിറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.' });
    }
});
module.exports = router;