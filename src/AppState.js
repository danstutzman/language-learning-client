import type { Card } from './Card'
import CardList from './CardList'

export type AppState = {
  cardByCardId: {[cardId: number]: Card},
  fastCards:    CardList,
  slowCards:    CardList
}
