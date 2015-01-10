var ActiveSmash = require('./index');
var assert = require('assert');
var smashify = ActiveSmash(require('mongosmash')(require('nedb')));
var test = require('tap').test;

function Thing() {}

smashify(Thing);

test('promises', function (t) {
  t.plan(5);

  var thing = new Thing();

  thing.foo = 5;
  thing.bar = 6;

  var id;

  thing.create()
  .then(function(result) {
    id = result._id;
    t.equal(result.foo, 5, 'create');
    t.equal(result.bar, 6, 'create');
    result.foo = 8;
    return result.save();
  })
  .then(function() {
    t.pass('save');
    return Thing.find({_id: id});
  })
  .then(function(results) {
    t.equal(results[0].foo, 8, 'find');
    return results[0].delete();
  })
  .then(function() {
    return Thing.find({_id: id});
  })
  .then(function(results) {
    t.equal(results.length, 0, 'delete');
  })
  .catch(function(e){
    t.error(e);
    t.end();
  });
});

test('callbacks', function (t) {
  t.plan(10);

  var thing = new Thing();

  thing.foo = 5;
  thing.bar = 6;

  var id;

  thing.create(function (err, result) {
    t.error(err, 'no err');

    id = result._id;
    t.equal(result.foo, 5, 'create');
    t.equal(result.bar, 6, 'create');
    result.foo = 8;

    result.save(function (err) {
      t.error(err, 'no err');

      t.pass('save');

      Thing.find({_id: id}, function(err, results) {
        t.error(err, 'no err');

        t.equal(results[0].foo, 8, 'find');
        results[0].delete(function(err) {
          t.error(err, 'no err');
          Thing.find({_id: id},function(err, results) {
            t.error(err, 'no err');
            t.equal(results.length, 0, 'delete');
          });
        });
      });
    });
  });
});
