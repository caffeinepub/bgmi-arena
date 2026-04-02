import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<{
        username: string;
        bgmiUid: string;
        avatar: string;
    } | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<{
        username: string;
        bgmiUid: string;
        avatar: string;
    } | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: {
        username: string;
        bgmiUid: string;
        avatar: string;
    }): Promise<void>;
}
