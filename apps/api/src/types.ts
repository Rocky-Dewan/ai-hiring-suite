export interface ApplicantProfile {
  name: string
  email: string
  phone?: string
  skills: string[]
  experience: Array<{ company: string; role: string; years: number }>
  education: Array<{ degree: string; institution: string; year: number }>
}

export interface JobDescription {
  id: string
  title: string
  description: string
  requirements: string[]
  skills: string[]
}
