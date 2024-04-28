import { Outlet } from "react-router-dom"
import { CompMenu } from "./components/CompMenu"

function App() {
  return (
    <>
      <div className="flex bg-zinc-200/60">
      <div className="sidebar">
        <CompMenu/>
      </div>
      <div className="p-4 mt-16 content w-full ">
        <Outlet/>
      </div>
    </div>
    <footer className="bg-zinc-200 p-4 text-center text-xs">
      <p>© 2021 - Todos os direitos reservados</p>
    </footer>
    </>
  );
}

export default App
