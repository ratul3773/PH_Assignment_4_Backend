import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER ,
    pass: process.env.APP_PASS ,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins:[process.env.TRUSTED_ORIGINS || "http://localhost:4000"],
    user:{
        additionalFields:{
            role:{
                type: "string",
                defaultValue: "CUSTOMER",
                required: false
            },
            phoneNumber:{
                type: "string",
                required: false
            },
            address:{
                type: "string",
                required: false
            }
        }
    },
    emailAndPassword: { 
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
  }, 

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
    const verificationUrl = `${process.env.TRUSTED_ORIGINS}/api/auth/verify-email?token=${token}`;
    const info = await transporter.sendMail({
    from: `"FoodApp" <PrismaFoodApp@gmail.com>`,
    to: user.email,
    subject: "Verify your email for FoodApp 🍔",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#ff6f00; padding:20px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">FoodApp</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px; line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                Thanks for signing up for <strong>FoodApp</strong>!  
                Please confirm your email address to activate your account and start ordering your favorite food.
              </p>

              <!-- Button -->
              <p style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                   style="
                     background:#ff6f00;
                     color:#ffffff;
                     padding:14px 28px;
                     text-decoration:none;
                     font-size:16px;
                     border-radius:6px;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </p>

              <p style="font-size:14px; color:#666666; line-height:1.6;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px; word-break:break-all; color:#ff6f00;">
                ${verificationUrl}
              </p>

              <p style="font-size:14px; color:#666666; line-height:1.6;">
                If you didn’t create an account with FoodApp, you can safely ignore this email.
              </p>

              <p style="font-size:15px; margin-top:30px;">
                Happy eating! 🍕<br/>
                <strong>The FoodApp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#888888;">
              © ${new Date().getFullYear()} FoodApp. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  console.log("Message sent:", info.messageId);
    },
  },
});