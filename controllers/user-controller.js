const { User, Thought } = require("../models");

module.exports = {
// these functions get users, single user, create user, delete user, and update user
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
        .select('-__v')

        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user)

        )
        .catch((err) => res.status(500).json(err));
    },
    
    createUser(req, res) {

        User.create(req.body)

        .then((dbUserData) => res.json(dbUserData))

        .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {

        User.findOneAndDelete({ _id: req.params.id })

        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and their thoughts deleted' }))
        .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {


        User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
        )

        .then((user) =>
            !user
            ? res.status(404).json({ message: "No User with this ID!" })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // these functions add friend, delete friend
    
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId  } }, (err, result) => {
        if (result) {
            res.status(200).json(result);
            console.log(`Added: ${result}`);
        } 
        
        else {
            console.log('Seems like something went wrong');
            res.status(500).json({ message: 'something went wrong' });
        }
    });
    },
    
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $pull: { friends: params.friendId }},
            { new: true }
        )
        .populate({
            path: 'friends', 
            select: '-__v'
        })
        .select('-__v')
        .then(user => {
            if(!user) {
                res.status(404).json({ message: 'No User found with that id.'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.status(400).json(err));
    }

};