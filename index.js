module.exports = ActiveSmash;

function ActiveSmash(smash) {
  if (!(this instanceof ActiveSmash)) return new ActiveSmash(smash);

  this.smash = smash;
  return decorate.bind(this);
}

function decorate(Model) {
  var self = this;

  Model.find = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(Model.name);
    return self.smash.find.apply(self.smash, args)
    .then(function(result){
      result.forEach(function(item) {
        item.__proto__ = Model.prototype;
        Model.call(item);
      });
      return result;
    });
  };

  Model.prototype.save = function () {
    return self.smash.save(this);
  };

  Model.prototype.create = function () {
    return self.smash.create(Model.name, this);
  };

  Model.prototype.delete = function () {
    return self.smash.delete(this);
  };
};
