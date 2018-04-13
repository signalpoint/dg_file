dg_file.setMessage = function(msg, type) {
  dg.qs('#dg-file-form-messages').innerHTML = dg.render({
    _theme: 'message',
    _type:type ? type : 'status',
    _message: msg
  });
};
dg_file.clearMessage = function() {
  dg.qs('#dg-file-form-messages').innerHTML = '';
};

dg_file.loaded = function(file, uri, inputId, previewId, formInputId) {

  var isCompiled = dg.isCompiled();

  // Load up the file widget's variables.
  var widgetVariables = dg_file.getFileWidget(formInputId);
  console.log('widgetVariables', widgetVariables);

  console.log('file', file);

  // Grab the preview widget.
  var preview = dg.qs('#' + previewId);

  // Preview the image.
  preview.src = uri;
  preview.height = 64;

  // Step 2: Build the JSON deliverable...
  var step2 = function(base64) {

    // Trim off the e.g. "data:image/png;base64," unused prefix on the base64 for Drupal's sake.
    console.log('trimming for drupal');
    if (base64.indexOf('data:image') === 0) {
      base64 = base64.substring(base64.indexOf(',') + 1);
    }
    console.log('done trimming for drupal');

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
    console.log('fileData', fileData.filename, fileData.filepath);

    // @TODO hide the file input element, make a dg_file.*() helper for this of course
    if (!isCompiled) {
      dg.hide(input);
    }

    // Set an informative message.
    // @TODO this should be available to the developer... they want a custom message!
    dg_file.setMessage(dg.t('Uploading file, please wait...'));

    // Save the file to Drupal...
    // @TODO this is specific to Drupal 7, add Drupal 8 support too!
    file_save(fileData, {
      success: function(result) {
        console.log('file_save', result);
        if (result.fid) {
          var fid = result.fid;

          // Set the file aside as pending until they complete this transaction.
          //      dg_file.addToPendingFileIds(fid);

          // Set the file id onto the input form element.
          dg.qs('#' + formInputId).value = fid;

          // Clear out the message.
          dg_file.clearMessage();

          // Replace the file wrapper (within the form element) with a preview of the image.
          var previewId = 'dg-file-preview-' + dg.salt();
          var wrapper = dg.qs('.dg-file-wrapper[data-id="' + formInputId + '"]');
          wrapper.innerHTML = '<img id="' + previewId + '" class="dg-file-preview" />';
          setTimeout(function() {
            var img = dg.qs('#' + previewId);
            img.src = base64; // Careful, if this was trimmed maybe the preview could be broken.?
            img.height = 96;
          }, 1);

          // Add a delete button.
          // @TODO this should only show up if they have permission to delete a file.
          //wrapper.innerHTML += dg.b(dg.t('Remove'), {
          //  _attributes: {
          //    onclick: 'dg_file.widgetRemoveOnclick(this)',
          //    'data-fid': fid
          //  }
          //});

        }
        else { dg.error(null, null, dg.t('There was a problem saving the file.')); }
      },
      error: function (xhr, status, msg) { dg_file.setMessage(msg, 'error'); }
    });

  }; // step 2

  // Step 1: Get base64 of image in compiled mode only, in web app mode the base64 comes in on the "uri" argument.
  if (isCompiled) {
    dg_file.encodeImageUri(uri).then(function(base64) {
      console.log('compiled!');
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
    console.log('added to pending list: ' + fid);
  }
};
dg_file.removeFromPendingFileIds = function(fid) {
  fid = dg_file.parseFid(fid);
  var fileIds = dg_file.getPendingFileIds();
  console.log('removeFromPendingFileIds', fid, dg_file.getPendingFileIds());
  fileIds = fileIds.filter(function(e) { return e !== fid });
  dg_file.setPendingFileIds(fileIds);
  console.log('removeFromPendingFileIds', fid, dg_file.getPendingFileIds());
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
