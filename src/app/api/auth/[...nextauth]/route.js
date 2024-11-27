import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Make sure to import GoogleProvider
import CredentialsProvider from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoClient";
import {User} from "@/models/User"; // Assuming you have a User model in MongoDB
// import bcrypt from "bcryptjs"; // Import bcrypt for hashing passwords

export const authOptions = {
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if user exists in the database
        const user = await User.findOne({email: credentials.email});
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Return the user if credentials are valid
          return user;
        }

        return null;
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/login", // Custom login page
    signUp: "/signup", // Custom signup page (if you create one)
  },
  secret: process.env.SECRET, // Make sure you have a secret key in your .env file
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
