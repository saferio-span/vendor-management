import mongoose from 'mongoose'

const BusinessCompleteSchema = new mongoose.Schema({
  BusinessId:{
    type: String,
  },
  PayerRef:{
    type: String,
  },
  BusinessNm:{
    type: String,
  },
  TINType:{
    type: String,
  },
  TIN: { 
    type: String,
  },
  Email: { 
    type: String,
  },
  Phone: { 
    type: String,
  },
  IsForeign: { 
    type: Boolean,
  },
  USAddress: {
    Address1: { type: String },
    Address2: { type: String },
    City: { type: String },
    State: { type: String },
    ZipCd: { type: String },
  },
  ForeignAddress: {
    Address1: { type: String },
    Address2: { type: String },
    City: { type: String },
    ProvinceOrStateNm: { type: String },
    Country: { type: String },
    PostalCd: { type: String },
  },
  date: {
	type: Date,
	default: Date.now,
  },
  environment: {
	type: String,
  }
})

let Dataset = mongoose.models.BusinessComplete || mongoose.model('BusinessComplete', BusinessCompleteSchema)
export default Dataset;