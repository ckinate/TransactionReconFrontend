export class UserUpdateDto{
    firstName: string = "";
    lastName: string = "";
    isActive: boolean = false;
    newPassword?: string = "";
    currentPassword?: string = "";
    role?: string = "";
}