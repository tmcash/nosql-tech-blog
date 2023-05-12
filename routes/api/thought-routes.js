const router = require('express').Router();

//the following code creates routes for the methods used.
const { 
    getThoughts, 
    getThoughtById, 
    createThought, 
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router.route('/')
.get(getThoughts);


router.route('/:thoughtId')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought); 


router.route('/:userId')    
.post(createThought);


router.route('/:thoughtId/reactions')
.post(addReaction);


router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;