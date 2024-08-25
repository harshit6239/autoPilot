import { IoAddCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
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
      <div></div>
    </main>
  )
}

export default App
