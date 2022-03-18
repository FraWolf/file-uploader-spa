import { fileTemplate } from "./components/File";
import { ModalButtonUpload, ModalFolderCreate } from "./components/ModalButton";
import {
  logoutButton,
  loginButton,
  registerButton,
} from "./components/LoginButton";

export class Engine {
  constructor(resultsContainerSelector, navbarSpace) {
    this.resultsContainer = document.querySelector(resultsContainerSelector);
    this.navbarSpace = document.querySelector(navbarSpace);
  }

  FormListener() {
    window.addEventListener("submit", (event) => {
      event.preventDefault();

      const elementId = event.target.id;
      if (elementId === "uploadForm") this.UploadFile(event);
      else if (elementId === "folderForm") this.CreateFolder(event);
      else if (elementId === "loginForm") this.LoginUser(event);
      else if (elementId === "registerForm") this.RegisterUser(event);
      else if (elementId === "editFileForm") this.EditFile(event);
    });

    window.addEventListener("click", (event) => {
      const elementId = event.target.id;
      if (elementId.startsWith("deleteButton")) {
        const fileId = elementId.split("_")[1];

        fetch(`http://localhost:8000/api/v1/files`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("access_token"),
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ fileId }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (res.status !== 200) {
              throw Error(data.message);
            } else {
              return data;
            }
          })
          .then((res) => {
            document.getElementById(`fileId_${fileId}`).remove();
          })
          .catch((err) => {
            console.log(`[ERROR]`, err.message);
          });
      } else if (elementId === "logoutBtn") {
        localStorage.removeItem("access_token");
        location.reload();
      } else if (elementId.startsWith("download")) {
        const fileId = elementId.split("_")[1];

        fetch(`http://localhost:8000/api/v1/files/serve/${fileId}`, {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        })
          .then(async (res) => {
            if (res.status !== 200) {
              const data = await res.json();
              throw Error(data.message);
            } else {
              const fileName = res.headers.get("X-File-Name");

              return {
                blob: await res.blob(),
                name: fileName,
              };
            }
          })
          .then(({ blob, name }) => {
            this.DownloadFile(blob, name);
          })
          .catch((err) => {
            console.log(`[ERROR]`, err.message);
          });
      }
    });
  }

  // DragListener() {
  //   window.addEventListener("dragstart", (event) => {
  //     event.dataTransfer.setData("itemDraggedId", event.target.id);
  //   });

  //   window.addEventListener("dragover", (event) => {
  //     console.log(event.target.classList.contains("drop"));

  //     if (event.target.classList.contains("drop")) {
  //       event.preventDefault();

  //       document
  //         .getElementById(event.target.id)
  //         .classList.add(["border"], ["border-success"]);
  //     }
  //   });

  //   window.addEventListener("dragleave", (event) => {
  //     if (event.target.classList.contains("drop")) {
  //       event.preventDefault();

  //       document
  //         .getElementById(event.target.id)
  //         .classList.remove(["border"], ["border-success"]);
  //     }
  //   });

  //   window.addEventListener("drop", (event) => {
  //     if (event.target.classList.contains("drop")) {
  //       event.preventDefault();

  //       const draggedId = event.dataTransfer.getData("itemDraggedId");
  //       const dropId = event.target.id;

  //       if (draggedId && dropId && draggedId !== dropId) {
  //         console.log("DraggedId", draggedId);
  //         console.log("DropId", dropId);

  //         document
  //           .getElementById(dropId)
  //           .classList.remove(["border"], ["border-success"]);
  //         document.getElementById(draggedId).remove();
  //       }
  //     }
  //   });
  // }

  UploadFile(event) {
    if (!file.value.length) return;

    let reader = new FileReader();

    reader.onload = (event) => {
      const { name, size, type } = document.getElementById("file").files[0];
      const formData = new FormData();
      const binary = new Uint8Array(event.target.result);
      const fileToUpload = new File([binary], name, {
        type,
      });

      formData.set("file-upload", fileToUpload);

      fetch("http://localhost:8000/api/v1/files/upload", {
        method: "POST",
        headers: {
          "Content-length": size,
          Authorization: localStorage.getItem("access_token"),
        },
        body: formData,
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.status !== 200) {
            throw Error(data.message);
          } else {
            return data;
          }
        })
        .then((res) => {
          document.getElementById("alertsBox").innerHTML = `
            <div class="alert alert-success" role="alert">
              Upload completed!
            </div>
            `;
          document.getElementById("file").value = "";

          const blob = new Blob([binary]);
          const url = URL.createObjectURL(blob);
          this.resultsContainer.innerHTML += fileTemplate(res.file, url);
        })
        .catch((err) => {
          document.getElementById("alertsBox").innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${err.message}
            </div>
            `;
          console.log(`[ERROR]`, err.message);
        });
    };

    reader.readAsArrayBuffer(file.files[0]);
  }

  GetUserFiles() {
    this.StartLoading("#homeLoadingSpinner");

    const userToken = localStorage.getItem("access_token");
    if (userToken) {
      fetch("http://localhost:8000/api/v1/files/list", {
        headers: { Authorization: userToken },
      })
        .then((res) => res.json())
        .then((res) => {
          this.EndLoading("#homeLoadingSpinner");
          // const allFiles = res.files.map((item) => {
          //   return fileTemplate(item);
          // });

          this.RenderFiles(res.files);

          // this.resultsContainer.innerHTML = allFiles;
        })
        .catch((e) => {
          this.EndLoading("#homeLoadingSpinner");
        });
    } else {
      this.EndLoading("#homeLoadingSpinner");
      this.resultsContainer.innerHTML = `<h1 class="text-center">You are not logged in</h1>`;
    }
  }

  RenderFiles(files) {
    const allFiles = files.filter((file) => !file.inFolder);
    for (var file of allFiles) {
      const currentFile = file;
      fetch(`http://localhost:8000/api/v1/files/serve/${currentFile.fileId}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      })
        .then(async (res) => {
          if (res.status !== 200) {
            const data = await res.json();
            throw Error(data.message);
          } else {
            return await res.blob();
          }
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);

          this.resultsContainer.innerHTML += fileTemplate(currentFile, url);
        })
        .catch((err) => {
          console.log(`[ERROR]`, err.message);
        });
    }
  }

  StartLoading(loadingElement) {
    document.querySelector(loadingElement).classList.remove("visible");
  }

  EndLoading(loadingElement) {
    document.querySelector(loadingElement).classList.add("invisible");
  }

  LoginUser() {
    const email = document.getElementById("loginEmailInput").value;
    const password = document.getElementById("loginPasswordInput").value;

    fetch("http://localhost:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          throw Error(data.message);
        } else {
          return data;
        }
      })
      .then((res) => {
        localStorage.setItem("access_token", res.accessToken);
        location.reload();
      })
      .catch((e) => {
        document.getElementById("loginAlertsBox").innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${e.message}
            </div>
            `;
        console.log(`[ERROR]`, e.message);
      });
  }

  RegisterUser() {
    const username = document.getElementById("registerUsernameInput").value;
    const email = document.getElementById("registerEmailInput").value;
    const password = document.getElementById("registerPasswordInput").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPasswordInput"
    ).value;

    if (password === confirmPassword) {
      fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ username, email, password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.status !== 200) {
            throw Error(data.message);
          } else {
            return data;
          }
        })
        .then((res) => {
          localStorage.setItem("access_token", res.accessToken);
          location.reload();
        })
        .catch((e) => {
          document.getElementById("registerAlertsBox").innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${e.message}
            </div>
            `;
          console.log(`[ERROR]`, e.message);
        });
    } else {
      document.getElementById("registerAlertsBox").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Password doesn't match
      </div>
      `;
    }
  }

  GetLoggedInfo() {
    if (localStorage.getItem("access_token")) {
      fetch("http://localhost:8000/api/v1/users/info", {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.status !== 200) {
            throw Error(data.message);
          } else {
            return data;
          }
        })
        .then((res) => {
          this.navbarSpace.insertAdjacentHTML(
            "beforebegin",
            logoutButton(res.username)
          );

          this.navbarSpace.insertAdjacentHTML("beforebegin", ModalButtonUpload);
          // this.navbarSpace.insertAdjacentHTML("beforebegin", ModalFolderCreate);
        })
        .catch((e) => {
          console.log(`[ERROR]`, err.message);

          this.navbarSpace.insertAdjacentHTML("beforebegin", loginButton);
          this.navbarSpace.insertAdjacentHTML("beforebegin", registerButton);
          localStorage.removeItem("access_token");
        });
    } else {
      this.navbarSpace.insertAdjacentHTML("beforebegin", loginButton);
      this.navbarSpace.insertAdjacentHTML("beforebegin", registerButton);
    }
  }

  CreateFolder(event) {
    const formData = new FormData();

    const folderName = event.target.elements[0].value;

    formData.set("name", folderName);

    fetch("http://localhost:8000/api/v1/files/create-folder", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          throw Error(data.message);
        } else {
          return data;
        }
      })
      .then((res) => {
        document.getElementById("folderAlertsBox").innerHTML = `
            <div class="alert alert-success" role="alert">
              Folder Created!
            </div>
            `;
        document.getElementById("folderNameInput").value = "";
        this.resultsContainer.innerHTML += fileTemplate(res.file);
      })
      .catch((err) => {
        document.getElementById("folderAlertsBox").innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${err.message}
            </div>
            `;
        console.log(`[ERROR]`, err.message);
      });
  }

  EditFile(event) {
    const id = event.target.elements[1].value;
    const name = event.target.elements[0].value;

    fetch("http://localhost:8000/api/v1/files/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        Authorization: localStorage.getItem("access_token"),
      },
      body: JSON.stringify({ fileId: id, name }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          throw Error(data.message);
        } else {
          return data;
        }
      })
      .then((res) => {
        location.reload();
      })
      .catch((e) => {
        document.getElementById("editFileAlertsBox").innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${e.message}
            </div>
            `;
        console.log(`[ERROR]`, e.message);
      });
  }

  DownloadFile(blob, fileName) {
    const aElement = document.createElement("a");
    const url = URL.createObjectURL(blob);

    aElement.setAttribute("href", url);
    aElement.setAttribute("download", fileName);
    aElement.click();

    URL.revokeObjectURL(url);

    aElement.remove();
  }
}
