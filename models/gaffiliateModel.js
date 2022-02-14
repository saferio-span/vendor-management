
import mongoose from 'mongoose'

const affiliateSchema = new mongoose.Schema({
  
  name: { 
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
  email: {
    type: String
  },
  password: { 
    type: String
  },
  payeeRef: { 
    type: String
  },
  w9Status : {
    type: String,
    default: '-'
  },
  formType :{
    type: String,
  },
  tinMatchingStatus : {
    type: String,
    default: '-'
  },
  pdfUrl:{
    type: String,
    default: '-'
  },
  environment: { 
    type: String
  },
  
}, { timestamps: true })

let Dataset = mongoose.models.affiliates || mongoose.model('gaffiliates', affiliateSchema)
export default Dataset;