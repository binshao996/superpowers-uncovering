import { TourPath } from '../data/types'

interface GraphToolbarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  activeGroup: string
  onGroupChange: (g: string) => void
  tourPaths: TourPath[]
  onStartTour: (tourId: string) => void
  tourActive: boolean
  onStopTour: () => void
}

const groups = [
  { id: 'all', label: '全部' },
  { id: 'process', label: '过程管控' },
  { id: 'discipline', label: '纪律保障' },
  { id: 'collaboration', label: '协作支撑' },
  { id: 'meta', label: '元技能' },
]

export default function GraphToolbar({
  searchQuery, onSearchChange,
  activeGroup, onGroupChange,
  tourPaths, onStartTour, tourActive, onStopTour,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-b border-gray-200 bg-white">
      <input
        type="text"
        placeholder="搜索 skill..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
      />

      <div className="flex gap-1">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => onGroupChange(g.id)}
            className={`px-3 py-1 text-xs rounded-full transition ${
              activeGroup === g.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 ml-auto">
        {tourActive ? (
          <button
            onClick={onStopTour}
            className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            退出导游
          </button>
        ) : (
          tourPaths.map(tp => (
            <button
              key={tp.id}
              onClick={() => onStartTour(tp.id)}
              className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
              title={tp.description}
            >
              {tp.label}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
