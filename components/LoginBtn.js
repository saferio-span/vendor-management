import { signIn } from "next-auth/client"

const LoginBtn = ({provider,bgColor,txtColor}) => {
    return (
        <div>
            <button className="btn w-100 my-2 py-3"
            style={{background: `${bgColor}`, color:`${txtColor}`}} onClick={()=>signIn(provider.id)}>
                Sign in with {provider.name}
            </button>
        </div>
    )
}

export default LoginBtn
