// // /src/repositories/userRepo.ts

// import { supabase } from "@/utils/supabaseClient";
// import { UserModel } from "../models/userModel";


// export const UserRepository = {
//   /**
//    * Get user by UID.
//    * @param uid - User ID.
//    * @returns UserModel or null if not found.
//    */
//   async getUser(uid: string): Promise<UserModel | null> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("uid", uid)
//         .single();

//       if (error) {
//         console.error("Error getting user:", error.message);
//         return null;
//       }

//       return data ? UserModel.fromSupabase(data) : null;
//     } catch (error) {
//       console.error("Unexpected error getting user:", error);
//       return null;
//     }
//   },

//   /**
//    * Create or update user in the database.
//    * @param user - UserModel instance.
//    */
//   async createOrUpdateUser(user: UserModel): Promise<void> {
//     try {
//       const { error } = await supabase.from("users").upsert(user.toSupabase(), {
//         onConflict: "uid", // Ensures updates are applied when uid matches.
//       });

//       if (error) {
//         throw new Error(`Error creating/updating user: ${error.message}`);
//       }
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },

//   /**
//    * Update the user's last login timestamp.
//    * @param uid - User ID.
//    */
//   async updateLastLogin(uid: string): Promise<void> {
//     try {
//       const { error } = await supabase
//         .from("users")
//         .update({ last_login_at: new Date().toISOString() })
//         .eq("uid", uid);

//       if (error) {
//         throw new Error(`Error updating last login: ${error.message}`);
//       }
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },

//   /**
//    * Check if an email already exists in the database.
//    * @param email - Email address.
//    * @returns True if the email exists, false otherwise.
//    */
//   async doesEmailExist(email: string): Promise<boolean> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("email")
//         .eq("email", email)
//         .limit(1)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         // Ignore the "No data found" error (code: PGRST116)
//         throw new Error(`Error checking email existence: ${error.message}`);
//       }

//       return !!data; // Return true if data exists, false otherwise.
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   },
// };


import { supabase } from "@/utils/supabaseClient";
import { UserModel } from "../models/userModel";

export class UserRepository {
  async getUser(uid: string): Promise<UserModel | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .single();

      if (error) {
        console.error("Error getting user:", error.message);
        return null;
      }

      return data ? UserModel.fromSupabase(data) : null;
    } catch (error) {
      console.error("Unexpected error getting user:", error);
      return null;
    }
  }

  async createOrUpdateUser(user: UserModel): Promise<void> {
    try {
        console.log("Inserting/updating user:", user);
      const { data,error } = await supabase.from("users").insert(user.toSupabase());
      console.log("Inserted user:", data);
      // {
      //  onConflict: "uid",
    //  };

      if (error) {
        throw new Error(`Error creating/updating user: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateLastLogin(uid: string): Promise<void> {
    try {
      const {data, error } = await supabase
        .from("users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("uid", uid);
      console.log("data in updateLastLogin",data);
      if (error) {
        throw new Error(`Error updating last login: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
    /**
   * Get the current user's email from Supabase auth.
   * @returns The email of the authenticated user, or null if not authenticated.
   */
    async getCurrentUserEmail(): Promise<string | null> {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("data in getCurrentUserEmail",data.user?.email);
        if (error) {
          console.log("Error fetching current user:", error);
          return null;
        }
  
        return data?.user?.email || null;
      } catch (error) {
        console.error("Unexpected error fetching current user email:", error);
        return null;
      }
    }
    async getUserByEmail(email: string): Promise<any | null> {
      try {
        const { data, error } = await supabase
          .from('users') // Replace 'users' with your actual table name
          .select('*')   // Select all columns, or specify the ones you need
          .eq('email', email) // Match the email column
          .single();     // Ensures only one result is returned
    
        if (error) {
          console.error('Error fetching user by email:', error);
          return null;
        }
    
        return data;
      } catch (error) {
        console.error('Unexpected error fetching user by email:', error);
        return null;
      }
    }

//   async doesEmailExist(email: string): Promise<boolean> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("email")
//         .eq("email", email)
//         .limit(1)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         throw new Error(`Error checking email existence: ${error.message}`);
//       }

//       return !!data;
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   }
async doesEmailExist(email: string) {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .limit(1)
       
  console.log("data in doesEmailExist",data);
  if(data?.length == 0 || data?.length == null){
    return false;
  }
      if (error) {
        console.error("Error checking email existence:", error);
        if (error.code === "PGRST116") {
          // Handle "No data found" error gracefully
          return false;
        }
        throw new Error(`Error checking email existence: ${error.message}`);
      }
  
      return true; // Returns true if email exists, false otherwise
    } catch (error) {
      console.error("Unexpected error:", error);
      return false;
    }
  }
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(`Error logging out: ${error.message}`);
      }

      console.log("User successfully logged out.");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      throw error;
    }
  }
  
  
}
