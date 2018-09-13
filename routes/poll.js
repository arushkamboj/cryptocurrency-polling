const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote')

const Pusher = require('pusher');

 pusher = new Pusher({
    appId: '598481',
    key: 'ca9608fb609a707707ec',
    secret: '48555526e3989e845103',
    cluster: 'us2',
    encrypted: true
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes} ));
});

router.post('/', (req, res) => {
    const newVote = {
        crypto: req.body.crypto,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('crypto-poll', 'crypto-vote', {
            crypto: vote.crypto,
            points: parseInt(vote.points)
        });
    
        return res.json({success: true, message: 'Thank you for voting!'})
    });

    //update total votes on submit
    //Vote.find().then(votes => res.json({ success: true, votes: votes} ));

});

module.exports = router;