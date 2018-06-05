// error with routes
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}
// fn to catch error when using async await
exports.catchErrors = (fn) => {
    return function(req, res, next) {
      return fn(req, res, next).catch(next);
    };
  };
// handle errors in dev env
// ***********fn from WES BOS course learnNode, so useful!!************************************
// err.stack get or set error stack as a string
exports.devErrors = (err, req, res, next) => {
    err.stack = err.stack || '';
    const errorDetails= {
        message: err.message,
        status: err.status,
        stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
    };
    res.status(err.status || 500);
    res.format({
        // Accept http header
        'text/html': () => {
            res.render('error', errorDetails); // if form submit
        },
        'application/json': () => res.json(errorDetails),// if ajax
    });
};

exports.prodErrors = (err, req, res, next) => {
    res.status(err.stauts || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
};