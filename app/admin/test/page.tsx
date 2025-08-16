export default function AdminTest() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-red-400 mb-4">Admin Test Page</h1>
      <p className="text-gray-300 mb-4">If you can see this, routing is working.</p>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-green-400">✅ Admin route is accessible</p>
        <p className="text-blue-400">🔗 Try accessing: /admin?password=unified2024</p>
      </div>
    </div>
  )
}
