import { RoleFull } from "./role";

export interface User {
  name: string;
  email: string;
  picture: string;
  google_identifier: string;
  role: string;
}

export interface UserWithRole extends User {
  full_role: RoleFull;
}

export interface UserFull extends User, Doc {}
