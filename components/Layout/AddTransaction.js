import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import { useUserValue } from '../../contexts/UserContext'
import { toast,ToastContainer } from "react-toastify"
import DatePicker from "react-datepicker";
import axios from 'axios'
import { useRouter } from 'next/router';
import "react-datepicker/dist/react-datepicker.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import moment from 'moment'
import $ from "jquery"

const AddTransaction = ({affiliates,defaultAffiliate}) => {

    const router = useRouter();
    const options = []
    const [{ user_details,environment }, dispatch] = useUserValue();
    const sequenceId = Math.floor((Math.random() * 1000000000) + 1)
    const [envName,setEnvName] = useState()
    const transactions = []
    const [multipleTransactions,setMultipleTransactions]=useState([])
    const [updateState,setUpdateState] = useState(false)
    const [transIndex,setTransIndex] = useState()

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

    useEffect(() => {
        setEnvName(localStorage.getItem("env"))
        // console.log(multipleTransactions)
    }, [multipleTransactions])

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

    const handleAddTransaction = ()=>{
        console.log("Add is called")
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in required fields")
            return false
        }
        else
        {
            
            const data = {
                amount: values.amount,
                payeeRef : defaultAffiliate ? defaultAffiliate : values.payeeRef,
                description : values.description,
                selectedDate : values.date,
                sequenceId : values.sequenceId,
                whAmount: values.whAmount,
            }
            // console.log(data)
            // transactions.push(data)
            setMultipleTransactions(previousState=>([...previousState,data]))
            setValues({
                amount:'',
                whAmount:'',
                payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
                description:'',
                sequenceId: sequenceId,
                date: '',
            })
            setValidateValues({
                amount:'',
                payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
                sequenceId: sequenceId,
                date: '',
            })
        }
    }

    const handleEditTrans = (e)=>{
        // console.log(e)
        setUpdateState(true)
        setTransIndex(e)
        multipleTransactions.forEach((trans, index)=>{
            if(index == e)
            {
                setValues({
                    amount:trans.amount,
                    whAmount:trans.whAmount,
                    payeeRef: trans.payeeRef,
                    description:trans.description,
                    sequenceId: trans.sequenceId,
                    date: trans.selectedDate 
                });
                setValidateValues({ 
                    amount:trans.amount,
                    payeeRef :trans.payeeRef ,
                    sequenceId:trans.sequenceId,
                    date:trans.selectedDate
                });
            }
        })
        
    }

    const handleUpdateTransaction = ()=>{
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in required fields")
            return false
        }
        else
        {
            const updatedTransaction = []
            multipleTransactions.forEach((trans, index)=>{
                if(index == transIndex)
                {
                    updatedTransaction.push({
                        amount:values.amount,
                        whAmount:values.whAmount,
                        payeeRef: values.payeeRef,
                        description:values.description,
                        sequenceId: values.sequenceId,
                        selectedDate: values.date 
                    })
                }
                else
                {
                    updatedTransaction.push(trans)
                }
            })
            setMultipleTransactions(updatedTransaction)
            setValues({
                amount:'',
                whAmount:'',
                payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
                description:'',
                sequenceId: sequenceId,
                date: '',
            })
            setValidateValues({
                amount:'',
                payeeRef : defaultAffiliate !== "" ? defaultAffiliate : '' ,
                sequenceId: sequenceId,
                date: '',
            })
            setUpdateState(false)
            setTransIndex("")
        }
    }

    const handleDeleteTrans = (e)=>{
        // console.log(e)
        const updatedTransaction = []
        multipleTransactions.forEach((trans, index)=>{
            if(index != e)
            {
                updatedTransaction.push(trans)
            }
        })
        setMultipleTransactions(updatedTransaction)
    }
    

    const handleSubmit = async ()=>{
        // e.preventDefault()
        console.log("Submit is called")
        console.log(multipleTransactions)
        const payeeRefs= []
        if(defaultAffiliate != "")
        {
            payeeRefs.push(defaultAffiliate)
        }
        else
        {
            multipleTransactions.forEach((trans)=>{
                const alreadyExists = payeeRefs.find(id=>id==trans.payeeRef)
                if(alreadyExists == undefined)
                {
                    payeeRefs.push(trans.payeeRef)
                }
            })
        }
        console.log(payeeRefs)

            const res = await axios.post(`/api/merchant/postTransaction`,{
                payeeRefs : payeeRefs,
                businessId : user_details.businessID,
                payerRef : user_details.payerRef,
                transactions:multipleTransactions,
                envName: envName
            })
            const result = await res.data
            console.log(result)

            // if(true)
            if(res.status == 200)
            {
                console.log(`Transaction Result`)
                // console.log(result)
                
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
                setMultipleTransactions([])
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
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={defaultAffiliate !== "" ? `staticBackdropLabel${defaultAffiliate}` : `staticBackdropLabel`} >Add Payments</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeModel} aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Sequence Id<span className="text-danger font-weight-bold">*</span></label>
                                            <input type="text" className="form-control" name="sequenceId" value={values.sequenceId} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            {defaultAffiliate !== "" ?
                                            <>
                                                <label htmlFor="amount">Payee</label>
                                                <h5 className="mt-1">
                                                    {affiliateName}
                                                </h5>
                                            </>
                                            :
                                            <>
                                                <label htmlFor="state">Select Payee<span className="text-danger font-weight-bold">*</span></label>
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
                                                    id="transAff"
                                                />
                                            </>}
                                            
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Date<span className="text-danger font-weight-bold">*</span></label>
                                            <DatePicker selected={values.date } className="form-control" onChange={handleDateChange} />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Amount<span className="text-danger font-weight-bold">*</span></label>
                                            <input type="text" className="form-control" name="amount" value={values.amount} onChange={handleInputChange} />
                                        </div>    
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            <label htmlFor="amount">Withheld Amount</label>
                                            <input type="text" className="form-control" name="whAmount" value={values.whAmount} onChange={handleInputChange} />
                                        </div>    
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group my-2">
                                            <label htmlFor="description">Description</label>
                                            <input type="text" className="form-control" name="description" value={values.description} onChange={handleInputChange} />
                                            {/* <textarea className="form-control" name="description" rows="3" onChange={handleInputChange} value={values.description} ></textarea> */}
                                        </div>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center my-3">
                                        {updateState && <><button className="btn btn-success" onClick={handleUpdateTransaction}>Update <i className="bi bi-pencil-square"></i></button></>}
                                        {!updateState && <><button className="btn btn-info" onClick={handleAddTransaction}>Add <i className="bi bi-plus-circle"></i></button></>}
                                        
                                    </div>
                                </div>
                                {
                                    multipleTransactions.length > 0 && <>
                                        <div className="row">
                                            <table className='tabel table-hover table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Payee</th>
                                                        <th scope="col">Sequence Id</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Amount</th>
                                                        <th scope="col">Wh Amount</th>
                                                        <th scope="col">Description</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        multipleTransactions.map((trans, index)=>{
                                                            let aff = defaultAffiliate !== "" ? affiliateName : ""
                                                            if(aff == "")
                                                            {
                                                                options.forEach(option => {
                                                                    if(option.value === trans.payeeRef){
                                                                        aff = option.label
                                                                    }
                                                                })
                                                            }
                                                            return(<>
                                                                <tr>
                                                                    <td>{index+1}</td>
                                                                    <td>{aff}</td>
                                                                    <td>{trans.sequenceId}</td>
                                                                    <td>{trans.date ? moment(trans.date).format("Do MMM YYYY") : moment(trans.selectedDate).format("Do MMM YYYY")}</td>
                                                                    <td>{trans.amount}</td>
                                                                    <td>{trans.whAmount ? trans.whAmount : "-"}</td>
                                                                    <td>{trans.description ? trans.description : "-"}</td>
                                                                    <td>
                                                                        <button className='btn btn-primary mx-1' onClick={()=>handleEditTrans(index)}><i className="bi bi-pencil-square"></i></button>
                                                                        <button className='btn btn-danger mx-1' onClick={()=>{if(window.confirm("Are you sure? You want to delete this record !")){
                                                                            handleDeleteTrans(index)
                                                                        }}}><i className="bi bi-trash"></i></button>
                                                                    </td>
                                                                </tr>
                                                            </>)
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModel} data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                                {/* <input type="submit" name="submit" className="btn btn-primary" onClick={handleSubmit} /> */}
                            </div>
                        
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTransaction