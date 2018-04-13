/**
 *
 * @param variables
 *    _filePathDir {String} the folder in the file system to save the file in, e.g. "articles/images"
 * @returns {string}
 */
dg.theme_file = function(variables) {
  console.log('theme_file', variables);
  var attrs = variables._attributes;

  // Make sure we have an id for the widget.
  if (!attrs.id) { attrs.id = 'file-' + dg.salt(); }
  var id = attrs.id;

  // Set aside the widget so it can be used later.
  dg_file.setFileWidget(id, variables);

  // We force a hidden input as the place we track the file id.
  attrs.type = 'hidden';

  // Return the hidden input followed by the file input widget.
  return '<input ' + dg.attrs(variables) + ' />' +
          dg.render({
            _prefix: '<div id="dg-file-form-messages"></div>',
            _theme: 'file_input',
            _formInputId: id
          });
};
