import request from "./api";
import type {
  User,
  UserCreate,
  UserSettings,
  UserLogin,
  UserResponse,
  UserWithTier,
} from "../types/users.ts";

export async function createUser(userData: UserCreate): Promise<UserResponse> {
  return request<UserResponse>(`/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials: UserLogin): Promise<UserResponse> {
  return request<UserResponse>(`/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export async function getUserSettings(userId: number): Promise<User> {
  return request<User>(`/users/${userId}`);
}

export async function getCurrentUser(): Promise<UserWithTier> {
  return request<UserWithTier>(`/users/me`);
}

export async function updateUserSettings(
  userId: number,
  userSettings: UserSettings
): Promise<User> {
  return request<User>(`/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userSettings),
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
}
