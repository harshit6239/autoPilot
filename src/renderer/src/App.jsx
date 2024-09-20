import { IoAddCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import useScriptsStore from './hooks/useScriptsStore'
import { useEffect } from 'react'

function App() {
  const ipc = window.ipcRenderer
  const navigate = useNavigate()
  const store = useScriptsStore()
  const refreshScripts = () => {
    ipc.invoke('getScripts').then((s) => {
      store.setScripts(s)
    })
  }
  useEffect(() => {
    ipc.invoke('getScripts').then((s) => {
      store.setScripts(s)
    })
  }, [])

  return (
    <main className="h-full w-full p-8 overflow-hidden">
      <div className="mb-8">
        <button
          className="bg-[#34424d] p-[1.25em] pt-[0.5em] pb-[0.5em] rounded-md flex items-center gap-2 hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
          onClick={() => {
            navigate('/add')
          }}
        >
          <IoAddCircleOutline />
          <span>Add Script</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {store.scripts &&
          store.scripts.map(
            (script) =>
              script.active && (
                <div
                  key={script.id}
                  className="bg-transparent w-max border border-solid border-[#34424d] rounded-md mb-4 hover:scale-105 hover:bg-[#34424d1b] transition-all duration-300 ease-in-out"
                  onClick={(e) => {
                    if (e.target.tagName === 'BUTTON') return
                    else navigate(`/edit/${script.id}`)
                  }}
                >
                  <div className="flex flex-col justify-between p-4 gap-2 ">
                    <div className="h-24 w-48">
                      <h2 className="text-lg font-bold capitalize">{script.name}</h2>
                      <p className="text-gray-300 font-medium">{script.description}</p>
                    </div>
                    <div className="flex gap-2 ">
                      <button
                        className="bg-[#34424d] p-[0.5em] rounded-md flex grow items-center justify-center hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                        onClick={() => {
                          ipc.send('toggleScript', script.id)
                          refreshScripts()
                        }}
                      >
                        {script.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="bg-[#34424d] p-[0.5em] rounded-md flex grow items-center justify-center hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                        onClick={() => {
                          ipc.send('removeScript', script.id)
                          refreshScripts()
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
        {store.scripts &&
          store.scripts.map(
            (script) =>
              !script.active && (
                <div
                  key={script.id}
                  className="bg-transparent w-max border border-solid border-[#34424d] rounded-md mb-4 hover:scale-105 hover:bg-[#34424d1b] transition-all duration-300 ease-in-out"
                  onClick={(e) => {
                    if (e.target.tagName === 'BUTTON') return
                    else navigate(`/edit/${script.id}`)
                  }}
                >
                  <div className="flex flex-col justify-between p-4 gap-2 ">
                    <div className="h-24 w-48">
                      <h2 className="text-lg font-bold capitalize">{script.name}</h2>
                      <p className="text-gray-300 font-medium">{script.description}</p>
                    </div>
                    <div className="flex gap-2 ">
                      <button
                        className="bg-[#34424d] p-[0.5em] rounded-md flex grow items-center justify-center hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                        onClick={() => {
                          ipc.send('toggleScript', script.id)
                          refreshScripts()
                        }}
                      >
                        {script.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="bg-[#34424d] p-[0.5em] rounded-md flex grow items-center justify-center hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                        onClick={() => {
                          ipc.send('removeScript', script.id)
                          refreshScripts()
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
    </main>
  )
}

export default App
