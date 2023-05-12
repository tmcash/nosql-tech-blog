const router = require('express').Router();


const {
getUsers,
getUserById,
createUser,
updateUser,
deleteUser,
addFriend,
deleteFriend,
} = require('../../controllers/user-controller');


router
.route('/')
.get(getUsers)
.post(createUser);


router
.route('/:userId')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);


router
.route('/:userId/friends/:friendId')
.put(addFriend)
.delete(deleteFriend);

module.exports = router; 