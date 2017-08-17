import type Heap from 'heap'
import type { Card } from './Card'

export type AppState = {
  cardByCardId: {[cardId: number]: Card},
  fastHeap: Heap,
  slowHeap: Heap
}
