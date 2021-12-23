
import mongoose from 'mongoose'

const envSchema = new mongoose.Schema({
  name: { 
    type: String,
  },
  clientId:{
    type: String,
  },
  clientSecret:{
    type: String,
  },
  userToken:{
    type: String,
  },
  environment: { 
    type: String
  },
  authUrl: { 
    type: String
  },
  apiUrl:{
    type: String,
  }
})

let Dataset = mongoose.models.environments || mongoose.model('environments', envSchema)
export default Dataset;