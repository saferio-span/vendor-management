import React,{useState} from 'react'
import Select from 'react-select'
import { useUserValue } from '../../contexts/UserContext'
import { toast,ToastContainer } from "react-toastify"
import DatePicker from "react-datepicker";
import axios from 'axios'
import { useRouter } from 'next/router';
import "react-datepicker/dist/react-datepicker.css"
import $ from 'jquery';

const AddTransaction = ({affiliates,defaultAffiliate}) => {

    const router = useRouter();
    const options = []
    const [{ user_details,environment }, dispatch] = useUserValue();
    const sequenceId = Math.floor((Math.random() * 1000000000) + 1)

    let affiliateName = affiliates.map(affiliate =>{
        if(affiliate.payeeRef === defaultAffiliate)
        {
            return affiliate.name
        }
    })
    // console.log(user_details)
    const [values, setValues] = useState({
		amount:'',
        whAmount:'',
        payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
        description:'',
        sequenceId: sequenceId,
        date: '',
	});

    const [validateValues, setValidateValues] = useState({
		amount:'',
        payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
        sequenceId: sequenceId,
        date: '',
	});

    // const [affiliateName,setName] = useState("")

    for(const key in affiliates )
    {
        
        options.push({ value: affiliates[key].payeeRef, label: affiliates[key].name })

        // if(defaultAffiliate !== "")
        // {
        //     if(affiliates.affiliates[key].payeeRef === defaultAffiliate)
        //     {
        //         console.log(affiliates.affiliates[key].name)
        //         setName(affiliates.affiliates[key].name)
        //     }
        // }
    }

    const closeModel = (e)=>{
        setValues({
            amount:'',
            payeeRef : '',
            description:'',
            date: '',
        })
    }

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, payeeRef: e.value });
            setValidateValues({ ...validateValues, payeeRef: e.value });
        }
        else
        {
            setValues({ ...values, payeeRef: "" });
            setValidateValues({ ...validateValues, payeeRef: "" });
        }
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });

        if(name !== "whAmount" && name !== "description")
        {
            console.log(name)
            setValidateValues({ ...validateValues, [name]: value });
        }
	};

    const handleDateChange = (e) => {
        setValues({ ...values, date: e });
        setValidateValues({ ...validateValues, date: e });
	};
    

    const handleSubmit = async (e)=>{
        e.preventDefault()
        console.log(validateValues)

        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }
            
            const res = await axios.post(`/api/merchant/postTransaction`,{
                amount: values.amount,
                payeeRef : values.payeeRef,
                description : values.description,
                businessId : user_details.businessID,
                payerRef : user_details.payerRef,
                selectedDate : values.date,
                sequenceId : values.sequenceId,
                whAmount: values.whAmount,
                envName: environment ? environment.name : localStorage.getItem("env")
            })
            const result = await res.data

            if(res.status == 200)
            {
                console.log(`Transaction Result`)
                console.log(result)
                if(result)
                {
                    setValues({
                        amount:'',
                        payeeRef : '',
                        description:'',
                        date: '',
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
                }
                toast("Transaction added successfully")
            }
            // else
            // {
            //     console.log(res.data)
            //     toast.error(res.data)
            //     return false
            // }

            if(res.status != 200)
            {
                // console.log(`401 Res`)
                toast.error(res.data.Message)
                // console.log(res)
            }

    }

    return (
        <>
            <div key={`aff${defaultAffiliate}`} className="modal fade" id={defaultAffiliate !== "" ? `addPaymentModal${defaultAffiliate}` : `addPaymentModal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={defaultAffiliate !== "" ? `staticBackdropLabel${defaultAffiliate}` : `staticBackdropLabel`} >Add Payments</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeModel} aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Sequence Id<span className="text-danger font-weight-bold">*</span></label>
                                            <input type="text" className="form-control" name="sequenceId" value={values.sequenceId} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            {defaultAffiliate !== "" ?
                                            <>
                                                <label htmlFor="amount">Affiliate</label>
                                                <h5 className="mt-1">
                                                    {affiliateName}
                                                </h5>
                                            </>
                                            :
                                            <>
                                                <label htmlFor="state">Select Affiliate<span className="text-danger font-weight-bold">*</span></label>
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
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Date<span className="text-danger font-weight-bold">*</span></label>
                                            <DatePicker selected={values.date } className="form-control" onChange={handleDateChange} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Amount<span className="text-danger font-weight-bold">*</span></label>
                                            <input type="text" className="form-control" name="amount" value={values.amount} onChange={handleInputChange} />
                                        </div>    
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Withheld Amount</label>
                                            <input type="text" className="form-control" name="whAmount" value={values.whAmount} onChange={handleInputChange} />
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
                                <button type="button" className="btn btn-secondary" onClick={closeModel} data-bs-dismiss="modal">Close</button>
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
