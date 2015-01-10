# ActiveSmash

> "It's like a polo shirt for your ideas."
>                   -- [Walken on Rails](http://collectiveidea.com/blog/archives/2012/04/01/walken-on-rails/)

ActiveSmash is an ActiveRecord-esque layer on top of [MongoSmash](https://github.com/bengl/mongosmash). You'll love it if you love [Mongoose](http://mongoosejs.com/) or [Rails ActiveRecord](https://github.com/rails/rails/tree/master/activerecord). Also it's **really** small, since it defers most of its magic to MongoSmash.

## Example

Here's a contrived and kind of nonsense example, derived from the test code.

```javascript
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

// declare a model class
function Thing() {}

// get a mongodb connection
var dbURI = 'mongodb://127.0.0.1:27017/test';
MongoClient.connect(dbURI, function(err, db) {

  // add activesmash's methods to the model class
  var smashify = require('activesmash')(db);
  smashify(Thing);

  // make a new Thing
  var thing = new Thing();

  // add some properties to it
  thing.foo = 5;
  thing.bar = 6;

  // create it in the db
  thing.create(function (err, result) {

    // save its id for later use
    var id = result._id;

    // change a property
    result.foo = 8;

    // save it
    result.save(function (err) {

      // get it again
      Thing.find({_id: id}, function(err, results) {

        // gotten version has modified 'foo'
        assert.equal(reulst[0].foo, 8);

        // now delete it
        results[0].delete(function(err) {

          // try to get it again
          Thing.find({_id: id},function(err, results) {

            // it's really gone!
            assert.equal(results.length, 0);
          });
        });
      });
    });
  });
});
```

You can also omit the callbacks, and the methods will return promises instead.

## Usage

The module is a single function, that when passed in a MongoDB connection (or NeDB) returns a decorator function to turn a class `Model` into a model definition. Then the following are available on the `Model`. In all cases, if the callback is omitted, the function returns an equivalent promise instead.

### `Model.find(query, cb)`

Calls the callback error-first with an array of instantiated Models matching the MongoDB query. For the moment, projections are not supported.

### `Model.prototype.create(cb)`

Adds this `Model` instance as a new document in MongoDB via `insert`, then calls the error-first callback. It adds an `_id` property to the instance.

### `Model.prototype.save(cb)`

Calls `update` on the corresponding document in MongoDB, adding any changes that were made to `Model` instance, then calls the error-first callback.

### `Model.prototype.delete(cb)`

Removes the corresponding document from MongoDB, then calls the error-first callback.

## License
See LICENSE.txt, as it's probably important.
