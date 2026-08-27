import apiClient from "../../lib/apiClient";

/**
 * BACKEND CONTRACT (app/routers/auth.py, prefix /auth):
 * - POST /auth/register  JSON { username, password, contact_number, name, college }
 *     -> 201 { message }
 * - POST /auth/login  application/x-www-form-urlencoded { username, password }
 *     (FastAPI's OAuth2PasswordRequestForm — NOT JSON)
 *     -> 200 { access_token, refresh_token }
 * - POST /auth/refresh?token=<refresh_token>  -> { access_token, refresh_token }
 * - POST /auth/logout  (auth required)        -> { message }
 * - POST /auth/change_password (auth required) JSON { old_password, new_password }
 * - GET  /auth/me (auth required) -> { id, username, contact_number, name, college }
 */

export const registerRequest = async ({
  username,
  password,
  contactNumber,
  name,
  college,
}) => {
  const { data } = await apiClient.post("/auth/register", {
    username,
    password,
    contact_number: contactNumber,
    name,
    college,
  });
  return data;
};

export const loginRequest = async ({ username, password }) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const { data } = await apiClient.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data; // { access_token, refresh_token }
};

export const logoutRequest = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data; // { id, username, contact_number, name, college }
};

export const changePasswordRequest = async ({ oldPassword, newPassword }) => {
  const { data } = await apiClient.post("/auth/change_password", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return data;
};
