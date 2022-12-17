const { ObjectId } = require('mongoose').Types;
const { Thought } = require('../models');



module.exports = {
  // Get all thought
  getThoughts(req, res) {
    Thought.find()
      .then(thoughts => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(thought => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought 
  deleteThought(req, res) {
    // attempt to find and delete a thought by id
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        // if the thought is not found: return error message
        !thought
          ? res.status(404).json({ message: 'No such thought exists' })
          // if thought is found: use the "thought.username" to find and update the user => "pull" the "thought.id" from the "thoughts" array
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: thought._id } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought deleted, but no user found',
            })
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //alexis start here
// create a new reaction
createReaction(req, res) {
  Thought.create(req.body)
    .then((reaction) => res.json(reaction))
    .catch((err) => res.status(500).json(err));
},
// Delete a reaction 
deleteReaction(req, res) {
  // attempt to find and delete a thought by id
  Reaction.findOneAndRemove({ _id: req.params.reactionId })
    .then((reaction) =>
      // if the reaction is not found: return error message
      !reaction
        ? res.status(404).json({ message: 'No such reaction exists' })
        // // if thought is found: use the "thought.username" to find and update the user => "pull" the "thought.id" from the "thoughts" array
        //alexis 12/17/22 we don't really n eed this below since already handled in thought but this is requiring :
        : User.findOneAndUpdate(
            { username: reaction.username },
            { $pull: { reactions: reaction._id } },
            { new: true }
          )
    )
    // .then((user) =>
    //   !user
    //     ? res.status(404).json({
    //         message: 'Thought deleted, but no user found',
    //       })
    //     : res.json({ message: 'Thought successfully deleted' })
    // )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},

};