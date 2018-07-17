//dg_file.loaded = function(file, uri, inputId, previewId, formInputId) {
/**
 * Once a file is loaded, this handler is used to save the file into Drupal.
 * @param file {string} The "file" input object from the DOM.
 * @param uri {string} The file uri.
 * @param fileInputId {string} The id of the DgFileInput
 */
dg_file.loaded = function(file, uri, fileInputId) {
  console.log('loaded()', file);

  var isCompiled = dg.isCompiled();
  var fileInput = dg_file.getFileInput(fileInputId);
  var formInputId = fileInput.getFormInputId();

  // Load up the file widget's variables (from theme_file() in widget.file.js).
  var widgetVariables = dg_file.getFileWidget(formInputId);
  //console.log('widgetVariables', widgetVariables);

  //fileInput.setPreview(uri);

  // Step 2: Build the JSON deliverable...
  var step2 = function(base64) {

    // Trim off the e.g. "data:image/png;base64," unused prefix on the base64 for Drupal's sake.
    //console.log('trimming for drupal');
    if (base64.indexOf('data:image') === 0) {
      base64 = base64.substring(base64.indexOf(',') + 1);
    }
    //console.log('done trimming for drupal');

    // Grab the file name.
    var fileName = file.name;

    // Build the file path.
    var filePath = "public://";
    var dir = widgetVariables._filePathDir;
    if (dir) { filePath += dir + '/'; }
    filePath += fileName;

    // Build the file data to POST.
    var fileData = {
      file: base64,
      filename: fileName,
      filepath: filePath
    };
    //console.log('fileData', fileData.filename, fileData.filepath);

    // Hide the input and set an informative message.
    fileInput.hideInput();
    fileInput.setMessage(dg.t('Uploading') + '...');

    // Save the file to Drupal...
    // @TODO this is specific to Drupal 7, add Drupal 8 support too!
    file_save(fileData, {
      success: function(result) {
        //console.log('file_save', result);
        if (result.fid) {

          // Set the file id onto the input form element.
          dg.qs('#' + formInputId).value = result.fid;

          // Clear out the message and preview the image.
          fileInput.clearMessage();
          fileInput.setPreview(uri);

        }
        else { dg.error(null, null, dg.t('There was a problem saving the file.')); }
      },
      error: function (xhr, status, msg) { fileInput.setMessage(msg, 'error'); }
    });

  }; // step 2

  // Step 1: Get base64 of image in compiled mode only, in web app mode the base64 comes in on the "uri" argument.
  if (isCompiled) {
    dg_file.encodeImageUri(uri).then(function(base64) {
      step2(base64);
    });
  }
  else { step2(uri); }

};

dg_file.parseFid = function(fid) { return parseInt(fid); };
dg_file.getFileElementNamesFromForm = function(form) {
  var names = [];
  if (form.elements) {
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      var element = form.elements[name];
      if (!element.type || element.type != 'file') { continue; }
      names.push(name);
      break;
    }
  }
  return names.length ? names : null;
};

dg_file._pendingFileIds = [];
dg_file.getPendingFileIds = function() { return dg_file._pendingFileIds; };
dg_file.setPendingFileIds = function(fileIds) { dg_file._pendingFileIds = fileIds; };
dg_file.hasPendingFileIds = function() { return dg_file.getPendingFileIds().length; };
dg_file.isPendingFileId = function(fid) {
  return in_array(dg_file.parseFid(fid), dg_file.getPendingFileIds());
};
dg_file.addToPendingFileIds = function(fid) {
  fid = dg_file.parseFid(fid);
  if (!dg_file.isPendingFileId(fid)) {
    dg_file.getPendingFileIds().push(fid);
    //console.log('added to pending list: ' + fid);
  }
};
dg_file.removeFromPendingFileIds = function(fid) {
  fid = dg_file.parseFid(fid);
  var fileIds = dg_file.getPendingFileIds();
  //console.log('removeFromPendingFileIds', fid, dg_file.getPendingFileIds());
  fileIds = fileIds.filter(function(e) { return e !== fid });
  dg_file.setPendingFileIds(fileIds);
  //console.log('removeFromPendingFileIds', fid, dg_file.getPendingFileIds());
};

//_pendingDelete: {},
//getPendingDelete: function() { return this._pendingDelete; },
//addToPendingDelete: function(entityType, entityId) {
//  var pending = this._pendingDelete;
//  if (!pending[entityType]) { pending[entityType] = []; }
//  pending[entityType].push(entityId);
//},
//hasPendingDelete: function(entityType, entityId) {
//  var isPending = false;
//  var pending = this.getPendingDelete();
//  $.each(pending, function(_entityType, ids) {
//    if (entityType == _entityType && in_array(entityId, ids)) {
//      isPending = true;
//      return false;
//    }
//  });
//  return isPending;
//},
//pendingDeleteEntityTypes: function() {
//  var entityTypes = [];
//  var pending = this.getPendingDelete();
//  $.each(pending, function(entityType, ids) {
//    entityTypes.push(entityType);
//  });
//  return entityTypes.length ? entityTypes: null;
//}

dg_file.read = function(file) {




};
