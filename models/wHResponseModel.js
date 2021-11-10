const mongoose = require('mongoose');

const W9FormSchema = new mongoose.Schema({
	Line1Nm: {
		type: String,
	},
	Line2Nm: {
		type: String,
	},
	TINType: {
		type: String,
	},
	TIN: {
		type: String,
	},
	Address: {
		Address1: { type: String },
		Address2: { type: String },
		City: { type: String },
		State: { type: String },
		ZipCd: { type: String },
	},
	FederalTaxClassification: {
		type: String,
	},
	OtherClassification: {
		type: String,
	},
	ExemptPayeeCd: {
		type: String,
	},
	ExemptFromFATCA: {
		type: String,
	},
	IsBackUpWH: {
		type: Boolean,
	},
});

const W8BenFormSchema = new mongoose.Schema({
	NmOfIndividual: {
		type: String,
	},
	CitizenOfCountry: {
		type: String,
	},
	USTINType: {
		type: String,
	},
	USTIN: {
		type: String,
	},
    ForeignTIN: {
		type: String,
	},
    DOB: {
		type: String,
	},
	PermanentAddress: {
		Address: { type: String },
		City: { type: String },
		State: { type: String },
		Country: { type: String },
		ZipCd: { type: String },
	},
    MailingAddress: {
		Address: { type: String },
		City: { type: String },
		State: { type: String },
		Country: { type: String },
		ZipCd: { type: String },
	},
    TaxTreatyBenefits: {
		BeneficiaryCountry: { type: String },
		ClaimingProvArticlePara: { type: String },
		RateOfWH: { type: String },
		TypeOfIncome: { type: String },
		AdditionalConditions: { type: String },
	},
	Signature: {
		SignerNm: { type: String },
		CapacityInWhichActing: { type: String },
	},
});

const TinMatchingSchema = new mongoose.Schema({
	Status: {
		type: String,
	},
	StatusMsg: {
		type: String,
	},
	StatusTs: {
		type: Date,
	},
	Errors: {
		type: Array,
	},
});

const W9RequesterSchema = new mongoose.Schema({
	BusinessId: {
		type: String,
	},
	PayerRef: {
		type: String,
	},
	BusinessNm: {
		type: String,
	},
	TINType: {
		type: String,
	},
	TIN: {
		type: String,
	},
});
const W9ResponseSchema = new mongoose.Schema({
	SubmissionId: {
		type: String,
		default: '0000000000000000',
	},
	RecipientId: {
		type: String,
		default: '0000000000000000',
	},
	PayeeRef: {
		type: String,
		default: '0000000000000000',
	},
	Requester: {
		type: W9RequesterSchema,
	},
	FormW9RequestType: {
		type: String,
	},
	W9Status: {
		type: String,
	},
	DeclainedReason: {
		type: String,
	},
	StatusTs: {
		type: Date,
	},
	PdfUrl: {
		type: String,
	},
	Email: {
		type: String,
	},
	TINMatching: {
		type: TinMatchingSchema,
	},
	FormData: {
		type: W9FormSchema,
	},
	Errors: {
		type: Array,
	},
});

const W8BenResponseSchema = new mongoose.Schema({
	SubmissionId: {
		type: String,
		default: '0000000000000000',
	},
    Requester: {
		type: W9RequesterSchema,
	},
	PayeeRef: {
		type: String,
		default: '0000000000000000',
	},
    W8BENStatus: {
		type: String,
	},
    StatusTs: {
		type: String,
	},
	FormW8BENRequestType: {
		type: String,
	},
	PdfUrl: {
		type: String,
	},
	Email: {
		type: String,
	},
	FormData: {
		type: W8BenFormSchema,
	},
	Errors: {
		type: Array,
	},
});

const WHResponseSchema = new  mongoose.Schema({
	FormType: {
		type: String,
	},
	FormW9: {
		type: W9ResponseSchema,
	},
    FormW8Ben: {
		type: W8BenResponseSchema,
	},
	Errors: {
		type: Array,
        default:null
	},
    date: {
		type: Date,
		default: Date.now,
	},
});

let Dataset = mongoose.models.whResponse || mongoose.model('whResponse', WHResponseSchema)
export default Dataset;