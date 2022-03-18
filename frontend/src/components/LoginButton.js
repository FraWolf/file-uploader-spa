export const loginButton = `
<button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>

<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-dark" id="loginModalLabel">Login</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="loginForm">
        <div class="modal-body">
                <div id="loginAlertsBox"></div>
                <div class="mb-3">
                  <label for="loginEmailInput" class="form-label">Email</label>
                  <input type="email" class="form-control" id="loginEmailInput" required>
                </div>
                <div class="mb-3">
                  <label for="loginPasswordInput" class="form-label">Password</label>
                  <input type="password" class="form-control" id="loginPasswordInput" required>
                </div>
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" id="uploadButton">Login</button>
        </div>
      </form>
    </div>
  </div>
</div>
`;

export const registerButton = `
<button class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>

<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-dark" id="registerModalLabel">Login</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="registerForm">
        <div class="modal-body">
                <div id="registerAlertsBox"></div>
                <div class="mb-3">
                  <label for="registerUsernameInput" class="form-label">Username</label>
                  <input type="text" class="form-control" id="registerUsernameInput" required>
                </div>
                <div class="mb-3">
                  <label for="registerEmailInput" class="form-label">Email</label>
                  <input type="email" class="form-control" id="registerEmailInput" required>
                </div>
                <div class="mb-3">
                  <label for="registerPasswordInput" class="form-label">Password</label>
                  <input type="password" class="form-control" id="registerPasswordInput" required>
                </div>
                <div class="mb-3">
                  <label for="registerConfirmPasswordInput" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="registerConfirmPasswordInput" required>
                </div>
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" id="uploadButton">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>

`;

export const logoutButton = (username) => {
  return `
    <div class="me-2">
        <div class="d-flex align-items-center text-end">
            <span class="text-white me-2">Logged as ${username}</span>
            <button class="btn btn-danger" id="logoutBtn">Logout</button>
        </div>
    </div>
`;
};
