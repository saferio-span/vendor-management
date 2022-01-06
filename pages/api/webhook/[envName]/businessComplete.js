import connectDB from "../../../../config/connectDB";
import BusinessComplete from "../../../../models/businessCompleteModel"
import Merchant from "../../../../models/merchantModel"
connectDB()

export default async function handler(req,res)
{
	console.log("Business Complete Body")
	console.log(req.body);
	console.log("Business Complete Body End")
    const envName = req.query.envName
    // console.log(`Env name : ${envName}`)

    const businessHook = new BusinessComplete({
		...req.body,
        environment:envName
	});
    await businessHook.save();

    const merchant = new Merchant()
	merchant.businessName = req.body.BusinessNm
	merchant.businessID = req.body.BusinessId
    merchant.payerRef = req.body.PayerRef
    merchant.ein = req.body.TIN
    if(req.body.IsForeign == false)
    {
        merchant.address1 = req.body.USAddress.Address1
        merchant.address2 = req.body.USAddress.Address2
        merchant.city = req.body.USAddress.City
        merchant.state = req.body.USAddress.State
        merchant.zip = req.body.USAddress.ZipCd
    }
    else
    {
        merchant.address1 = req.body.ForeignAddress.Address1
        merchant.address2 = req.body.ForeignAddress.Address2
        merchant.city = req.body.ForeignAddress.City
        merchant.state = req.body.ForeignAddress.ProvinceOrStateNm
        merchant.country = req.body.ForeignAddress.Country
        merchant.zip = req.body.ForeignAddress.PostalCd
    }
	merchant.name = req.body.BusinessNm
	merchant.email = req.body.Email
	merchant.environment = envName

	merchant.save();

	res.status(200).send();
}