const { Thought, User } = require('../models');



module.exports= {
  // Get all Thoughts
getThoughts(req, res) {
    Thought.find()
    .then((thoughts) => res.json(thoughts))          
    .catch((err) => res.status(500).json(err));
},


// These functions look up a single thought and create new thoughts

getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .then((thought) =>
    !thought
    ? res.status(404).json({ message: 'No thought with that ID' })
    : res.json(thought)
)
.catch((err) => res.status(500).json(err));
},


createThought({ params, body}, res) {
    Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id }},
        { new: true, runValidators: true }
        );
    })
    .then((thought) =>
    !thought
    ? res.status(404).json({ message: 'No thought with that ID' })
    : res.json(thought)
    )
    .catch(err => res.json(err)); 
},


updateThought(req, res) {
    Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
    )
    .populate({
    path: 'reactions',
    select: '-__v'
    })
    .then((thought) =>
    !thought
        ? res.status(404).json({ message: 'No thought with that id' })
        : res.json(thought)
)
.catch((err) => res.status(500).json(err));
},



deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })

    .then((thought) => {
    if (!thought) {
    return res.status(404).json({ message: 'That Thought does not exist' });
    }

    return User.findOneAndUpdate(
    { thoughts: req.params.thoughtId },
    { $pull: { thoughts: req.params.thoughtId } },
    { new: true }
    );
    })

    .then((user) => {
    if (!user) {
return res.status(404).json({
    message: 'Thought deleted, but no users found',
    });
}

return res.json({ message: 'Thought successfully deleted!' });
})
.catch((err) => {
console.log(err);
    res.status(500).json(err);
});
},


addReaction(req, res) {
Thought.findOneAndUpdate(
{ _id: req.params.thoughtId },
{ $push: { reactions: req.body } },
{ runValidators: true, new: true }
    )

    .populate({
    path: 'reactions',
    select: '-__v'
})
.then((thought) =>
!thought
? res.status(404).json({ message: 'No thought with that ID' })
: res.json(thought)
)
.catch((err) => res.status(500).json(err));
},



deleteReaction( req, res) {
    Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { runValidators: true, new: true }

    )
    
    .then((thought) =>
    !thought
    ? res.status(404).json({ message: 'No thought with that ID' })
    : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},
};