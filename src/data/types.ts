export interface SkillNode {
  id: string
  label: string
  group: 'process' | 'discipline' | 'collaboration' | 'meta'
  skillType: 'rigid' | 'flexible'
  l1: {
    trigger: string
    summary: string
    problem: string
    before: string | null
    after: string | null
  }
}

export interface SkillEdge {
  from: string
  to: string
  relation: 'sequential' | 'embeds' | 'inherits'
}

export interface SkillsGraph {
  nodes: SkillNode[]
  edges: SkillEdge[]
}

export interface TourStep {
  nodeId: string
  highlight: string
}

export interface TourPath {
  id: string
  label: string
  description: string
  steps: TourStep[]
}
