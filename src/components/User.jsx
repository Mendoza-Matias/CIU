import { useEffect, useState } from 'react'
import { ListGroup, Spinner, Alert } from 'react-bootstrap'

function User() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/users/1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el usuario')
        }
        return response.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner animation="border" />
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <ListGroup variant="flush">
      <div>
        <h1 className="fs-4">Mi usuario</h1>
      </div>
      <ListGroup.Item>ID: {user.id}</ListGroup.Item>
      <ListGroup.Item>Nombre: {user.nickName}</ListGroup.Item>
      <ListGroup.Item>Email: {user.email}</ListGroup.Item>
    </ListGroup>
  )
}

export default User
