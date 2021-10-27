
import mongoose from 'mongoose'

const affiliateSchema = new mongoose.Schema({
  
  name: { 
    type: String,
  },
  merchantID:{
    type: String,
    default: null
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
  email: {
    type: String
  },
  password: { 
    type: String
  },
  payeeRef: { 
    type: String
  },
  
}, { timestamps: true })

let Dataset = mongoose.models.affiliates || mongoose.model('affiliates', affiliateSchema)
export default Dataset;