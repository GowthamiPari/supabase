import { supabase } from "@/utils/supabaseClient";
import { UserRepository } from "../repositories/userRepository";
import { verifyOTP } from "../api/otp";
import sgMail from '@sendgrid/mail';
class UserService {
    private repository: UserRepository;

    constructor() {
      this.repository = new UserRepository();
    //   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }
    //repository = new UserRepository();
  async sendOtp(email: string): Promise<boolean | string> {
    try {
    //   const isEmailExists = await this.doesEmailExist(email);
    console.log("Email in send otp method of service page:", email);
    const isEmailExists = await this.repository.doesEmailExist(email);
    console.log("Email exists:", isEmailExists);
      if (isEmailExists == false) {
        const tempPassword = this.generateSecurePassword();
        const { data,error } = await supabase.auth.signUp({
          email,
          password: tempPassword,
        });
        console.log("Data in send otp method of service page:", data);

        if (error) {
          console.error('Error creating user:', error.message);
          return false;
        }

        await this.createSupabaseUser(email);
      }

      // Use your OTP sending function here
      return await this.sendOtpEmail(email);
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  }

  async verifyOtpAndSignIn(formData:FormData): Promise<boolean> {
    const email = formData.get("email") as string;

    try {
      const otpVerified = await verifyOTP(formData);

      if (!otpVerified) {
        console.error('OTP verification failed');
        return false;
      }
      const mail = await this.repository.getUserByEmail(email);
      console.log("Email in verify otp and sign in method of service page:", mail);

    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password: '', // Temporary password should be replaced with actual password handling
    //   });
    const { data, error } = await supabase.auth.signInWithOtp({email});

      if (error) {
        if (error.message) {
          const tempPassword = this.generateSecurePassword();
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password: tempPassword,
          });

          if (signUpError) {
            console.error('Error creating user:', signUpError.message);
            return false;
          }

          //await this.createSupabaseUser(email);
        } else {
          console.error('Sign-in error:', error.message);
          return false;
        }
      } else {
        console.log('Sign-in successful:', data.user);
      }
    } catch (error) {
      console.error('General error:', error);
      return false;
    }

    return true;
  }

  private async doesEmailExist(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email existence:', error.message);
      return false;
    }

    return !!data;
  }

  private async createSupabaseUser(email: string): Promise<void> {
    const { error } = await supabase.from('users').insert({
      email,
      created_at: new Date(),
      last_login_at: new Date(),
      is_email_verified: false,
    });

    if (error) {
      console.error('Error creating user in Supabase:', error.message);
    }
  }

  private generateSecurePassword(): string {
    return Date.now().toString();
  }

  private async sendOtpEmail(email: string): Promise<boolean | string> {
    // Implement your email OTP sending logic here

    console.log(`Sending OTP to ${email}`);
    const { data, error } = await supabase.auth.signInWithOtp({email});
    console.log("Data in sendOtpEmail method of service page:", data);
    if (error) {
     // console.error('Error sending OTP email:', error.message);
      return error.message;
    }
    return true;
  }
private generateOtp(): string {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }
// private async sendOtpEmail(email: string): Promise<boolean> {
//     try {
//       // Generate OTP (For example, a random 6-digit number)
//       const otp = this.generateOtp();

//       // Prepare the email content
//       const msg = {
//         to: email,
//         from: 'your-email@example.com', // Your verified sender email
//         subject: 'Your OTP Code',
//         text: `Your OTP code is ${otp}`,
//         html: `<strong>Your OTP code is ${otp}</strong>`,
//       };

//       // Send email using SendGrid
//       const response = await sgMail.send(msg);

//       // Handle response from SendGrid (optional)
//       console.log('OTP email sent', response);
      
//       return true;
//     } catch (error) {
//       console.error('Error sending OTP email:', error);
//       return false;
//     }
//   }

  private async verifyOtp(otp: string): Promise<boolean> {
    // Implement your OTP verification logic here
    console.log(`Verifying OTP: ${otp}`);
    return true;
  }

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error.message);
      return null;
    }
    return data.user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  }
  
}


export default UserService;


