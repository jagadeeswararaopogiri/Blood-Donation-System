export type Role = 'DONOR' | 'RECEIVER'

export type UserDto = {
  id: number
  name: string
  email: string
  role: Role | null
}

export type AuthResponse = {
  token: string
  user: UserDto
}

export type BloodGroup =
  | 'A_POS'
  | 'A_NEG'
  | 'B_POS'
  | 'B_NEG'
  | 'AB_POS'
  | 'AB_NEG'
  | 'O_POS'
  | 'O_NEG'

export type DonorProfileDto = {
  donorProfileId: number
  userId: number
  name: string
  bloodGroup: BloodGroup
  location: string
  phone: string
  availability: boolean
  lastDonationDate: string | null
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

export type RequestDto = {
  id: number
  receiverUserId: number
  receiverName: string
  donorUserId: number
  donorName: string
  status: RequestStatus
  requestedAt: string
  respondedAt: string | null
  completedAt: string | null
  note: string | null
}

