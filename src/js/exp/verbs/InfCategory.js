export const AR = 'AR'
export const ERIR = 'ERIR'
export const ER = 'ER'
export const IR = 'IR'
export const STEMPRET = 'STEMPRET'

export type InfCategory = 'AR' | 'ERIR' | 'ER' | 'IR' | 'STEMPRET'

export function isInfCategory(infEs:string, infCategory:InfCategory,
                       isStemChangePret:boolean): boolean {
  if (isStemChangePret) {
    return infCategory === 'STEMPRET'
  } else {
    switch (infCategory) {
      case AR: return infEs.endsWith('ar')
      case ER: return infEs.endsWith('er')
      case IR: return infEs.endsWith('ir')
      case ERIR: return infEs.endsWith('er') || infEs.endsWith('ir')
      case STEMPRET: return false
      default: throw new Error(`Unknown infCategory ${infCategory}`)
    }
  }
}