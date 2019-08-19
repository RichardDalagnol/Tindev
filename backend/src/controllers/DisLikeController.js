const Dev = require('../models/Dev');

module.exports = {
    async store(req,res) {
        const { DevId } = req.params;
        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(DevId);
        
        if (!targetDev) {
            return res.status(400).json({ error: "Dev not exists" });
        }

        loggedDev.deslikes.push(targetDev._id);

        await loggedDev.save();
        
        return res.json(loggedDev);
    }

}