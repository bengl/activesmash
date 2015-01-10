module.exports = ActiveSmash;

function ActiveSmash(smash) {
  if (!(this instanceof ActiveSmash)) return new ActiveSmash(smash);

  this.smash = smash;
  return decorate.bind(this);
}

function decorate(Model) {
  var self = this;

  Model.find = function () {
    var cb, args = Array.prototype.slice.call(arguments);
    if (typeof args[args.length-1] === 'function') cb = args.pop();
    args.unshift(Model.name);
    var p = self.smash.find.apply(self.smash, args)
    .then(function(result){
      result.forEach(function(item) {
        item.__proto__ = Model.prototype;
        Model.call(item);
      });
      return result;
    });
    if (cb) {
      p.then(function(r) { cb(null, r)}, function(e) { cb(e)});
    }
    return p;
  };

  Model.prototype.save = function (cb) {
    return self.smash.save(this, cb);
  };

  Model.prototype.create = function (cb) {
    return self.smash.create(Model.name, this, cb);
  };

  Model.prototype.delete = function (cb) {
    return self.smash.delete(this, cb);
  };
};
