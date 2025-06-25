export interface Subject {
  id: number
  name: string
  code: string
  credits: number
  department: string
}

export interface Course {
  id: number
  name: string
  subjectId: number
  instructor: string
  type: 'main' | 'elective' | 'support'
  minStudents: number
  maxStudents: number
  enrolledCount: number
  room: string
  status: 'active' | 'archived'
}

export const subjects: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH101',
    credits: 4,
    department: 'Mathematics'
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHYS101',
    credits: 4,
    department: 'Science'
  },
  {
    id: 3,
    name: 'Chemistry',
    code: 'CHEM101',
    credits: 4,
    department: 'Science'
  },
  {
    id: 4,
    name: 'Biology',
    code: 'BIO101',
    credits: 4,
    department: 'Science'
  },
  {
    id: 5,
    name: 'English',
    code: 'ENG101',
    credits: 3,
    department: 'Languages'
  },
  {
    id: 6,
    name: 'History',
    code: 'HIST101',
    credits: 3,
    department: 'Social Studies'
  },
  {
    id: 7,
    name: 'Geography',
    code: 'GEO101',
    credits: 3,
    department: 'Social Studies'
  }
]

export const courses: Course[] = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    subjectId: 1,
    instructor: 'Dr. Smith',
    type: 'main',
    minStudents: 15,
    maxStudents: 30,
    enrolledCount: 25,
    room: 'Room 101',
    status: 'active'
  },
  {
    id: 2,
    name: 'Physics Lab',
    subjectId: 2,
    instructor: 'Prof. Johnson',
    type: 'main',
    minStudents: 10,
    maxStudents: 20,
    enrolledCount: 18,
    room: 'Lab 201',
    status: 'active'
  },
  {
    id: 3,
    name: 'Chemistry Basics',
    subjectId: 3,
    instructor: 'Dr. Brown',
    type: 'main',
    minStudents: 12,
    maxStudents: 25,
    enrolledCount: 20,
    room: 'Lab 202',
    status: 'active'
  },
  {
    id: 4,
    name: 'Biology Research',
    subjectId: 4,
    instructor: 'Dr. Wilson',
    type: 'elective',
    minStudents: 8,
    maxStudents: 15,
    enrolledCount: 12,
    room: 'Lab 203',
    status: 'active'
  },
  {
    id: 5,
    name: 'English Literature',
    subjectId: 5,
    instructor: 'Prof. Davis',
    type: 'main',
    minStudents: 15,
    maxStudents: 30,
    enrolledCount: 28,
    room: 'Room 102',
    status: 'active'
  }
] 