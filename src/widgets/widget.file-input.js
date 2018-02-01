dg.theme_file_input = function(variables) {
  console.log('theme_file_input', variables);
  var attrs = variables._attributes;

  // Generate an attribute id if one wasn't provided.
  if (!attrs.id) { attrs.id = 'dg-file-widget-' + dg.salt(); }
  var wrapperId = attrs.id + '-wrapper';

  var html = '<div id="' + wrapperId + '" class="dg-file-widget-wrapper">';

  if (variables._file) {

    // There is an existing file...

    var file = variables._file;
    console.log('existing file', file);
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

    var previewId = attrs.id + '-preview';

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

    // And input and empty preview to html.
    html += input + preview;

  }

  return html + '</div>';
  
};

dg_file.chooseFileOnchange = function(wrapperId, inputId, previewId, formInputId) {
  console.log('chooseFileOnchange', arguments);

  var input = dg.qs('#' + inputId);
  console.log('input', input);

  // Grab the file from the file input element.
  //var file = document.querySelector('#' + inputId).files[0];
  var file = input.files[0];
  if (!file) { return; }
  console.log('file input', file);

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

  var reader  = new FileReader();

  // Step 2: Get ready for when the file is loaded...
  reader.addEventListener("load", function () {

    // The file has been loaded...

    // Preview the image.
    preview.src = reader.result;
    preview.height = 64;

    // Build the JSON deliverable.
    var fileData = {
      file: reader.result,
      filename: file.name,
      filepath: "public://" + file.name
    };

    // @TODO hide the file input element, make a dg_file.*() helper for this of course
    //document.getElementById(inputId).style.display = 'none';
    dg.hide(input);

    // Set an informative message.
    dg_file.setMessage(dg.t('Uploading file, please wait...'));

    // Save the file to Drupal...
    file_save(fileData, {
      success: function(result) {
        console.log('file_save', result);
        if (result.fid) {
    //
          var fid = result.fid;

          // Set the file aside as pending until they complete this transaction.
    //      dg_file.addToPendingFileIds(fid);
    //
          // Set the file id onto the input form element.
          dg.qs('#' + formInputId).value = fid;

          dg_file.setMessage(dg.t('File uploaded!'));

          // @TODO start here, now we need to replace the "dg-file-wrapper" within the form element with a preview of
          // the image and some buttons to remove/change the image.
    //
        }
        else { dg.error(null, null, dg.t('There was a problem saving the file.')); }
      },
      error: function (xhr, status, msg) { dg_file.setMessage(msg, 'error'); }
    });

  }, false);

  // Step 1: Load the file chosen by the user and circle back to the "load" event listener.
  if (file) { reader.readAsDataURL(file); }

};

dg_file.showFileInput = function(show) {
  var fileInput = dg_file.getFileInput();
};

dg_file.widgetRemoveOnclick = function(fid) {
  file_delete(fid, {
    success: function(result) {
      console.log(result);

      // When editing an existing entity, the file will be marked as used by Drupal's file management
      // system...
      //if (result.file) {
      //  $.each(result.file, function(entityType, entities) {
      //    $.each(entities, function(entityId) {
      //      // If a file is in use, we can't delete it. However, it appears that if an entity update call
      //      // removes a reference to that file id from an e.g. image field, then Drupal automatically deletes
      //      // the file after the entity is updated.
      //
      //      //dgFile.addToPendingFileIds(fid);
      //    });
      //  });
      //}

    },
    error: dg.error
  });
};
