export interface BaseRole {
    name: string;
    default: boolean;
}

export interface Role extends BaseRole {
    permissions: { action: Actions[number]; subject: Subjects[number]; conditions?: object }[];
}

export interface RoleFull extends Role, Doc {}
