import { useState } from 'react'

const HeroButton = ({ label, variant, iconClass }) => {
    const [isPressed, setIsPressed] = useState(false)

    const className = ['hero-button', variant, isPressed ? 'pressed' : ''].filter(Boolean).join(' ')

    const handlePressStart = () => setIsPressed(true)
    const handlePressEnd = () => setIsPressed(false)

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
