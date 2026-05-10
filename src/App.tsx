import { Routes, Route } from 'react-router-dom'
import ChapterReader from './components/ChapterReader'
import GraphView from './components/GraphView'
import FullArticle from './components/FullArticle'
import DeepDive from './components/DeepDive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChapterReader />} />
      <Route path="/graph" element={<GraphView />} />
      <Route path="/article/:skill" element={<FullArticle />} />
      <Route path="/deep-dive" element={<DeepDive />} />
      <Route path="/deep-dive/:chapterId" element={<DeepDive />} />
    </Routes>
  )
}
