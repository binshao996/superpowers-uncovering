import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function FullArticle() {
  const { skill } = useParams<{ skill: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!skill) return
    setLoading(true)
    fetch(`/content/${skill}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.text()
      })
      .then(text => { setContent(text); setLoading(false) })
      .catch(() => { setContent('# 文章暂未完成\n\n这篇深度文章还在编写中。'); setLoading(false) })
  }, [skill])

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>
      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      )}
    </div>
  )
}
