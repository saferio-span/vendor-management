
import mongoose from 'mongoose'

const Records1099Schema = new mongoose.Schema({
  SubmissionId: { 
    type: String,
  },
  BusinessId:{
    type: String,
  },
  PayerRef:{
    type: String,
  },
  TaxYear:{
    type: String,
  },
  RecordId: { 
    type: String
  },
  RecipientId: { 
    type: String
  },
  PayeeRef:{
    type: String,
  },
  NECBox1:{
    type: String,
  },
  NECBox4:{
    type: String,
  },
  FederalReturnStatus:{
    type: String,
  },
  FederalReturnStatusTs:{
    type: String,
  },
  FederalReturnInfo:{
    type: String,
  }
})

let Dataset = mongoose.models.Records1099 || mongoose.model('Records1099', Records1099Schema)
export default Dataset;