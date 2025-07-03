import 'bootstrap/dist/css/bootstrap.min.css'
import NavigationBar from './components/Nav'
import Home from './pages/Home'
import User from './pages/User'
import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Tags from './pages/Tags'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'

function App() {
  return (
    <>
      <NavigationBar />
      <Container className='mt-4'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </Container>
    </>
  )
}

export default App
