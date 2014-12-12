var ActiveSmash = require('./index');
var assert = require('assert');
var smashify = ActiveSmash(require('mongosmash')(require('nedb')));

function Thing() {}

smashify(Thing);

var t = new Thing();

t.foo = 5;
t.bar = 6;

var id;

t.create()
.then(function(result) {
  id = result._id;
  assert.equal(result.foo, 5);
  assert.equal(result.bar, 6);
  result.foo = 8;
  return result.save();
})
.then(function() {
  return Thing.find({_id: id});
})
.then(function(results) {
  assert.equal(results[0].foo, 8);
  return results[0].delete();
}).then(function() {
  console.log('it all works!');
}).catch(function(e){
  console.error(e.stack);
});
