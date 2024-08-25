import { useState, useRef, useCallback, useEffect } from 'react'

import PropTypes from 'prop-types'

const DropDown = ({ options, defaultOption, setLang }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleSelect = useCallback((option) => {
    setSelectedOption(option)
    setLang(option.value)
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className="bg-[#34424d] w-36 border border-solid border-[#34424d] rounded-md focus:outline-none relative"
      ref={dropdownRef}
    >
      <button
        className="p-4 pt-2 pb-2 w-full h-full flex flex-row-reverse justify-between
                  hover:bg-[#3e515f] transition-colors duration-150 ease-in-out active:bg-[#313d46] "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {!isOpen && <span className="caret">&#9660;</span>}
        {isOpen && <span className="caret">&#9650;</span>}
        {selectedOption?.label}
      </button>
      {isOpen && (
        <ul className="p-1 flex flex-col gap-2 absolute top-full z-10 bg-[#34424d] w-full">
          {Array.from(options).map((option) => (
            <li
              key={option.value}
              className="cursor-pointer opacity-70 hover:opacity-100 hover:bg-[#3e515f] p-3 pt-1 pb-1 rounded-md w-full transition-colors duration-150 ease-in-out "
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

DropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  defaultOption: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  setLang: PropTypes.func.isRequired
}

export default DropDown
