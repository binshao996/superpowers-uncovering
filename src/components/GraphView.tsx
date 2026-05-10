import { useState, useRef, useMemo } from 'react'
import { Core } from 'cytoscape'
import GraphToolbar from './GraphToolbar'
import SkillGraph from './SkillGraph'
import SidePanel from './SidePanel'
import skillsGraph from '../data/skills-graph.json'
import tourPathsData from '../data/tour-paths.json'
import { SkillsGraph, TourPath } from '../data/types'
import GuideTour from './GuideTour'

const graphData = skillsGraph as SkillsGraph
const tourPaths = tourPathsData as TourPath[]

export default function GraphView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
  const [tourPath, setTourPath] = useState<TourPath | null>(null)
  const [tourStepIndex, setTourStepIndex] = useState(0)
  const [tourActive, setTourActive] = useState(false)
  const graphRef = useRef<Core | null>(null)

  const selectedNode = useMemo(
    () => graphData.nodes.find(n => n.id === selectedNodeId) || null,
    [selectedNodeId]
  )

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    setHighlightedNodeId(nodeId)
  }

  const handleClosePanel = () => {
    setSelectedNodeId(null)
    setHighlightedNodeId(null)
  }

  const handleStartTour = (tourId: string) => {
    const path = tourPaths.find(t => t.id === tourId)
    if (!path || !graphRef.current) return
    setTourActive(true)
    setTourPath(path)
    setTourStepIndex(0)
    const firstNodeId = path.steps[0].nodeId
    setSelectedNodeId(firstNodeId)
    setHighlightedNodeId(firstNodeId)
    const cy = graphRef.current
    const node = cy.getElementById(firstNodeId)
    if (node.length) {
      cy.animate({ center: { eles: node }, zoom: 1.2, duration: 600 })
    }
  }

  const handleTourNext = () => {
    if (!tourPath) return
    const nextIndex = tourStepIndex + 1
    if (nextIndex >= tourPath.steps.length) {
      handleStopTour()
      return
    }
    setTourStepIndex(nextIndex)
    const nodeId = tourPath.steps[nextIndex].nodeId
    setSelectedNodeId(nodeId)
    setHighlightedNodeId(nodeId)
    const cy = graphRef.current
    if (cy) {
      const node = cy.getElementById(nodeId)
      if (node.length) {
        cy.animate({ center: { eles: node }, zoom: 1.2, duration: 600 })
      }
    }
  }

  const handleStopTour = () => {
    setTourActive(false)
    setTourPath(null)
    setTourStepIndex(0)
    setHighlightedNodeId(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <GraphToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        tourPaths={tourPaths}
        onStartTour={handleStartTour}
        tourActive={tourActive}
        onStopTour={handleStopTour}
      />
      <div className="flex flex-1 min-h-0 relative">
        <SkillGraph
          data={graphData}
          activeGroup={activeGroup}
          searchQuery={searchQuery}
          onNodeClick={handleNodeClick}
          highlightedNodeId={highlightedNodeId}
          graphRef={graphRef}
        />
        {selectedNode && (
          <SidePanel
            node={selectedNode}
            onClose={handleClosePanel}
            allNodes={graphData.nodes}
          />
        )}
        {tourActive && tourPath && (
          <>
            <GuideTour
              path={tourPath}
              currentStep={tourStepIndex}
              currentNodeId={highlightedNodeId}
              onStop={handleStopTour}
            />
            <button
              onClick={handleTourNext}
              className="absolute bottom-6 right-6 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition z-10 text-sm"
            >
              {tourStepIndex >= tourPath.steps.length - 1 ? '完成' : '下一步 →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
