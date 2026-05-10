import { SkillNode } from '../data/types'
import { useNavigate } from 'react-router-dom'

interface SidePanelProps {
  node: SkillNode | null
  onClose: () => void
  allNodes: SkillNode[]
}

const groupLabels: Record<string, string> = {
  process: '过程管控',
  discipline: '纪律保障',
  collaboration: '协作支撑',
  meta: '元技能',
}

const groupColors: Record<string, string> = {
  process: 'bg-blue-100 text-blue-700',
  discipline: 'bg-green-100 text-green-700',
  collaboration: 'bg-amber-100 text-amber-700',
  meta: 'bg-purple-100 text-purple-700',
}

const typeLabels: Record<string, string> = {
  rigid: '刚性流程',
  flexible: '柔性指引',
}

const typeColors: Record<string, string> = {
  rigid: 'bg-red-50 text-red-600 border-red-200',
  flexible: 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function SidePanel({ node, onClose, allNodes }: SidePanelProps) {
  const navigate = useNavigate()

  if (!node) return null

  const beforeNode = node.l1.before ? allNodes.find(n => n.id === node.l1.before) : null
  const afterNode = node.l1.after ? allNodes.find(n => n.id === node.l1.after) : null

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{node.label}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${groupColors[node.group]}`}>
              {groupLabels[node.group]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[node.skillType]}`}>
              {typeLabels[node.skillType]}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">触发条件</p>
          <p className="text-sm text-gray-700">{node.l1.trigger}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">核心功能</p>
          <p className="text-sm text-gray-700">{node.l1.summary}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">解决的痛点</p>
          <p className="text-sm text-gray-700">{node.l1.problem}</p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          {beforeNode && (
            <div>
              <span className="text-xs text-gray-400">← 前置</span>
              <p className="font-medium text-blue-600">{beforeNode.label}</p>
            </div>
          )}
          {afterNode && (
            <div>
              <span className="text-xs text-gray-400">后置 →</span>
              <p className="font-medium text-blue-600">{afterNode.label}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => navigate(`/article/${node.id}`)}
          className="w-full py-2 px-4 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
        >
          阅读全文
        </button>
        {node.id === 'writing-skills' && (
          <button
            onClick={() => navigate('/deep-dive')}
            className="w-full mt-2 py-2 px-4 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
          >
            深入方法论（4章专项）
          </button>
        )}
      </div>
    </div>
  )
}
