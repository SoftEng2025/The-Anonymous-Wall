/**
 * Converts a Spotify link or URI into an embeddable URL.
 * Supports tracks, albums, playlists, episodes, etc.
 * Returns empty string when the link cannot be parsed.
 *
 * @param {string} rawLink
 * @returns {string}
 */
export function getSpotifyEmbedUrl(rawLink = '') {
    const link = rawLink.trim()
    if (!link) return ''

    const buildEmbed = (type, id) => {
        if (!type || !id) return ''
        return `https://open.spotify.com/embed/${type}/${id}`
    }

    // Handle spotify:track:ID style URIs
    if (link.startsWith('spotify:')) {
        const parts = link.split(':').filter(Boolean)
        if (parts.length >= 3) {
            const [, type, id] = parts
            return buildEmbed(type, id)
        }
    }

    try {
        const url = new URL(link)
        if (!url.hostname.includes('spotify.com')) return ''

        // If it's already an embed link, return as-is
        if (url.pathname.startsWith('/embed/')) {
            return `${url.origin}${url.pathname}`
        }

        const segments = url.pathname.split('/').filter(Boolean)
        if (segments.length >= 2) {
            const [type, id] = segments
            return buildEmbed(type, id)
        }
    } catch (e) {
        return ''
    }

    return ''
}
