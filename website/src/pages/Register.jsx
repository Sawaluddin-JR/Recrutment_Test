import RegisterForm from '../components/RegisterForm'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <RegisterForm
        title="Create an Account"
        subtitle="Register to get started"
        buttonText="Register"
        darkMode={true}
        onBackToLogin={() => navigate('/login')}
      />
    </div>
  )
}
