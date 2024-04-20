import { Outlet } from "react-router-dom"
import { CompMenu } from "./components/CompMenu"

function App() {
  return (
    <div className="flex items-center">
      <div>
        <CompMenu/>
      </div>
     <div>
      <Outlet/>
     </div>
    </div>
  )
}

export default App
