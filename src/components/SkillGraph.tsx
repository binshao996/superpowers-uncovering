import { useEffect, useRef, useCallback } from 'react'
import cytoscape, { Core, EventObject } from 'cytoscape'
import { SkillsGraph } from '../data/types'

interface SkillGraphProps {
  data: SkillsGraph
  activeGroup: string
  searchQuery: string
  onNodeClick: (nodeId: string) => void
  highlightedNodeId: string | null
  graphRef: React.MutableRefObject<Core | null>
}

const groupColors: Record<string, string> = {
  process: '#3b82f6',
  discipline: '#22c55e',
  collaboration: '#f59e0b',
  meta: '#8b5cf6',
}

const relationStyles: Record<string, { style: string; label: string }> = {
  sequential: { style: 'solid', label: '→' },
  embeds: { style: 'dashed', label: '↗' },
  inherits: { style: 'dotted', label: '⇢' },
}

export default function SkillGraph({
  data, activeGroup, searchQuery, onNodeClick, highlightedNodeId, graphRef,
}: SkillGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const buildElements = useCallback(() => {
    let nodes = data.nodes
    if (activeGroup !== 'all') {
      nodes = nodes.filter(n => n.group === activeGroup)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      nodes = nodes.filter(n =>
        n.label.toLowerCase().includes(q) ||
        n.l1.summary.toLowerCase().includes(q)
      )
    }
    const nodeIds = new Set(nodes.map(n => n.id))
    const edges = data.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to))
    return { nodes, edges }
  }, [data, activeGroup, searchQuery])

  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'color': '#333',
            'background-color': (el: any) => groupColors[el.data('group')] || '#999',
            'width': 32,
            'height': 32,
            'border-width': 3,
            'border-color': '#fff',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
          },
        },
        {
          selector: 'node[skillType="flexible"]',
          style: { 'border-style': 'dashed' },
        },
        {
          selector: 'node[skillType="rigid"]',
          style: { 'border-style': 'solid' },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-color': '#ef4444',
            'border-width': 4,
            'shadow-blur': 12,
            'shadow-color': '#ef4444',
          } as any,
        },
        {
          selector: 'node.dimmed',
          style: { 'opacity': 0.3 },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-style': (el: any) => {
              const r = relationStyles[el.data('relation')]
              return (r ? r.style : 'solid') as any
            },
          },
        },
        {
          selector: 'edge[relation="inherits"]',
          style: {
            'line-style': 'dotted',
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
          },
        },
        {
          selector: 'edge[relation="embeds"]',
          style: {
            'line-style': 'dashed',
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        padding: 30,
      },
    })

    const { nodes, edges } = buildElements()
    nodes.forEach(n => {
      cy.add({
        group: 'nodes',
        data: { id: n.id, label: n.label, group: n.group, skillType: n.skillType },
      })
    })
    edges.forEach(e => {
      cy.add({
        group: 'edges',
        data: { id: `${e.from}-${e.to}`, source: e.from, target: e.to, relation: e.relation },
      })
    })

    cy.layout({ name: 'breadthfirst', directed: true, spacingFactor: 1.5, padding: 30 }).run()
    cy.fit(undefined, 50)
    cy.minZoom(0.3)
    cy.maxZoom(3)

    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeId = evt.target.id()
      onNodeClick(nodeId)
    })

    graphRef.current = cy

    return () => {
      cy.destroy()
      graphRef.current = null
    }
  }, [data, activeGroup, searchQuery])

  useEffect(() => {
    const cy = graphRef.current
    if (!cy) return

    const { nodes } = buildElements()
    const nodeIds = new Set(nodes.map(n => n.id))

    cy.nodes().forEach(node => {
      if (!nodeIds.has(node.id())) {
        node.addClass('dimmed')
      } else {
        node.removeClass('dimmed')
      }
    })
  }, [activeGroup, searchQuery, graphRef, buildElements])

  useEffect(() => {
    const cy = graphRef.current
    if (!cy) return
    cy.nodes().forEach(node => {
      if (highlightedNodeId && node.id() === highlightedNodeId) {
        node.addClass('highlighted')
      } else {
        node.removeClass('highlighted')
      }
    })
  }, [highlightedNodeId, graphRef])

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full min-h-0"
    />
  )
}
