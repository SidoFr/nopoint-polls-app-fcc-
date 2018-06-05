// **** file with datas and fn I can use in templating ****

// Dump is a handy debugging fn we can use to sort of "console.log" our data in templates
// pre=h.dump(locals) to see locals
exports.dump = (obj) => JSON.stringify(obj, null, 2);