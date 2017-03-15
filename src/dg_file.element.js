dg.FileElement = function(name, element, form) {
  dg.FormElementPrepare(this, arguments);
};

// Extend the FormElement prototype.
dg.FileElement.prototype = new dg.FormElement;
dg.FileElement.prototype.constructor = dg.FileElement;

dg.FileElement.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    ok({
      name: self.get('name'),
      value: document.getElementById(self.id()).files
    });
  });
};
