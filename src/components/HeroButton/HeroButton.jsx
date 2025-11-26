import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HeroButton = ({ label, variant, iconClass, path }) => {
    const [isPressed, setIsPressed] = useState(false)
    const navigate = useNavigate()

    const className = ['hero-button', variant, isPressed ? 'pressed' : ''].filter(Boolean).join(' ')

    const handlePressStart = () => setIsPressed(true)
    const handlePressEnd = () => setIsPressed(false)

    const handleClick = () => {
        if (path) {
            navigate(path)
        }
    }

    return (
        <button
            type="button"
            className={className}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
            onClick={handleClick}
            aria-label={label}
        >
            <span className="icon" aria-hidden="true">
                <i className={iconClass}></i>
            </span>
            {label}
        </button>
    )
}

export default HeroButton
