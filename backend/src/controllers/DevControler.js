const axios = require('axios');
const Dev = require('../models/Dev');

module.exports= {
    async index(req,res){
        const { user } = req.headers;
        const loggedUser = await Dev.findById(user);
        const devs = await Dev.find({
            $and: [
                {_id: {$ne: user }},
                {_id: {$nin: loggedUser.likes }},
                {_id: {$nin: loggedUser.deslikes }},
            ],
        })

        return res.json(devs);
    },

    async store(req,res){
       const {username} = req.body;
       const response = await axios.get(`https://api.github.com/users/${username}`);
       const userExists = await Dev.findOne({ user: username});

       if (userExists) {
        return res.json(userExists);
       }

       const {name, bio, avatar_url: avatar} = response.data;
       
       const dev =  await Dev.create({
            name,
            user: username,
            bio,
            avatar,
        })

        console.log(`Usuário cadastrado`);
        return res.json(dev);
    }
}