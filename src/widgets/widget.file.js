dg.theme_file = function(variables) {
  var attrs = variables._attributes;

  if (!attrs.id) { attrs.id = 'file-' + jDrupal.userPassword(); }
  attrs.type = 'hidden';

  return '<input ' + dg.attrs(variables) + ' /><div class="dg-file-wrapper">' + dg.b(dg.t('Attach file'), {
    _attributes: {
      onclick: 'dg_file.attachFileOnclick(this)',
      title: variables._title ? variables._title : dg.t('File'),
      'data-form-input-id': attrs.id
    }
  }) + '</div>';
};

/**
 * Handles clicks on the "Attach file" button by loading the FileForm into a modal window.
 * @param button
 * @returns {boolean}
 */
dg_file.attachFileOnclick = function(button) {
  var element = {};
  element.controls = {
    _theme: 'form',
    _id: 'FileForm',
    _formInputId: button.getAttribute('data-form-input-id')
  };
  dg.modal(element, {
    title: button.getAttribute('title')
  });
  return false;
};
