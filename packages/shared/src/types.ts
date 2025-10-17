export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  status: 'applied' | 'interview' | 'rejected' | 'hired'
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  skills: string[]
}
