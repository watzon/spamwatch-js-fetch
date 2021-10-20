export type TokenPermission = 'Root' | 'Admin' | 'User';

export interface Token {
    id: number;
    permission: TokenPermission;
    token: string;
    userid: number;
    retired: boolean;
}