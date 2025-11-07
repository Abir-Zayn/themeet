
import { Suspense } from "react"
import { Auth } from "../../feature/auth"

const LoginPage = () => {
  return (
    <Suspense>
      <Auth.LoginForm />
    </Suspense>
  )
}

export default LoginPage