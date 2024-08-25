import { IoMdClose } from 'react-icons/io'
import { FaRegWindowRestore } from 'react-icons/fa'
import { GoDash } from 'react-icons/go'

function Nav() {
  const ipc = window.ipcRenderer
  return (
    <nav className="w-full flex items-center relative z-10 flex-row-reverse ">
      <div className="flex">
        <button
          className="text-gray-300 hover:bg-gray-700 p-3 transition-colors duration-200 ease-in-out"
          onClick={() => ipc.send('minimizeApp', 'minimizeApp')}
        >
          <GoDash />
        </button>
        <button
          className="text-gray-300 hover:bg-gray-700 p-3 transition-colors duration-200 ease-in-out"
          onClick={() => {
            ipc.send('maximizeApp', 'maximizeApp')
          }}
        >
          <FaRegWindowRestore />
        </button>
        <button
          className="text-gray-300 h-max hover:bg-red-500 p-3 transition-colors duration-200 ease-in-out"
          onClick={() => {
            ipc.send('closeApp', 'closeApp')
          }}
        >
          <IoMdClose />
        </button>
      </div>
      <div className="text-center w-full ">Auto Pilot</div>
      <div className="flex ">
        <button className="text-transparent cursor-default p-3">
          <GoDash />
        </button>
        <button className="text-transparent cursor-default p-3">
          <FaRegWindowRestore />
        </button>
        <button className="text-transparent cursor-default p-3">
          <IoMdClose />
        </button>
      </div>
    </nav>
  )
}

export default Nav
