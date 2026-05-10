import { useNavigate } from 'react-router-dom'

export default function DeepDive() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>
      <h1 className="text-2xl font-bold mb-4">Writing Skills 深入方法论</h1>
      <p className="text-gray-500">详细内容将在 P2 阶段完成。</p>
    </div>
  )
}
