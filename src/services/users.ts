import request from "./api";
import type { User, UserCreate, UserSettings } from "../types/users.ts";


export async function createUser(userData: UserCreate): Promise<User> {
  return request<UserCreate>(`/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}


export async function getUserSettings(userId: number): Promise<User> {
  return request<User>(`/users/${userId}`);
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
