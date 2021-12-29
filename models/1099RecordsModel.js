
import mongoose from 'mongoose'

const FederalReturn = new mongoose.Schema({
	Status: {
		type: String,
	},
	StatusTs: {
		type: String,
	},
	Info: {
		type: String,
	}
});


const Form1099NECRecord = new mongoose.Schema({
	RecordId: {
		type: String,
	},
	RecipientId: {
		type: String,
	},
	PayeeRef: {
		type: String,
	},
	NECBox1: {
		type: String,
	},
	NECBox4: {
		type: String,
	},
  FederalReturn:{
    type: FederalReturn
  },
  TINMatching:{
    type: FederalReturn
  }
});

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
  NoOf1099s:{
    type: String,
  },
  Form1099NECRecords: { 
    type: [Form1099NECRecord]
  },
  environment: {
		type: String,
	}
})

let Dataset = mongoose.models.Records1099 || mongoose.model('Records1099', Records1099Schema)
export default Dataset;