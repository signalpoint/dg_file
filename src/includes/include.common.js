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
