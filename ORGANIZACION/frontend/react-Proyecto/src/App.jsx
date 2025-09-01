import UrbanStand from './Componentes/UrbanStand';
import Login from "./Login/Login"
export default function App() {
  return (
    <main className="min-h-dvh bg-gray-50 grid place-items-center p-6">
      <div>
        <UrbanStand />
        <Login />
      </div>
    </main>
  )
}

