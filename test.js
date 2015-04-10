var pull = require('pull-stream');
var test = require('tape');
var delay = require('pull-delay');

var remove = require('./index');


function cache(initial) {

  var _cache = initial || {};

  function _has(k, cb) {
    process.nextTick(function() {
      return cb(null, _cache[k] ?
                true :
                false);
    });
  }

  function _del(k, cb) {
    cb = cb || function() {};
    process.nextTick(function() {
      delete _cache[k];
      cb(null);
    });
  }


  return {
    has: _has,
    del: _del
  };
}

var c = cache({10: true});

function curry (fun) {
  return function () {
    var args = [].slice.call(arguments);
    return function (read) {
      args.unshift(read);
      return fun.apply(null, args);
    };
  };
}

var sum = curry(function (read, done) {
  var total = 0;
  read(null, function next (end, data) {
    if(end) return done(end === true ? null : end, total);
      total += data;
    read(null, next);
  });
});

test('test the sum should not include first 10', function (t) {
  setTimeout(function() {
    c.del(10);
  }, 250);

  pull(
    pull.values([10, 10, 30, 10]),
    delay(200),
    remove(c.has),
    sum(function (err, value) {
      t.equal(value, 50);
      t.end();
    })
  );

});
