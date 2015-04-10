var pull = require('pull-stream');

//
// should is a function that returns true if the item should be removed
//
module.exports = function remove(should) {

  return pull(
    pull.asyncMap(function (v, cb) {
      should(v, function (err, res) {
        if (res) {
          return cb(null, undefined);
        }
        return cb(err, v);
      });
    }),
    pull.filter()
  );

};

