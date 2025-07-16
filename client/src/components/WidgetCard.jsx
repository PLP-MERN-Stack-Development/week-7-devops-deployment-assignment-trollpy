const WidgetCard = ({ title, children, className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default WidgetCard