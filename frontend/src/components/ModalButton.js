export const ModalButtonUpload = `
<button type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#uploadModal">
  Upload Files
</button>

<div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-dark" id="uploadModalLabel">Upload File</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="uploadForm">
        <div class="modal-body">
                <div id="alertsBox"></div>
                <input type="file" class="form-control" id="file" accept=".jpg,.png,.pdf">
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" id="uploadButton">Upload</button>
        </div>
      </form>
    </div>
  </div>
</div>

`;

export const ModalFolderCreate = `
<button type="button" class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#folderModal">
  Create Folder
</button>

<div class="modal fade" id="folderModal" tabindex="-1" aria-labelledby="folderModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-dark" id="folderModalLabel">Create Folder</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="folderForm">
        <div class="modal-body">
                <div id="folderAlertsBox"></div>
                <div class="mb-3">
                  <label for=folderNameInput" class="form-label">Folder name</label>
                  <input type="text" class="form-control" id="folderNameInput" placeholder="Example: Photos" required>
                </div>
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" id="uploadButton">Create</button>
        </div>
      </form>
    </div>
  </div>
</div>

`;
