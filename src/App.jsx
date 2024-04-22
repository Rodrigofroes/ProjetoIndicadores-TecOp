import { Outlet } from "react-router-dom"
import { CompMenu } from "./components/CompMenu"

function App() {
  return (
    <div className="flex">
      <div className="sidebar">
        <CompMenu/>
      </div>
      <div className="content w-full flex items-center justify-center">
        <Outlet/>
      </div>
    </div>
  );
}

export default App
