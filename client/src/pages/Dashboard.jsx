import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useSocket } from '../context/SocketContext'
import WidgetCard from '../components/WidgetCard'
import GithubPanel from '../features/github/GithubPanel'
import PipelineStatus from '../features/ci/PipelineStatus'
import LogStream from '../features/logs/LogStream'
import TaskBoard from '../features/tasks/TaskBoard'

const Dashboard = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const { socket } = useSocket()

  useEffect(() => {
    if (socket) {
      socket.emit('join-dashboard')
    }
  }, [socket])

  // Prevent rendering if Clerk isn't ready
  if (!isLoaded) return <div>Loading authentication...</div>
  if (!isSignedIn) return <div>Redirecting...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetCard title="GitHub Activity">
          <GithubPanel />
        </WidgetCard>

        <WidgetCard title="CI/CD Pipeline">
          <PipelineStatus />
        </WidgetCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetCard title="Recent Logs">
          <LogStream />
        </WidgetCard>

        <WidgetCard title="Task Board">
          <TaskBoard />
        </WidgetCard>
      </div>
    </div>
  )
}

export default Dashboard
