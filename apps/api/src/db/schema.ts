export interface VectorRecord {
  id: string
  type: 'job' | 'resume'
  embedding: number[]
  metadata: Record<string, any>
}
