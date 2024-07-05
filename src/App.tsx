import './App.css'
import { httpClient } from './httpClient'

function App() {

  const handle_login = async () => {
    try {
      // const res = await axios.post('http://localhost:3000/api/auth/signin/local', {
      const res = await httpClient.post('auth/signin/local', {
        "username": "user123",
        "password": "12345678"
      })
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <button
        onClick={() => handle_login()}
      >
        login
      </button>
    </>
  )
}

export default App
