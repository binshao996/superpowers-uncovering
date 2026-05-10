import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const chapters = [
  { id: 'overview', title: '1. 什么是 Skill？', desc: '定义、类型、适用边界' },
  { id: 'cso', title: '2. CSO 搜索优化', desc: '如何让 AI 找到你的 skill' },
  { id: 'tdd-methodology', title: '3. TDD 方法论', desc: 'RED → GREEN → REFACTOR' },
  { id: 'anti-rationalization', title: '4. 防理性化设计', desc: '如何让 Skill 不被绕过' },
]

export default function DeepDive() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId?: string }>()
  const [content, setContent] = useState('')
  const [activeChapter, setActiveChapter] = useState(chapterId || 'overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (chapterId) setActiveChapter(chapterId)
  }, [chapterId])

  useEffect(() => {
    setLoading(true)
    fetch(`/content/writing-skills/${activeChapter}.md`)
      .then(res => res.text())
      .then(text => { setContent(text); setLoading(false) })
      .catch(() => { setContent('内容加载失败。'); setLoading(false) })
  }, [activeChapter])

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>

      <h1 className="text-2xl font-bold mb-2">Writing Skills 深入方法论</h1>
      <p className="text-gray-500 mb-8">
        这是 superpowers 最核心的元技能——教你如何创建和封装自己的 skill。
        通过 TDD 方法确保 skill 质量，通过防理性化设计确保 skill 不可绕过。
      </p>

      <div className="flex gap-6">
        <nav className="w-56 shrink-0">
          <ul className="space-y-1 sticky top-6">
            {chapters.map(ch => (
              <li key={ch.id}>
                <button
                  onClick={() => {
                    setActiveChapter(ch.id)
                    navigate(`/deep-dive/${ch.id}`, { replace: true })
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeChapter === ch.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div>{ch.title}</div>
                  <div className="text-xs text-gray-400">{ch.desc}</div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">
          {loading ? (
            <p className="text-gray-400">加载中...</p>
          ) : (
            <article className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
          )}
        </main>
      </div>
    </div>
  )
}
