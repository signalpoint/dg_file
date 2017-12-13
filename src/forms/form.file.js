dg.createForm('FileForm', function() {

  this.buildForm = function(form, formState, variables) {
    return new Promise(function(ok, err) {
      //console.log('buildForm - variables', variables);
      form.file = {
        _prefix: '<div id="dg-file-form-messages"></div>',
        _type: 'file_input',
        _formInputId: variables._formInputId
      };
      ok(form);
    });
  };

});
