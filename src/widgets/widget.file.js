dg.theme_file = function(variables) {
  console.log('theme_file', variables);
  var attrs = variables._attributes;

  if (!attrs.id) { attrs.id = 'file-' + jDrupal.userPassword(); }
  attrs.type = 'hidden';

  var fileWrapperAttrs = {
    class: 'dg-file-wrapper',
    'data-id': attrs.id
  };

  return '<input ' + dg.attrs(variables) + ' />' +
      '<div ' + dg.attributes(fileWrapperAttrs) + '>' + dg.b(dg.t('Attach file'), {
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
