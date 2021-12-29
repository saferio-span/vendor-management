import mongoose from 'mongoose'

const PdfUrlSchema = new mongoose.Schema({
  SubmissionId: { 
    type: String,
  },
  RecordId:{
    type: String,
  },
  FileName:{
    type: String,
  },
  FilePath:{
    type: String,
  },
  Status: { 
    type: String
  },
  environment: {
		type: String,
	}
})

let Dataset = mongoose.models.PdfUrls || mongoose.model('PdfUrls', PdfUrlSchema)
export default Dataset;