
import React, { useEffect, useState } from 'react'

export default function SpotifyPreview({ embedUrl }) {
    const [meta, setMeta] = useState(null)
    const [fallbackArtist, setFallbackArtist] = useState('')

    if (!embedUrl) return null

    // Convert embed link back to sharable link for oEmbed + click target
    const shareUrl = embedUrl.replace('/embed/', '/')

    const parseArtistFromTitle = (title = '') => {
        const cleaned = title.trim()
        if (!cleaned.includes(' - ')) return ''
        const parts = cleaned.split(' - ')
        return parts.length > 1 ? parts[parts.length - 1].trim() : ''
    }

    useEffect(() => {
        let active = true
        const fetchMeta = async () => {
            try {
                const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(shareUrl)}`
                const res = await fetch(oembedUrl)
                if (!res.ok) throw new Error('Failed to load oEmbed')
                const data = await res.json()
                if (!active) return
                const parsedArtist = parseArtistFromTitle(data.title)
                setMeta({
                    title: data.title,
                    artist: data.author_name || parsedArtist,
                    thumbnail: data.thumbnail_url
                })
            } catch (e) {
                if (active) setMeta(null)
            }
        }
        fetchMeta()
        return () => { active = false }
    }, [shareUrl])

    useEffect(() => {
        let active = true
        const fetchArtistFromOpenPage = async () => {
            try {
                const url = new URL(embedUrl)
                const parts = url.pathname.split('/').filter(Boolean) // ['embed','track','id']
                const type = parts[1]
                const id = parts[2]
                if (!type || !id) return

                const proxied = `https://r.jina.ai/https://open.spotify.com/${type}/${id}`
                const res = await fetch(proxied)
                if (!res.ok) return
                const text = await res.text()
                // Example description: "Artist \u00b7 Song \u00b7 ..."
                const match = text.match(/property="og:description" content="([^"]+)"/)
                if (!match || !match[1]) return
                const desc = match[1]
                const firstPart = desc.split('\u00b7')[0].trim()
                if (firstPart && active) {
                    setFallbackArtist(firstPart)
                }
            } catch (e) {
                // ignore
            }
        }
        if (!meta?.artist) {
            fetchArtistFromOpenPage()
        } else {
            setFallbackArtist('')
        }
        return () => { active = false }
    }, [embedUrl, meta?.artist])

    if (!meta) return null

    const derivedArtist = fallbackArtist || meta.artist || parseArtistFromTitle(meta.title) || ''

    return (
        <a
            className="spotify-preview"
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
        >
            <img src={meta.thumbnail} alt={meta.title} className="spotify-cover" />
            <div className="spotify-meta">
                <div className="spotify-title" title={meta.title}>{meta.title}</div>
                {derivedArtist && <div className="spotify-artist">{derivedArtist}</div>}
            </div>
            <div className="spotify-icon-circle" aria-hidden="true">
                <i className="fa-brands fa-spotify"></i>
            </div>
        </a>
    )
}
