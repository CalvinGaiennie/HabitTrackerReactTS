import request from "./api";
import type { User, UserSettings } from "../types/users.ts"

export async function getUserSettings(userId: number): Promise<User> {
    return request<User>(`/users/${userId}`)}

export async function updateUserSettings(userId: number, userSettings: UserSettings): Promise<User> {
    return request<User>(`/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ settings: userSettings})
    })
}