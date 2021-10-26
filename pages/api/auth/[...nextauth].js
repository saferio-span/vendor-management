import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export default NextAuth({
  session: {
      jwt: true
  },
  providers: [
    // OAuth authentication providers
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Facebook({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {  label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials, req) {
        
        // console.log(credentials.email)
        // console.log(credentials.password)
        console.log(`${credentials.url}/api/merchant/login`)
        try {
          const res = await axios.post(`${credentials.url}/api/merchant/login`,{
              email: credentials.email,
              password: credentials.password,
          })
          const user = await res.data
          console.log("User cred")
          console.log(user[0])
          return user[0]
        } catch (error) {
          console.log(error)
          return null
        }
        
        // console.log("Next Auth")
        // console.log(user)

        // console.log("Next auth user")
        //   // If no error and we have user data, return it
      
        // return {
        //   id:1,
        //   name:"John Saferio",
        //   email:"test@gmail.com"
        // }
      } 
  }),
  ],
  pages:{
      signIn: '/login'
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
})