export const fileTemplate = (file, image = null) => {
  return `
    <div class="modal fade" id="file_${
      file.fileId
    }" tabindex="-1" aria-labelledby="file_${
    file.fileId
  }Label" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="file_${file.fileId}Label">
                ${file.name}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            PREVIEW
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="download_${
              file.fileId
            }">Download</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="edit_${
      file.fileId
    }" tabindex="-1" aria-labelledby="edit_${
    file.fileId
  }Label" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title text-dark" id="edit_${
              file.fileId
            }Label">Edit ${file.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="editFileForm">
            <div class="modal-body">
                    <div id="editFileAlertsBox"></div>
                    <div class="mb-3">
                        <label for=newFileNameInput" class="form-label">${
                          file.fileType === "file" ? "File" : "Folder"
                        } name</label>
                        <input type="text" class="form-control" id="newFileNameInput" value="${
                          file.name
                        }" required>
                        <input type="text" class="form-control" style="display: none;" id="newFileIdInput" value="${
                          file.fileId
                        }" required disabled>
                    </div>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" id="uploadButton">Edit</button>
            </div>
            </form>
        </div>
        </div>
    </div>

    <div class="card mx-2 my-2 ${
      file.fileType === "folder" ? "drop" : ""
    }" style="width: 18rem;" id="fileId_${file.fileId}">
        <img src="${image}" class="card-img-top" style="height: 15vh; object-fit: cover;" alt="${
    file.name
  }">
        <div class="card-body">
        <h5 class="card-title">${file.name}</h5>
        <button type="button" class="btn btn-primary me-2" id="download_${
          file.fileId
        }">Download</button>
        <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#edit_${
          file.fileId
        }">Edit</a>
        <button type="button" class="btn btn-danger me-2" id="deleteButton_${
          file.fileId
        }">Delete</a>
        </div>
    </div>
    `;
};
