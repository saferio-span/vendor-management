
import mongoose from 'mongoose'

const merchantSchema = new mongoose.Schema({
  
  businessName: { 
    type: String,
  },
  businessID:{
    type: String,
    default: null
  },
  ein: { 
    type: String,
  },
  address1: { 
    type: String,
  },
  address2: { 
    type: String,
  },
  city: { 
    type: String,
  },
  state: { 
    type: String,
  },
  zip: { 
    type: String,
  },
  name: { 
    type: String,
  },
  email: {
    type: String
  },
  password: { 
    type: String
  },
  payerRef: { 
    type: String
  },
  environment: { 
    type: String
  },
  
}, { timestamps: true })

let Dataset = mongoose.models.merchants || mongoose.model('merchants', merchantSchema)
export default Dataset;