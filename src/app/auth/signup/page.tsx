import { Auth } from "../../feature/auth"
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense fallback={<div>...</div>}>
      <Auth.RegisterForm />
    </Suspense>
  )
}

export default Page

