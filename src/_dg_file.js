dg.createModule('dg_file');

// @see widget.file.js
dg_file._fileWidgets = {};
dg_file.getFileWidget = function(id) {
  return dg_file._fileWidgets[id] ? dg_file._fileWidgets[id] : null;
};
dg_file.setFileWidget = function(id, variables) {
  dg_file._fileWidgets[id] = variables;
};

// @see widget.file-input.js
dg_file._fileInputs = {};
dg_file.getFileInput = function(id) {
  return dg_file._fileInputs[id] ? dg_file._fileInputs[id] : null;
};
dg_file.setFileInput = function(id, variables) {
  dg_file._fileInputs[id] = variables;
};
