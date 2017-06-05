var mongoose = require('mongoose');
var storySchema== mongoose.Schema({
	category: String,
	tags: [String],
	title: String,
	body: String,
	author: String,
	created-at : Date,
	verified: Boolean,
	likes : Number,
	comments :[{ 
		comment_message: String,
        comment_time: String,
        comment_by: String
    }]

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Story', storySchema);