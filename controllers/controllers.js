const mongoose =require('mongoose');
const Poll = mongoose.model('Poll');

exports.homepage = async (req, res) => {
    res.render('home');
};

// go to list of all polls
exports.polls = async (req, res) => {
    const polls = await Poll.find();
    res.render('polls', {
        user: req.user,
        polls,
    });
};

// go to user's list of polls
exports.account = async (req, res) => {
    const polls = await Poll.find({ creator: req.user.name });
    res.render('myPolls', { title: 'My Polls', polls });
};

// go to creation of poll page
exports.createPoll = (req, res) => {
    res.render('createPoll', { title: 'New Poll' });
};

// save created poll
exports.sendPoll = async (req, res) => {
    // get all variables I need
        let creator = '';
    if (req.user.facebook) {
        creator = req.user.facebook.name;
    }else if (req.user.twitter) {
        creator = req.user.twitter.name;
    } else {
        creator = req.user.name;
    }
    const title = req.body.title;
    const array = Object.keys(req.body).map(key => req.body[key]);
    const options = [];
    array.forEach(elt => {
        if (elt !== '') {
            options.push(elt);
        }
        return options;
    });
    const votes = [];
    options.slice(1).forEach(option => {
        votes.push(0);
        return votes;
    });
    // 
    const poll = await new Poll({
        title: title, 
        options: options.slice(1),
        votes,
        creator,
        voters: [],
    }).save();
    res.redirect(`/poll/${poll.slug}`);
};

// go to the page of one poll to vote
exports.getPoll = async (req, res) => {
    const poll = await Poll.findOne({
        $or: [ 
            { _id: req.params.id },
            { slug: req.params.slug }
        ]
    });
    if (!poll) {
        //voir pr une catchError, en attendant:
        res.redirect('/');
    }
    res.render('poll', poll);
};

// delete a poll
exports.delete = async (req, res) => {
    const poll = await Poll.deleteOne({ slug: req.params.slug });
    req.flash('success', 'Poll deleted!');
    res.redirect('/my-polls');
};

// edit a poll
exports.editPoll =  async (req, res) => {
    const poll = await Poll.findOne({ slug: req.params.slug });
    res.render('editPoll', poll);
};
exports.saveEdit = async (req, res) => {
    const options = [];
    req.body.option.forEach(elt => {
        if (elt !== '') {
            options.push(elt);
        }
        return options;
    });
    const newPoll = await Poll.findOneAndUpdate({ slug: req.params.slug}, {
        title: req.body.title,
        creator: req.user.name,
        options: options, 
        },
        { new: true })
        .exec();
    req.flash('success', 'Poll edited!');
    res.redirect('/my-polls');
}

// send vote:
// 2. get index of voter's option
// 3. update
exports.vote = (req, res, next) => {
    const cookie = req.headers.cookie.split('=')[1];
    const option = req.body.option;
    const slug = req.params.slug;
    // Schema.statics
    const indexPromise = Poll.getIndex(slug, option);
    indexPromise.then((data) => {
        // can only $inc a field, not an index so,
        // create an obj = 1 (want to inc by 1)
        // corres to the index of chosen option in votes array
        const votesIndex = {};
        votesIndex[`votes.${data[0].index}`] = 1;
        const updateVotePromise = Poll.findOneAndUpdate(
            { slug: slug },
            { 
                $push: { 'voters': cookie },
                $inc: votesIndex,
            },
            { new: true }
            );
        updateVotePromise.then((data) => {
            // console.log('updated');
            next();
        }).catch(err => {
            if(err)
            console.log('err: ' + err);
        });
    }).catch(err => {
        if(err)
            console.log('err: ' + err);   
    });
};

// display results for one poll
exports.results = async (req, res) => {
    const poll = await Poll.findOne({ _id: req.params.id });
    res.render('results', poll);
};


