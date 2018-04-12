/**
 *
 * @param variables
 * @returns {string}
 */
dg.theme_file_input = function(variables) {
  //console.log('theme_file_input', variables);
  var attrs = variables._attributes;

  // Generate an attribute id if one wasn't provided.
  if (!attrs.id) { attrs.id = 'dg-file-widget-' + dg.salt(); }
  var id = attrs.id;

  // Set this file input's variables aside for re-use.
  dg_file.setFileInput(id, variables);

  // Generate a wrapper id.
  var wrapperId = id + '-wrapper';

  var html = '<div id="' + wrapperId + '" class="dg-file-widget-wrapper">';

  if (variables._file) { // @TODO implement.

    // There is an existing file...

    var file = variables._file;
    //console.log('existing file', file);
    //var preview = theme('image_style', {
    //  style_name: 'thumbnail',
    //  path: file.uri
    //});
    //var deleteBtn = bl(t('Remove'), null, {
    //  attributes: {
    //    'data-icon': 'delete',
    //    'data-iconpos': 'notext',
    //    onclick: 'dgFileWidgetRemoveOnclick(' + file.fid + ')',
    //    wrapperId: wrapperId
    //  }
    //});
    //html += deleteBtn + preview;

  }
  else {

    // There is no default file...

    // Generate a preview identifier.
    var previewId = id + '-preview';

    // Input widget.
    if (!attrs.type) { attrs.type = 'file'; }
    if (!attrs.onchange) {
      attrs.onchange = "dg_file.chooseFileOnchange(" +
          "'" + wrapperId + "', " +
          "'" + attrs.id + "', " +
          "'" + previewId + "', " +
          "'" + variables._formInputId + "'" +
      ")";
    }
    attrs.class.push('dg-file-widget');
    var input = '<input ' +  dg.attrs(variables) + '/>';

    // Preview widget.
    var previewAttrs = {
      id: previewId,
      src: '',
      class: ['dg-file-preview']
    };
    var preview = '<img ' + dg.attributes(previewAttrs) + '>';

    // Add input and empty preview to html.
    html += input + preview;

  }

  return html + '</div>';
  
};

dg_file.chooseFileOnchange = function(wrapperId, inputId, previewId, formInputId) {
  //console.log('chooseFileOnchange', arguments);

  // Load up the file widget's variables.
  var widgetVariables = dg_file.getFileWidget(formInputId);
  //console.log('widgetVariables', widgetVariables);

  // Load up the file input's variables.
  var variables = dg_file.getFileInput(inputId);
  //console.log('variables', variables);

  var input = dg.qs('#' + inputId);
  //console.log('input', input);

  // Grab the file from the file input element.
  //var file = document.querySelector('#' + inputId).files[0];
  var file = input.files[0];
  if (!file) { return; }
  //console.log('file input', file);

  // If they previously selected a file for preview, then delete it from Drupal's file management since it will be
  // unused.
  //var fid = $('#' + inputId).attr('fid');
  //if (fid) {
  //  console.log('fid', fid);
  //  file_delete(fid, {
  //    success: function(result) {
  //      dg_file.removeFromPendingFileIds(fid);
  //      dg_file.read();
  //    },
  //    error: dg.error
  //  });
  //}
  //else { dg_file.read(); }

  // Grab the preview widget.
  //var preview = document.querySelector('#' + previewId);
  var preview = dg.qs('#' + previewId);

  // Init a file reader.
  var reader = new FileReader();

  // Step 2: Get ready for when the file is loaded...
  reader.addEventListener("load", function () {

    // The file has been loaded...

    // Preview the image.
    preview.src = reader.result;
    preview.height = 64;

    // Build the JSON deliverable...

    // Trim off the e.g. "data:image/png;base64," unused prefix on the base64 for Drupal's sake.
    var base64 = reader.result;
    if (base64.indexOf('data:image') === 0) {
      base64 = base64.substring(base64.indexOf(',') + 1);
    }

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

    // @TODO hide the file input element, make a dg_file.*() helper for this of course
    dg.hide(input);

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
            img.src = reader.result;
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

  }, false);

  // Step 1: Load the file chosen by the user and circle back to the "load" event listener.
  if (file) { reader.readAsDataURL(file); }

};

dg_file.widgetRemoveOnclick = function(button) {
  var fid = button.getAttribute('data-fid');
  var error = function(xhr, status, msg) { dg.alert(msg); };
  file_delete(fid, {
    success: function(result) {
      console.log(result);
      if (result[0]) {

        // @TODO need to remove preview and start the widget/element over for a new file
        // @TODO clear out the hidden input value.

      }
      else { error(null, null, dg.t('There was a problem removing the file.')); }
    },
    error: error
  });
};
