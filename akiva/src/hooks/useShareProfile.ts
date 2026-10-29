import { useCallback } from 'react'
import { site } from '../config/site'
import { getSiteUrl, prettyUrl } from '../lib/siteUrl'
import { plainText } from '../lib/plainText'
import { shareProfile } from '../utils/shareProfile'
import { useToast } from '../components/Toast'

export function useShareProfile() {
  const notify = useToast()
  return useCallback(async () => {
    const url = getSiteUrl()
    const result = await shareProfile({
      url,
      title: `${site.displayName} — ${plainText(site.tagline)}`,
      text: site.description,
    })
    if (result === 'copied') notify({ title: 'Link copied', description: prettyUrl(url) })
    if (result === 'shared') notify({ title: 'Thanks for sharing' })
    if (result === 'failed') notify({ title: 'Copy this link to share', description: url, tone: 'error' })
  }, [notify])
}
