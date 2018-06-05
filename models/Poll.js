const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

const pollSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    options: [String],// options & votes: same length
    votes: [Number],// so that i can inc votes at the good index
    slug: String,
    creator: String,
    voters: [String],
});

// create a slug and save it 
pollSchema.pre('save', async function(next) {
    this.slug = slug(this.title);
    const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const pollSlug = await this.constructor.find({ slug: slugRegex });
    // if already a poll with this title
    // add a nb to it
    if (pollSlug.length) {
        this.slug = `${this.slug} - ${pollSlug.length + 1}`;
    }
    next();
});

// get index of the option I search
pollSchema.statics.getIndex = function (slug, option) {
    return this.aggregate(
        [
            { $match: { 'slug': slug} },
            { 
                $project: {
                    index: { $indexOfArray: ["$options", option] },
                }
            }
        ]
    );
};


module.exports = mongoose.model('Poll', pollSchema);

