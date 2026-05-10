import { TourPath, TourStep } from '../data/types'

interface GuideTourProps {
  path: TourPath
  currentStep: number
  currentNodeId: string | null
  onStop: () => void
}

export default function GuideTour({ path, currentStep, onStop }: GuideTourProps) {
  const step: TourStep | undefined = path.steps[currentStep]

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-96 z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-purple-500 font-bold uppercase tracking-wide">
          导游模式 · {path.label}
        </span>
        <button onClick={onStop} className="text-gray-400 hover:text-gray-600 text-sm">退出</button>
      </div>
      <div className="flex gap-1 mb-3">
        {path.steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-purple-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {step ? (
        <div>
          <p className="text-sm font-medium text-gray-800">
            {currentStep + 1}. {step.nodeId.replace(/-/g, ' ')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{step.highlight}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">导游完成！你现在可以自由探索了。</p>
      )}
    </div>
  )
}
