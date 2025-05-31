import { createBrowserRouter } from 'react-router-dom'
// import { Dashboard } from './pages/app/dashboard/dashboard'

// import { AppLayout } from './pages/_layouts/app'
import { SignIn } from './pages/auth/sing-in'
import { AuthLayout } from './pages/_layouts/auth'
import { NotFound } from './pages/404'
import { SignUp } from './pages/auth/sing-up'
// import TimeSheet from './pages/app/timeSheet/TimeSheet'
import { AppLayout } from './pages/_layouts/app'
import Home from './pages/app/home/Home'
import Payment from './pages/app/payment/payment'

export const router = createBrowserRouter([

  {
    path: '/',
    // element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
       { path: '/', element: <Home /> },
       { path: '/payments', element: <Payment /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
])