import { useState, useRef, useMemo } from 'react'
import { Core } from 'cytoscape'
import GraphToolbar from './GraphToolbar'
import SkillGraph from './SkillGraph'
import SidePanel from './SidePanel'
import skillsGraph from '../data/skills-graph.json'
import tourPathsData from '../data/tour-paths.json'
import { SkillsGraph, TourPath } from '../data/types'

const graphData = skillsGraph as SkillsGraph
const tourPaths = tourPathsData as TourPath[]

export default function GraphView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
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
    let stepIndex = 0

    const advance = () => {
      if (stepIndex >= path.steps.length) {
        setTourActive(false)
        setHighlightedNodeId(null)
        return
      }
      const step = path.steps[stepIndex]
      setSelectedNodeId(step.nodeId)
      setHighlightedNodeId(step.nodeId)
      const cy = graphRef.current
      if (cy) {
        const node = cy.getElementById(step.nodeId)
        if (node.length) {
          cy.animate({
            center: { eles: node },
            zoom: 1.2,
            duration: 600,
          })
        }
      }
      stepIndex++
      setTimeout(advance, 3000)
    }

    advance()
  }

  const handleStopTour = () => {
    setTourActive(false)
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
      <div className="flex flex-1 min-h-0">
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
      </div>
    </div>
  )
}
