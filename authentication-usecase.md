

Authentication :
Signup: Form → API → MongoDB Profile → Success Toast
Login: Form → NextAuth → JWT Tokens → Session Cookie → UI Update
Refresh: Expired Access → Verify Refresh → New Access Token
Logout: Clear Session → Redirect → Show Login UI