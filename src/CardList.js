import type { Card } from './Card'

export default class CardList {
  cardByCardId: {[cardId: number]: Card}
  filter: (Card) => boolean
  compare: (Card, Card) => number
  filteredSortedCards: Array<Card>

  constructor(cardByCardId: {[cardId: number]: Card},
      filter: (Card) => boolean, compare: (Card, Card) => number) {
    this.cardByCardId = cardByCardId
    this.filter       = filter
    this.compare      = compare
    this.update()
  }
  update() {
    const filtered = (Object.values(this.cardByCardId): any).filter(this.filter)
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
}
