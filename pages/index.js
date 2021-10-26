import { signOut,getSession } from "next-auth/client"

export const getServerSideProps = async (context)=>{
  const session = await getSession(context)

  if(!session)
  {
    return{
      redirect:{
        destination: '/merchant/login',
        permanent: false
      }
    }
  }

  return{
    props:{ session }
  }
}

export default function Home() {
  return (
    <div>
      <main>
        <div className="row">
          <div className="col-11">
            <h1>
              Vendor Management
            </h1>
          </div>
          <div className="col-1">
            <button className="btn btn-danger my-2" onClick={()=>signOut()}>Logout</button>
          </div>
        </div>
      </main>

      <footer>
       
      </footer>
    </div>
  )
}
