import type { Card } from './Card'

const CONSONANTS = ['b','c','d','f','g','h','j','k','l','m','n',
'p','r','s','t','v','w','x','z']

export default class CardList {
  cardByCardId:        {[cardId: number]: Card}
  contentFilter:       (Card) => boolean
  timeFilter:          (Card) => boolean
  compare:             (Card, Card) => number
  filteredSortedCards: Array<Card>

  constructor(cardByCardId: {[cardId: number]: Card},
      contentFilter: (Card) => boolean,
      timeFilter: (Card) => boolean,
      compare: (Card, Card) => number) {
    this.cardByCardId  = cardByCardId
    this.contentFilter = contentFilter
    this.timeFilter    = timeFilter
    this.compare       = compare
    this.update()
  }
  update() {
    const filtered = (Object.values(this.cardByCardId): any)
      .filter(this.contentFilter)
      .filter(this.timeFilter)
    filtered.sort(this.compare)
    this.filteredSortedCards = filtered
  }
  getNumCards(): number {
    return this.filteredSortedCards.length
  }
  getTopCard(): Card {
    return this.filteredSortedCards[0]
  }
  empty(): boolean {
    return this.filteredSortedCards.length === 0
  }
  getCardStagesSummary(): {[stageNumAndReady: string]: number} {
    const summary: {[stageNumAndReady: string]: number} = {}
    for (const cardMixed of Object.values(this.cardByCardId)) {
      const card = ((cardMixed: any): Card) // workaround
      if (this.contentFilter(card)) {
        const key = `${card.stageNum}${this.timeFilter(card) ? 'T' : 'F'}`
        const oldValue = summary[key] || 0
        summary[key] = oldValue + 1
      }
    }
    return summary
  }
  getEsDEsNPairs(): Array<[Card, Card]> {
    const dets: Array<Card> = []
    const nouns: Array<Card> = []
    for (const cardMixed of Object.values(this.cardByCardId)){
      const card = ((cardMixed:any):Card)
      if (card.type === 'EsD'){
        dets.push(card)
      } else if (card.type === 'EsN') {
        nouns.push(card)
      }
    }

    const pairs: Array<[Card, Card]> = []
    for (const det of dets) {
      if (!det.suspended) {
        for (const noun of nouns) {
          if (!noun.suspended) {
            if (det.number === 'S') {
              if (this._genderMatch(det, noun)) {
                pairs.push([det, noun])
              }
            } else if (det.number === 'P') {
              const pluralizedNoun: Card = {
                cardId: noun.cardId,
                type: 'EsN',
                gender: noun.gender,
                es: this._pluralizeEs(noun.es),
                en: this._pluralizeEn(noun.en),
                mnemonic: noun.mnemonic,
                suspended: noun.suspended,
                stageNum: noun.stageNum,
                lastSeenAt: noun.lastSeenAt,
                number: ''
              }
              if (this._genderMatch(det, pluralizedNoun)) {
                pairs.push([det, pluralizedNoun])
              }
            }
          }
        }
      }
    }
    return pairs
  }
  _pluralizeEn(en: string): string {
    return en + 's'
  }
  _pluralizeEs(es: string): string {
    const lastLetter = es.charAt(es.length - 1)
    if (lastLetter == 'z') {
      return es.substring(0, es.length - 1) + 'ces'
    } else if (CONSONANTS.indexOf(lastLetter) !== -1) {
      return es + 'es'
    } else {
      return es + 's'
    }
  }
  _genderMatch(det:Card, noun:Card): boolean {
    return det.gender === '' || (noun.gender === det.gender)
  }
}
