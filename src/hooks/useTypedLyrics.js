import { useEffect, useMemo, useState } from 'react'

const prepareTimeline = (timeline, config) => {
    const { baseTypeSpeed, minimumHold } = config

    return timeline.map((lyric) => {
        const charCount = Math.max(lyric.text.length, 1)
        const totalDuration = lyric.durationMs ?? 3000
        const baseDelay = lyric.typeSpeed ?? baseTypeSpeed
        const minDisplay = lyric.minimumHold ?? minimumHold
        const availableForTyping = Math.max(0, totalDuration - minDisplay)

        let typeDelay = baseDelay
        if (availableForTyping > 0 && charCount * baseDelay > availableForTyping) {
            typeDelay = Math.max(20, availableForTyping / charCount)
        }

        const typedDuration = charCount * typeDelay
        const holdDelay = Math.max(minDisplay, totalDuration - typedDuration)

        return {
            ...lyric,
            typeDelay,
            holdDelay,
            typedDuration,
            fullDuration: typedDuration + holdDelay,
        }
    })
}

export const useTypedLyrics = (timeline, config) => {
    const preparedTimeline = useMemo(() => prepareTimeline(timeline, config), [timeline, config])
    const [text, setText] = useState('')

    useEffect(() => {
        if (!preparedTimeline.length) {
            setText('')
            return undefined
        }

        setText('')
        let lyricIndex = 0
        let charIndex = 0
        let deleting = false
        let timeoutId

        const schedule = (delay) => {
            timeoutId = window.setTimeout(step, Math.max(20, delay))
        }

        const step = () => {
            const lyric = preparedTimeline[lyricIndex]
            if (!lyric) {
                return
            }

            if (deleting) {
                setText('')
                charIndex = 0
                deleting = false
                lyricIndex = (lyricIndex + 1) % preparedTimeline.length
                schedule(320)
                return
            }

            charIndex = Math.min(lyric.text.length, charIndex + 1)
            setText(lyric.text.slice(0, charIndex))

            if (charIndex === lyric.text.length) {
                deleting = true
                schedule(lyric.holdDelay)
                return
            }

            schedule(lyric.typeDelay)
        }

        schedule(650)

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId)
            }
        }
    }, [preparedTimeline])

    return text
}
