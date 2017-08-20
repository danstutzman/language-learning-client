import type { Card } from './Card'

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
}
