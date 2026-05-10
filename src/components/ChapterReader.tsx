import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'

const chapters = [
  { id: '00-preface', title: '序章：Superpowers 解决了什么问题？', number: '0' },
  { id: '01-architecture', title: '第一章：架构总览 — 四层体系', number: '1' },
  { id: '02-process-chain', title: '第二章：过程管控链 — 流水线', number: '2' },
  { id: '03-cross-cutting', title: '第三章：横切约束层 — 三个铁律', number: '3' },
  { id: '04-design-patterns', title: '第四章：设计模式目录 — 八个模式', number: '4' },
  { id: '05-meta-skill', title: '第五章：元技能深度走读 — writing-skills', number: '5' },
  { id: '06-collaboration', title: '第六章：协作支撑 — 基础设施', number: '6' },
]

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  themeVariables: {
    fontSize: '14px',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
})

function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    mermaid.render(`${id}-svg`, chart).then(({ svg }) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = svg
      }
    }).catch(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p class="text-red-500 text-sm">图表渲染失败</p>'
      }
    })
  }, [chart, id])

  return <div ref={containerRef} className="my-6 flex justify-center overflow-x-auto" />
}

export default function ChapterReader() {
  const [contents, setContents] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeChapter, setActiveChapter] = useState('00-preface')
  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    Promise.all(
      chapters.map(ch =>
        fetch(`${import.meta.env.BASE_URL}content/chapters/${ch.id}.md`)
          .then(res => res.text())
          .then(text => [ch.id, text] as [string, string])
      )
    ).then(results => {
      const map: Record<string, string> = {}
      results.forEach(([id, text]) => { map[id] = text })
      setContents(map)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const offsets = chapters.map(ch => {
        const el = chapterRefs.current[ch.id]
        return { id: ch.id, top: el?.getBoundingClientRect().top || Infinity }
      })
      const active = offsets.reduce((best, cur) => {
        if (cur.top <= 120 && cur.top > best.top) return cur
        return best
      }, offsets[0])
      if (active) setActiveChapter(active.id)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading])

  const scrollToChapter = (id: string) => {
    chapterRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const mermaidIdRef = useRef(0)
  const renderMermaid = useCallback((chart: string) => {
    mermaidIdRef.current += 1
    return <MermaidDiagram chart={chart} id={`mermaid-${mermaidIdRef.current}`} />
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        加载中...
      </div>
    )
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-gray-200 bg-white overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Superpowers 核心设计</h2>
          <p className="text-xs text-gray-400 mt-1">由浅入深 · 分层解读</p>
        </div>
        <nav className="p-3">
          {chapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 ${
                activeChapter === ch.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs text-gray-400 mr-1">{ch.number}.</span>
              {ch.title.replace(/^第[^章]+章：/, '').replace(/^序章：/, '序章 · ')}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 max-w-3xl mx-auto px-6 py-8 md:py-12">
        {chapters.map((ch, idx) => (
          <div key={ch.id}>
            <div
              ref={el => { chapterRefs.current[ch.id] = el }}
              className="chapter-anchor"
            />
            <article className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeStr = String(children).replace(/\n$/, '')
                    if (match && match[1] === 'mermaid') {
                      return renderMermaid(codeStr)
                    }
                    const isInline = !match
                    return isInline ? (
                      <code className="bg-slate-100 px-1 py-0.5 rounded text-sm text-rose-600" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    )
                  }
                }}
              >
                {contents[ch.id] || ''}
              </ReactMarkdown>
            </article>
            {idx < chapters.length - 1 && (
              <div className="my-12 text-center">
                <button
                  onClick={() => scrollToChapter(chapters[idx + 1].id)}
                  className="px-6 py-3 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition shadow-md"
                >
                  下一章：{chapters[idx + 1].title.replace(/^第[^章]+章：/, '').replace(/^序章：/, '序章 · ')} →
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>如需深入了解单个 skill 的完整设计，访问 <Link to="/article/writing-skills" className="text-blue-500">深度文章</Link> 或 <Link to="/deep-dive" className="text-purple-500">Writing Skills 4 章专项</Link>。</p>
        </div>
      </main>
    </div>
  )
}
