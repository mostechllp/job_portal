export const verificationTemplate = (user, otp) => ({
  subject: "Verify your CareerHub Account",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Main Card -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -8px rgba(79, 70, 229, 0.2); overflow: hidden; border: 1px solid #eef2f6;">
          
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
            <div style="width: 70px; height: 70px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill="white"/>
              </svg>
            </div>
            <h1 style="color: black; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to CareerHub! 🚀</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 10px; font-weight: 400;">You're just one step away from your dream job</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid #ddd6fe;">
              <p style="color: #1e293b; font-size: 18px; font-weight: 500; margin: 0 0 10px 0;">Hello <span style="color: #4f46e5; font-weight: 700;">${user.name}</span>,</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Please verify your email address to activate your account and start your journey with CareerHub.</p>
              
              <!-- OTP Container -->
              <div style="background: white; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 6px -2px rgba(79, 70, 229, 0.1); border: 1px solid #e0e7ff;">
                <p style="color: #64748b; font-size: 14px; font-weight: 500; letter-spacing: 1px; margin: 0 0 10px 0; text-transform: uppercase;">Verification Code</p>
                <div style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #4f46e5; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 10px 0;">
                  ${otp}
                </div>
                <div style="width: 100px; height: 4px; background: linear-gradient(90deg, #4f46e5, #7c3aed); margin: 20px auto; border-radius: 2px;"></div>
                <p style="color: #ef4444; font-size: 14px; font-weight: 600; background: #fef2f2; display: inline-block; padding: 8px 16px; border-radius: 30px; border: 1px solid #fee2e2; margin: 0;">
                  ⏰ Expires in 10 minutes
                </p>
              </div>
            </div>

            <!-- Security Note -->
            <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">Security Tips</p>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">✓ Never share this OTP with anyone</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">✓ Our team will never ask for your password</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">✓ If you didn't request this, please ignore this email</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">© 2024 CareerHub. All rights reserved.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This email was sent to ${user.email}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `Hello ${user.name},\n\nYour CareerHub verification OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account with CareerHub, please ignore this email.`,
});

export const passwordResetTemplate = (user, otp) => ({
  subject: "Password Reset Request - CareerHub",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Main Card -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -8px rgba(245, 158, 11, 0.2); overflow: hidden; border: 1px solid #eef2f6;">
          
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); padding: 40px 30px; text-align: center;">
            <div style="width: 70px; height: 70px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill="white"/>
              </svg>
            </div>
            <h1 style="color: black; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Your Password 🔐</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 10px; font-weight: 400;">We received a request to reset your password</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid #fed7aa;">
              <p style="color: #1e293b; font-size: 18px; font-weight: 500; margin: 0 0 10px 0;">Hello <span style="color: #f97316; font-weight: 700;">${user.name}</span>,</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">We received a request to reset your password. Use the OTP below to proceed with resetting your password.</p>
              
              <!-- OTP Container -->
              <div style="background: white; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 6px -2px rgba(249, 115, 22, 0.1); border: 1px solid #fed7aa;">
                <p style="color: #64748b; font-size: 14px; font-weight: 500; letter-spacing: 1px; margin: 0 0 10px 0; text-transform: uppercase;">Password Reset Code</p>
                <div style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #f97316; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #f97316, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 10px 0;">
                  ${otp}
                </div>
                <div style="width: 100px; height: 4px; background: linear-gradient(90deg, #f97316, #f59e0b); margin: 20px auto; border-radius: 2px;"></div>
                <p style="color: #ef4444; font-size: 14px; font-weight: 600; background: #fef2f2; display: inline-block; padding: 8px 16px; border-radius: 30px; border: 1px solid #fee2e2; margin: 0;">
                  ⏰ Expires in 10 minutes
                </p>
              </div>
            </div>

            <!-- Important Note -->
            <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 32px; height: 32px; background: #f97316; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: black; font-size: 18px;">⚠️</span>
                </div>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">Important</p>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">• Didn't request this? Please ignore this email</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">• Never share this code with anyone</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">• For security, this link expires in 10 minutes</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">© 2024 CareerHub. All rights reserved.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This email was sent to ${user.email}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `Hello ${user.name},\n\nYour password reset OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
});

export const passwordResetSuccessTemplate = (user) => ({
  subject: "Password Reset Successful - CareerHub",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Main Card -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -8px rgba(34, 197, 94, 0.2); overflow: hidden; border: 1px solid #eef2f6;">
          
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
            <div style="width: 70px; height: 70px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
              </svg>
            </div>
            <h1 style="color: black; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Password Reset Successful! ✅</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 10px; font-weight: 400;">Your password has been changed successfully</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid #bbf7d0;">
              <p style="color: #1e293b; font-size: 18px; font-weight: 500; margin: 0 0 10px 0;">Hello <span style="color: #22c55e; font-weight: 700;">${user.name}</span>,</p>
              
              <!-- Success Message -->
              <div style="background: white; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 4px 6px -2px rgba(34, 197, 94, 0.1); border: 1px solid #bbf7d0;">
                <div style="width: 80px; height: 80px; background: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: black; font-size: 40px;">✓</span>
                </div>
                <h3 style="color: #166534; font-size: 24px; font-weight: 700; margin: 0 0 10px 0;">All Done!</h3>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">Your password has been successfully reset. You can now log in to your account with your new password.</p>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 32px; height: 32px; background: #22c55e; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: black; font-size: 18px;">→</span>
                </div>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">What's Next?</p>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">✓ You can now sign in with your new password</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">✓ Update your profile and preferences</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">✓ Start applying for your dream jobs</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">© 2024 CareerHub. All rights reserved.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This email was sent to ${user.email}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `Hello ${user.name},\n\nYour password has been successfully reset. You can now log in with your new password.\n\nIf you didn't make this change, please contact support immediately.`,
});