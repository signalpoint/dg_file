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
    var formInputId = variables._formInputId;

    // File input widget.
    var input = null;

    // Compiled widget.
    if (dg.isCompiled()) {

      attrs.onclick = "dg_file.openFilePicker(this, '" + previewId + "', '" + formInputId + "')";
      input = dg.b(dg.t('Choose File'), { _attributes: attrs });

    }
    else { // web app widget.

      if (!attrs.type) { attrs.type = 'file'; }
      if (!attrs.onchange) {
        attrs.onchange = "dg_file.chooseFileOnchange(" +
            "'" + wrapperId + "', " +
            "'" + attrs.id + "', " +
            "'" + previewId + "', " +
            "'" + formInputId + "'" +
            ")";
      }
      attrs.class.push('dg-file-widget');
      input = '<input ' +  dg.attrs(variables) + '/>';
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

  }

  return html + '</div>';
  
};

dg_file.chooseFileOnchange = function(wrapperId, inputId, previewId, formInputId) { // web-app only...
  console.log('chooseFileOnchange', arguments);

  // Load up the file input's variables.
  var variables = dg_file.getFileInput(inputId);
  console.log('variables', variables);

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

  // Init a file reader.
  var reader = new FileReader();

  // Step 2: Get ready for when the file is loaded...
  reader.addEventListener("load", function () {

    // The file has been loaded...

    dg_file.loaded(file, reader.result, inputId, previewId, formInputId);

  }, false);

  // Step 1: Load the file chosen by the user and circle back to the "load" event listener.
  if (file) { reader.readAsDataURL(file); }

};


dg_file.openFilePicker = function(button, previewId, formInputId) { // compiled app only...
  console.log('openFilePicker', arguments);

  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  var options = dg_file.setOptions(srcType);

  navigator.camera.getPicture(function cameraSuccess(imageUri) {
    window.resolveLocalFileSystemURI(imageUri,
        function(fileEntry) {

          console.log(fileEntry.fullPath);
          console.log(fileEntry);

          // The file has been loaded...
          fileEntry.file(function(file) {

            dg_file.loaded(file, imageUri, button.getAttribute('id'), previewId, formInputId);

          });

          // @see https://www.npmjs.com/package/cordova-plugin-file#read-a-file
          //fileEntry.file(function (file) {
          //  var reader = new FileReader();
          //
          //  reader.onloadend = function() {
          //    console.log("Successful file read: " + this.result);
          //    //displayFileData(fileEntry.fullPath + ": " + this.result);
          //
          //
          //
          //  };
          //
          //  reader.readAsText(file);
          //
          //}, onErrorReadFile);

        },
        function() {
          //error
        }
    );
  }, function cameraError(error) {

    console.debug("Unable to obtain picture: " + error, "app");

  }, options);

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
