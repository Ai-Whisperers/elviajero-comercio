import es from './locales/es.json'
import en from './locales/en.json'
import gn from './locales/gn.json'

type Locale = 'es' | 'en' | 'gn'

const messages: Record<Locale, any> = { es, en, gn }

export function useTranslations(locale: Locale = 'es') {
  const t = (key: string) => {
    const keys = key.split('.')
    let obj: any = messages[locale]
    for (const k of keys) {
      if (obj && typeof obj === 'object') obj = obj[k]
      else return key
    }
    return typeof obj === 'string' ? obj : key
  }
  return { t, locale }
}
