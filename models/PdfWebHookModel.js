import mongoose from 'mongoose'

const FormData = new mongoose.Schema({
	RecordId: {
		type: String,
	},
	SequenceId: {
		type: String,
	},
	FileName: {
		type: String,
	},
    FilePath: {
		type: String,
	},
    Status: {
		type: String,
	},
    StatusTime: {
		type: String,
	},
    Errors: {
		type: Array,
        default:null
	},
});

const PdfHookSchema = new mongoose.Schema({
  SubmissionId: { 
    type: String,
  },
  BusinessId:{ 
    type: String,
  },
  PayerRef:{ 
    type: String,
  },
  FormType:{
    type: String,
  },
  Records:{ 
    type: [FormData]
  },
  date: {
		type: Date,
		default: Date.now,
  },
  environment: {
		type: String,
	}
})

let Dataset = mongoose.models.PdfHook || mongoose.model('PdfHook', PdfHookSchema)
export default Dataset;