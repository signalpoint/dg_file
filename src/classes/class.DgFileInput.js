DgFileInput = function(variables) {

  // Set aside the variables.
  this._variables = variables;

  // Generate an id, if one wasn't provided.
  var attrs = this._variables._attributes;
  if (!attrs.id) { attrs.id = 'dg-file-widget-' + dg.salt(); }
  var id = attrs.id;
  this._id = id;

  // Generate a wrapper and a preview id.
  this._wrapperId = id + '-wrapper';
  this._previewId = id + '-preview';

  // Set aside the form input id.
  this._formInputId = variables._formInputId;

};

DgFileInput.prototype.id = function() { return this._id; };
DgFileInput.prototype.getVars = function() { return this._variables; };
DgFileInput.prototype.getAttributes = function() { return this.getVars()._attributes; };
DgFileInput.prototype.getWrapperId = function() { return this._wrapperId; };
DgFileInput.prototype.getPreviewId = function() { return this._previewId; };
DgFileInput.prototype.getFormInputId = function() { return this._formInputId; }; // the hidden input element
DgFileInput.prototype.getInput = function() { return dg.qs('#' + this.id()); };

DgFileInput.prototype.html = function() {

  var wrapperId = this.getWrapperId();
  var html = '<div id="' + wrapperId + '" class="dg-file-widget-wrapper">';

  // There is no default file...

  // Generate a preview identifier.
  //var previewId = id + '-preview';
  //var formInputId = variables._formInputId;
  var previewId = this.getPreviewId();
  var formInputId = this.getFormInputId();

  // File input widget.
  var input = null;
  var attrs = this.getAttributes();
  var id = this.id();

  // Compiled widget.
  if (dg.isCompiled()) {

    //attrs.onclick = "dg_file.openFilePicker(this, '" + previewId + "', '" + formInputId + "')";
    attrs.onclick = "dg_file.openFilePicker('" + id + "')";
    attrs.class.push('dg-file-choose-file');
    input =
          dg.b(dg.t('Choose File'), { _attributes: attrs }) +
          dg.b(dg.t('Take Picture'), { _attributes: {
            id: id + '-camera',
            class: ['dg-file-take-picture'],
            onclick: "dg_file.openCamera('" + id + "')"
          }});

  }
  else { // web app widget.

    if (!attrs.type) { attrs.type = 'file'; }
    if (!attrs.onchange) {
      attrs.onchange = "dg_file.chooseFileOnchange('" + id + "')";
    }
    attrs.class.push('dg-file-widget');
    input = '<input ' +  dg.attributes(attrs) + '/>';
  }

  // Preview widget.
  var previewAttrs = {
    id: previewId,
    src: '',
    class: ['dg-file-preview']
  };
  var preview = '<img ' + dg.attributes(previewAttrs) + '>';

  // Add input and empty preview to html.
  html += input + preview;

  return html + '</div>';

};

DgFileInput.prototype.hideInput = function() {
  dg.hide(this.getInput());
  var cameraInput = dg.qs('#' + this.id() + '-camera');
  if (cameraInput) { dg.hide(cameraInput); }
};

/**
 *
 * @param data {String} Base 64 encoded string for web app mode, file uri for compiled mode.
 */
DgFileInput.prototype.setPreview = function(data) {
  var preview = dg.qs('#' + this.getPreviewId());
  preview.src = data;
  preview.height = 64;
};

DgFileInput.prototype.getMessageBox = function() {
  return dg.qs('#dg-file-form-messages');
};
DgFileInput.prototype.setMessage = function(msg, type) {
  this.getMessageBox().innerHTML = dg.render({
    _theme: 'message',
    _type: type ? type : 'status',
    _message: msg
  });
};

DgFileInput.prototype.clearMessage = function(msg, type) {
  this.getMessageBox().innerHTML = '';
};
