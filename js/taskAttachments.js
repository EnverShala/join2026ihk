const _ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
const _ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
const _MAX_BYTES = 1 * 1024 * 1024;
const _MAX_DIMENSION = 800;

let _taskAttachments = [];
let _editAttachments = [];
let _viewAttachments = [];
let _currentLightboxIndex = -1;

/**
 * Formats a byte count as a human-readable string in B, KB, or MB.
 * @param {number} bytes - The size in bytes.
 * @returns {string} The formatted size (e.g. "512 B", "3.4 KB", "1.2 MB").
 */
function _formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Scales (w, h) so the larger side equals _MAX_DIMENSION, preserving aspect ratio.
 * @param {number} w - Original image width.
 * @param {number} h - Original image height.
 * @returns {{w: number, h: number}} The scaled width and height.
 */
function _scaleDimensions(w, h) {
  if (w >= h) return { w: _MAX_DIMENSION, h: Math.round((h * _MAX_DIMENSION) / w) };
  return { w: Math.round((w * _MAX_DIMENSION) / h), h: _MAX_DIMENSION };
}

/**
 * Draws the given image onto a canvas at the target size and returns a data URL.
 * @param {HTMLImageElement} img - The source image element.
 * @param {File} file - The original file (used to detect the target MIME type).
 * @returns {string} The compressed image as a base64 data URL.
 */
function _drawCompressedCanvas(img, file) {
  let w = img.width;
  let h = img.height;
  if (w > _MAX_DIMENSION || h > _MAX_DIMENSION) ({ w, h } = _scaleDimensions(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  return canvas.toDataURL(mime, 0.82);
}

/**
 * Compresses an image file via canvas and resolves with a base64 data URL.
 * @param {File} file - The image file to compress.
 * @returns {Promise<string>} Resolves with the compressed base64 data URL.
 */
function _compressImage(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      const img = new Image();
      img.onerror = reject;
      img.onload = function () { resolve(_drawCompressedCanvas(img, file)); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates the MIME type, extension, and size of a file for attachment upload.
 * @param {File} file - The file to validate.
 * @param {string} context - The upload context ("", "popup" or "edit").
 * @returns {boolean} True if the file is a valid attachment, otherwise false.
 */
function _validateFile(file, context) {
  if (!_ALLOWED_MIME.includes(file.type)) {
    _showAttachmentError(context, '"' + _esc(file.name) + '" ist keine gültige Bilddatei.');
    return false;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  if (!_ALLOWED_EXT.includes(ext)) {
    _showAttachmentError(context, '"' + _esc(file.name) + '" hat eine ungültige Dateiendung.');
    return false;
  }
  if (file.size > _MAX_BYTES) {
    _showAttachmentError(context, '"' + _esc(file.name) + '" ist größer als 1 MB.');
    return false;
  }
  return true;
}

/**
 * Stores a compressed attachment for its context and re-renders the preview area.
 * @param {string} base64 - The compressed base64 data URL.
 * @param {File} file - The original file (for name/type/size metadata).
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function _storeAttachment(base64, file, context) {
  const att = { name: file.name, type: file.type, size: file.size, base64: base64 };
  if (context === 'edit') {
    _editAttachments.push(att);
    _renderAllPreviews('attachmentPreviewEdit', _editAttachments, 'edit');
    return;
  }
  _taskAttachments.push(att);
  const previewId = context === 'popup' ? 'attachmentPreviewPopup' : 'attachmentPreview';
  _renderAllPreviews(previewId, _taskAttachments, context);
}

/**
 * Validates a single file, then compresses and stores it on success.
 * @param {File} file - The file to process.
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function _processFile(file, context) {
  if (!_validateFile(file, context)) return;
  _hideAttachmentError(context);
  _compressImage(file).then(function (base64) {
    _storeAttachment(base64, file, context);
  }).catch(function () {
    _showAttachmentError(context, '"' + _esc(file.name) + '" konnte nicht verarbeitet werden.');
  });
}

/**
 * Entry point for the file input's change event; processes each selected file.
 * @param {string} inputId - The DOM id of the file input element.
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function handleImageUpload(inputId, context) {
  const input = document.getElementById(inputId);
  if (!input || !input.files || input.files.length === 0) return;
  Array.from(input.files).forEach(function (file) { _processFile(file, context); });
  input.value = '';
}

/**
 * Renders all upload preview items for the given attachments array.
 * @param {string} containerId - The DOM id of the preview container.
 * @param {Array} attachments - The attachments to render.
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function _renderAllPreviews(containerId, attachments, context) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (attachments.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = attachments.map(function (att, i) {
    return attachmentPreviewItemTemplate(att, i, context);
  }).join('');
}

/**
 * Opens the lightbox from an upload preview for the given attachment index.
 * @param {string} context - The upload context ("", "popup" or "edit").
 * @param {number} index - The zero-based attachment index.
 */
function openUploadPreview(context, index) {
  _viewAttachments = context === 'edit' ? _editAttachments : _taskAttachments;
  openImageViewer(index);
}

/**
 * Removes an attachment from its context store and re-renders the preview.
 * @param {string} context - The upload context ("", "popup" or "edit").
 * @param {number} index - The zero-based attachment index to remove.
 */
function removeAttachment(context, index) {
  if (context === 'edit') {
    _editAttachments.splice(index, 1);
    _renderAllPreviews('attachmentPreviewEdit', _editAttachments, 'edit');
    return;
  }
  _taskAttachments.splice(index, 1);
  const previewId = context === 'popup' ? 'attachmentPreviewPopup' : 'attachmentPreview';
  _renderAllPreviews(previewId, _taskAttachments, context);
}

/**
 * Returns the current attachments for the given context as a JSON string.
 * @param {string} context - The upload context ("", "popup" or "edit").
 * @returns {string} A JSON string of attachments, or an empty string if none.
 */
function getAttachmentJson(context) {
  const arr = context === 'edit' ? _editAttachments : _taskAttachments;
  return arr.length > 0 ? JSON.stringify(arr) : '';
}

/**
 * Clears the attachments array and preview DOM for the given context.
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function clearAttachmentState(context) {
  if (context === 'edit') {
    _editAttachments = [];
    const p = document.getElementById('attachmentPreviewEdit');
    if (p) p.innerHTML = '';
    return;
  }
  _taskAttachments = [];
  const previewId = context === 'popup' ? 'attachmentPreviewPopup' : 'attachmentPreview';
  const p = document.getElementById(previewId);
  if (p) p.innerHTML = '';
}

/**
 * Shows an inline attachment error message for the given context.
 * @param {string} context - The upload context ("", "popup" or "edit").
 * @param {string} msg - The message to display.
 */
function _showAttachmentError(context, msg) {
  const id = 'attachmentError' + (context === 'edit' ? 'Edit' : context === 'popup' ? 'Popup' : '');
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

/**
 * Hides the inline attachment error message for the given context.
 * @param {string} context - The upload context ("", "popup" or "edit").
 */
function _hideAttachmentError(context) {
  const id = 'attachmentError' + (context === 'edit' ? 'Edit' : context === 'popup' ? 'Popup' : '');
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/**
 * Updates the lightbox's download link and file name.
 * @param {Object} att - The attachment object.
 */
function _updateLightboxDownload(att) {
  const dl = document.getElementById('lightboxDownload');
  dl.href = att.base64;
  dl.setAttribute('download', att.name || 'download');
}

/**
 * Updates the lightbox navigation button visibility for the given index.
 * @param {number} index - The current attachment index.
 */
function _updateLightboxNav(index) {
  document.querySelector('.lightbox-prev').style.visibility = index > 0 ? 'visible' : 'hidden';
  document.querySelector('.lightbox-next').style.visibility =
    index < _viewAttachments.length - 1 ? 'visible' : 'hidden';
}

/**
 * Updates the lightbox image, metadata, download link, and navigation visibility.
 * @param {number} index - The zero-based attachment index to display.
 */
function _updateLightboxContent(index) {
  const att = _viewAttachments[index];
  document.getElementById('lightboxImg').src = att.base64;
  document.getElementById('lightboxName').textContent = att.name || '';
  document.getElementById('lightboxType').textContent = att.type || '';
  document.getElementById('lightboxSize').textContent = att.size ? _formatFileSize(att.size) : '';
  _updateLightboxDownload(att);
  _updateLightboxNav(index);
}

/**
 * Creates and appends the lightbox DOM element to the document body.
 * @returns {HTMLElement} The created lightbox element.
 */
function _createLightboxElement() {
  const lb = document.createElement('div');
  lb.id = 'attachmentLightbox';
  lb.className = 'attachment-lightbox';
  lb.innerHTML = lightboxTemplate();
  document.body.appendChild(lb);
  return lb;
}

/**
 * Opens the lightbox for the given attachment index.
 * @param {number} index - The zero-based attachment index to display.
 */
function openImageViewer(index) {
  if (!_viewAttachments[index] || !_viewAttachments[index].base64) return;
  _currentLightboxIndex = index;
  const lb = document.getElementById('attachmentLightbox') || _createLightboxElement();
  _updateLightboxContent(index);
  lb.style.display = 'flex';
}

/**
 * Moves the lightbox by the given direction (-1 for previous, 1 for next).
 * @param {number} direction - Navigation direction (-1 or 1).
 */
function _navigateLightbox(direction) {
  const next = _currentLightboxIndex + direction;
  if (next < 0 || next >= _viewAttachments.length) return;
  _currentLightboxIndex = next;
  _updateLightboxContent(next);
}

/**
 * Closes the lightbox if it is currently open.
 */
function closeImageViewer() {
  const lb = document.getElementById('attachmentLightbox');
  if (lb) lb.style.display = 'none';
}

/**
 * Parses an attachments JSON string, normalizing the legacy single-object format.
 * @param {string} json - The attachments JSON string.
 * @returns {Array} The parsed attachments array (may be empty).
 */
function _parseAttachmentsJson(json) {
  let parsed;
  try { parsed = JSON.parse(json); } catch (e) { return []; }
  if (!Array.isArray(parsed)) parsed = (parsed && parsed.base64) ? [parsed] : [];
  return parsed;
}

/**
 * Renders attachment list items into the collapsible dropdown list.
 * @param {Array} attachments - The attachments to render.
 */
function _renderAttachmentList(attachments) {
  const list = document.getElementById('attachmentDropdownList');
  if (!list) return;
  list.innerHTML = attachments.map(function (att, i) { return attachmentListItemTemplate(att, i); }).join('');
  list.style.display = 'none';
}

/**
 * Renders the attachments section in the task detail popup.
 * @param {string} attachmentsJson - The task's attachments JSON string.
 */
function renderAttachmentsSection(attachmentsJson) {
  const section = document.getElementById('attachmentsSection');
  if (!section) return;
  _viewAttachments = [];
  if (!attachmentsJson) { section.style.display = 'none'; return; }
  const parsed = _parseAttachmentsJson(attachmentsJson);
  if (parsed.length === 0) { section.style.display = 'none'; return; }
  _viewAttachments = parsed;
  section.style.display = 'block';
  _renderAttachmentList(_viewAttachments);
  const arrow = document.getElementById('attachmentsDropdownArrow');
  if (arrow) arrow.style.transform = 'rotate(0deg)';
}

/**
 * Toggles the attachments dropdown list open/closed and rotates the arrow.
 */
function toggleAttachmentsDropdown() {
  const list = document.getElementById('attachmentDropdownList');
  const arrow = document.getElementById('attachmentsDropdownArrow');
  if (!list) return;
  const open = list.style.display === 'block';
  list.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}

/**
 * Restores attachments into the edit context from a JSON string.
 * @param {string} attachmentsJson - The attachments JSON string to restore.
 */
function loadAttachmentForEdit(attachmentsJson) {
  _editAttachments = [];
  const preview = document.getElementById('attachmentPreviewEdit');
  if (preview) preview.innerHTML = '';
  if (!attachmentsJson) return;
  try {
    let parsed = JSON.parse(attachmentsJson);
    if (!Array.isArray(parsed)) parsed = (parsed && parsed.base64) ? [parsed] : [];
    _editAttachments = parsed.filter(function (a) { return a && a.base64; });
    _renderAllPreviews('attachmentPreviewEdit', _editAttachments, 'edit');
  } catch (e) { /* ungültiges JSON, ignorieren */ }
}

/**
 * HTML-escapes a string to prevent XSS injection.
 * @param {string} str - The value to escape.
 * @returns {string} The HTML-escaped string.
 */
function _esc(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
