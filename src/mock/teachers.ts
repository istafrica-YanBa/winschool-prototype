// Mock teachers data
export interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  subjects: number[];  // References subject IDs
  status: 'active' | 'inactive';
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@school.edu',
    department: 'Mathematics',
    subjects: [1],
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@school.edu',
    department: 'Science',
    subjects: [2, 3],
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@school.edu',
    department: 'Science',
    subjects: [3, 4],
    status: 'active'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@school.edu',
    department: 'Languages',
    subjects: [5],
    status: 'active'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@school.edu',
    department: 'Social Studies',
    subjects: [6, 7],
    status: 'active'
  }
]; 