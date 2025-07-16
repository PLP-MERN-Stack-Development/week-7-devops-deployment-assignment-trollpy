import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <Link
          to="/"
          className="mt-6 inline-block btn-primary"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound