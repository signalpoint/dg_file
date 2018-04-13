dg.FileElement = function(name, element, form) {
  dg.FormElementPrepare(this, arguments);
};

// Extend the FormElement prototype.
dg.FileElement.prototype = new dg.FormElement;
dg.FileElement.prototype.constructor = dg.FileElement;
