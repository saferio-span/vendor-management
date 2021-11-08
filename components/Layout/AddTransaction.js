import React,{useState} from 'react'
import moment from 'moment'
import Select from 'react-select'
import { useUserValue } from '../../contexts/UserContext'
import { toast,ToastContainer } from "react-toastify"
import { actionTypes } from "../../contexts/userReducer"
import axios from 'axios'
import { useRouter } from 'next/router';
import $ from 'jquery'; 

const AddTransaction = ({affiliates,defaultAffiliate}) => {

    const router = useRouter();
    const options = []
    const [{ user_details }, dispatch] = useUserValue();

    let affiliateName = affiliates.map(affiliate =>{
        if(affiliate.payeeRef === defaultAffiliate)
        {
            return affiliate.name
        }
    })
    // console.log(user_details)
    const [values, setValues] = useState({
		amount:'',
        payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
        description:'',
	});

    // const [affiliateName,setName] = useState("")

    for(const key in affiliates.affiliates )
    {
        
        options.push({ value: affiliates.affiliates[key].payeeRef, label: affiliates.affiliates[key].name })

        // if(defaultAffiliate !== "")
        // {
        //     if(affiliates.affiliates[key].payeeRef === defaultAffiliate)
        //     {
        //         console.log(affiliates.affiliates[key].name)
        //         setName(affiliates.affiliates[key].name)
        //     }
        // }
    }

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, payeeRef: e.value });
        }
        else
        {
            setValues({ ...values, payeeRef: "" });
        }
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    const handleSubmit = async (e)=>{
        e.preventDefault()
        // console.log(values)

        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        try {
            const res = await axios.post(`/api/merchant/postTransaction`,{
                amount: values.amount,
                payeeRef : values.payeeRef,
                description : values.description,
                businessId : user_details.businessID,
                payerRef : user_details.payerRef
            })
            const result = await res.data

            console.log(`Transaction Result`)
            console.log(result)
            if(result)
            {
                setValues({
                    amount:'',
                    payeeRef : '',
                    description:'',
                })

                router.replace(router.asPath);

                if(defaultAffiliate !== "")
                {
                    $(`#addPaymentModal${defaultAffiliate}`).hide();
                }
                else
                {
                    $(`#addPaymentModal`).hide();
                }
                
                $('.modal-backdrop').hide();
                Router.push('/merchant/transactions')
            }
            
          } catch (error) {
            console.log(error)
            return null
          }

    }

    return (
        <>
            <ToastContainer />
            <div className="modal fade" id={defaultAffiliate !== "" ? `addPaymentModal${defaultAffiliate}` : `addPaymentModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={defaultAffiliate !== "" ? `staticBackdropLabel${defaultAffiliate}` : `staticBackdropLabel`} >Add Payments</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            {defaultAffiliate !== "" ?
                                            <>
                                                <h5 className="mt-4 pt-3">
                                                    Affiliate : {affiliateName}
                                                </h5>
                                            </>
                                            :
                                            <>
                                                <label htmlFor="state">Select Affiliate</label>
                                                <Select
                                                    value = {
                                                        options.filter(option => option.value === values.payeeRef)
                                                    }
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    defaultValue="0"
                                                    isSearchable="true"
                                                    isClearable="true"
                                                    name="affiliates"
                                                    options={options}
                                                    onChange={handleSelectChange}
                                                />
                                            </>}
                                            
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h5 className="mt-4 pt-3">
                                            Date : {moment().format("DD-MM-YYYY")}
                                        </h5>
                                        
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Amount</label>
                                            <input type="text" className="form-control" name="amount" value={values.amount} onChange={handleInputChange} />
                                        </div>    
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            <label htmlFor="description">Description</label>
                                            <textarea className="form-control" name="description" rows="3" onChange={handleInputChange} value={values.description} ></textarea>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <input type="submit" name="submit" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTransaction
