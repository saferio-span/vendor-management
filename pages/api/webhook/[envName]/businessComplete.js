import connectDB from "../../../../config/connectDB";
connectDB()

export default async function handler(req,res)
{
    // const newWHResponse = new WHResponse({
	// 	...req.body,
	// });
	console.log("Business Complete Body")
	console.log(req.body);
	console.log("Business Complete Body End")


		res.status(200).send();
}