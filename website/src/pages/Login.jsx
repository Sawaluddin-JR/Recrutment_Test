import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <LoginForm
        title="Login"
        buttonText="Login"
        onRegisterClick={() => navigate('/register')}
      />
    </div>
  )
}
