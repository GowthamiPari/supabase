// models/UserModel.ts
export interface UserModel {
    uid: string;
    email: string;
    createdAt: Date;
    lastLoginAt: Date;
    isActive: boolean;
    isEmailVerified: boolean;
  }
  
  export class UserModel {
    constructor(
      uid: string,
      email: string,
      createdAt: Date,
      lastLoginAt: Date,
      isActive = true,
      isEmailVerified = false
    ) {
      this.uid = uid;
      this.email = email;
      this.createdAt = createdAt;
      this.lastLoginAt = lastLoginAt;
      this.isActive = isActive;
      this.isEmailVerified = isEmailVerified;
    }
  
    static fromSupabase(data: any): UserModel {
      return new UserModel(
        data.uid,
        data.email ?? "",
        new Date(data.created_at),
        new Date(data.last_login_at),
        data.is_active ?? true,
        data.is_email_verified ?? false
      );
    }
  
    toSupabase(): Record<string, any> {
      return {
        uid: this.uid,
        email: this.email,
        created_at: this.createdAt.toISOString(),
        last_login_at: this.lastLoginAt.toISOString(),
        is_active: this.isActive,
        is_email_verified: this.isEmailVerified,
      };
    }
  }
  