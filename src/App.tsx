import RootLayout from 'components/RootLayout';
import ErrorPage from 'pages/Error';
import Blog from 'pages/blog'
import Home from 'pages/home';
import { Fragment } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // {
      //   path: '/courses',
      //   children: [
      //     {
      //       index: true,
      //       element: <SiteCourses />
      //     },
      //     {
      //       path: ':courseId',
      //       element: <CourseDetail />
      //     }
      //   ]
      // },
    ],
    errorElement: <ErrorPage />
  },

]);

function App() {
  return (
  <>
  <RouterProvider router={router} fallbackElement={<ErrorPage />} />
  </>
  )
}

export default App
