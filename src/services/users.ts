// services/users.ts
import request from "./api";
import type {
  User,
  UserCreate,
  UserSettings,
  UserLogin,
  UserResponse,
  UserWithSettings, // ← CHANGE THIS
} from "../types/users.ts";

export async function createUser(userData: UserCreate): Promise<UserResponse> {
  return request<UserResponse>(`/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials: UserLogin): Promise<UserResponse> {
  return request<UserResponse>(`/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function getUserSettings(userId: number): Promise<User> {
  return request<User>(`/users/${userId}`);
}

export async function getCurrentUser(): Promise<UserWithSettings> {
  return request<UserWithSettings>(`/users/me`); // ← NOW RETURNS FULL SETTINGS
}

export async function updateUserSettings(
  userId: number,
  userSettings: UserSettings
): Promise<UserWithSettings> { // ← RETURN FULL USER WITH SETTINGS
  return request<UserWithSettings>(`/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userSettings),
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
}

export async function requestPasswordReset(
  email: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });
}