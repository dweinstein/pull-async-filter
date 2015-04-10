# SYNOPSIS

A through stream that removes items with an async filter.

# USAGE

```javascript
var remove = require('pull-async-filter');
var pull = require('pull-stream');

function should(v, cb) {
  setTimeout(function () {
      cb(null, v === 10);
  });
}

pull(
  pull.values([10, 10, 30, 10]),
  remove(should),
  sum(function (err, value) {
    console.log(value); // 30
  })
);

```

