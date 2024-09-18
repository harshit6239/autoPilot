import { IoAddCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {
  const ipc = window.ipcRenderer
  const navigate = useNavigate()
  const [scripts, setScripts] = useState([])

  useEffect(() => {
    ipc.invoke('getScripts').then((scripts) => {
      setScripts(scripts)
    })
  }, [])

  return (
    <main className="h-full w-full p-8 overflow-hidden">
      <div>
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
      <div>
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-transparent w-full border border-solid border-[#34424d] rounded-md mb-4"
          >
            <div className="flex justify-between items-center p-4">
              <div>
                <h2 className="text-lg font-bold">{script.name}</h2>
                <p>{script.description}</p>
              </div>
              <div>
                <button
                  className="bg-[#34424d] p-[0.5em] rounded-md flex items-center gap-2 hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                  onClick={() => {
                    ipc.send('toggleScript', script.id)
                    setScripts((scripts) =>
                      scripts.map((s) => {
                        if (s.id === script.id) {
                          return { ...s, active: !s.active }
                        }
                        return s
                      })
                    )
                  }}
                >
                  {script.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="bg-[#34424d] p-[0.5em] rounded-md flex items-center gap-2 hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
                  onClick={() => {
                    ipc.send('removeScript', script.id)
                    setScripts((scripts) => scripts.filter((s) => s.id !== script.id))
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
