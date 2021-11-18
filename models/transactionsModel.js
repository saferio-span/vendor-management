
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  
  sequenceId: { 
    type: String,
  },
  txnAmt:{
    type: String,
  },
  description:{
    type: String,
  },
  payeeRef: { 
    type: String
  },
  payerRef: { 
    type: String
  },
  businessID:{
    type: String,
  },
  transactionDate:{
    type: Date,
  }
}, { timestamps: true })

let Dataset = mongoose.models.transactions || mongoose.model('transactions', transactionSchema)
export default Dataset;