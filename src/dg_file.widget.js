dg.theme_file = function(variables) {
  variables._attributes.type = 'file';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
};
