
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { 
    type: String,
    default: 'guest'
  },
  email: {
    type: String
  },
  password: { 
    type: String
  },
  image: { 
    type: String,
    default: null
  },
  emailVerified: { 
    type: String, 
    default: null 
  },
  userType: { 
    type: String, 
    default: null 
  },
  userDetailsId: { 
    type: String, 
    default: null 
  },
}, { timestamps: true })

// UserSchema.methods.comparePassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

let Dataset = mongoose.models.users || mongoose.model('users', UserSchema)
export default Dataset;