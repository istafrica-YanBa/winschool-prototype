export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  signature: string
  barcode: string
  inventoryNumber: string
  status: BookStatus
  createdAt: string
  updatedAt: string
}

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED'
}

export interface BookLoan {
  id: string
  bookId: string
  studentId: string
  dueDate: string
  returnDate?: string
  status: LoanStatus
  createdAt: string
  updatedAt: string
  book?: Book
  student?: {
    id: string
    name: string
    class: string
  }
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE'
}

export interface BookReservation {
  id: string
  bookId: string
  studentId: string
  reservationDate: string
  expiryDate: string
  status: ReservationStatus
  createdAt: string
  updatedAt: string
  book?: Book
  student?: {
    id: string
    name: string
    class: string
  }
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface BookFee {
  id: string
  loanId: string
  amount: number
  reason: FeesReason
  status: FeeStatus
  dueDate: string
  paidDate?: string
  createdAt: string
  updatedAt: string
  loan?: BookLoan
}

export enum FeesReason {
  LATE_RETURN = 'LATE_RETURN',
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS'
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  WAIVED = 'WAIVED'
}

export interface ClassLoan {
  id: string
  classId: string
  bookIds: string[]
  startDate: string
  endDate: string
  status: ClassLoanStatus
  createdAt: string
  updatedAt: string
  books?: Book[]
  class?: {
    id: string
    name: string
    grade: string
  }
}

export enum ClassLoanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CourseLoan {
  id: string
  courseId: string
  bookIds: string[]
  startDate: string
  endDate: string
  status: CourseLoanStatus
  createdAt: string
  updatedAt: string
  books?: Book[]
  course?: {
    id: string
    name: string
    code: string
  }
}

export enum CourseLoanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
} 