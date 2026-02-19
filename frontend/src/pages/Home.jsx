import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'

const Home = () => {
  const techStack = [
    'Vite',
    'React 18',
    'React Router',
    'Axios',
    'Tailwind CSS',
    'Framer Motion',
    'React Icons',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Employee Management
        </h1>
        <p className="text-xl text-gray-600">
          Modern employee management dashboard built with React and GraphQL.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Tech Stack
        </h2>
        <ul className="space-y-2">
          {techStack.map((tech, index) => (
            <motion.li
              key={tech}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 text-gray-700"
            >
              <FaCheckCircle className="text-green-500" />
              <span>{tech}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Go to the Employees page to manage employee records.</li>
          <li>Use the table and tile views to explore employee details.</li>
          <li>Secure the system by configuring JWT and environment variables in production.</li>
        </ol>
      </motion.div>
    </motion.div>
  )
}

export default Home
