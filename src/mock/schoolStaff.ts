// Mock school staff data
export interface SchoolStaff {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  avatar?: string;
}

export interface StaffTask {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // References staff ID
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  category: 'administrative' | 'academic' | 'financial' | 'maintenance' | 'system';
}

export interface StaffActivity {
  id: number;
  staffId: number; // References staff ID
  action: string;
  description: string;
  timestamp: string;
  category: 'student' | 'library' | 'attendance' | 'financial' | 'system' | 'maintenance' | 'administrative';
}

export const schoolStaff: SchoolStaff[] = [
  {
    id: 1,
    name: 'Maria Schmidt',
    email: 'maria.schmidt@school.edu',
    role: 'Administrative Assistant',
    department: 'Administration',
    phone: '+49 30 1234 5678',
    status: 'active',
    hireDate: '2020-03-15',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Hans Weber',
    email: 'hans.weber@school.edu',
    role: 'Student Records Coordinator',
    department: 'Student Services',
    phone: '+49 30 1234 5679',
    status: 'active',
    hireDate: '2019-08-22',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Anna Müller',
    email: 'anna.mueller@school.edu',
    role: 'Library Assistant',
    department: 'Library',
    phone: '+49 30 1234 5680',
    status: 'active',
    hireDate: '2021-01-10',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Peter Fischer',
    email: 'peter.fischer@school.edu',
    role: 'Attendance Coordinator',
    department: 'Student Services',
    phone: '+49 30 1234 5681',
    status: 'active',
    hireDate: '2018-11-05',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Lisa Wagner',
    email: 'lisa.wagner@school.edu',
    role: 'Financial Assistant',
    department: 'Finance',
    phone: '+49 30 1234 5682',
    status: 'active',
    hireDate: '2022-02-14',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 6,
    name: 'Thomas Klein',
    email: 'thomas.klein@school.edu',
    role: 'IT Support Specialist',
    department: 'IT Services',
    phone: '+49 30 1234 5683',
    status: 'active',
    hireDate: '2020-09-30',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 7,
    name: 'Claudia Schulz',
    email: 'claudia.schulz@school.edu',
    role: 'Receptionist',
    department: 'Administration',
    phone: '+49 30 1234 5684',
    status: 'on_leave',
    hireDate: '2017-06-12',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 8,
    name: 'Michael Hoffmann',
    email: 'michael.hoffmann@school.edu',
    role: 'Maintenance Coordinator',
    department: 'Facilities',
    phone: '+49 30 1234 5685',
    status: 'active',
    hireDate: '2019-04-18',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];

export const staffTasks: StaffTask[] = [
  {
    id: 1,
    title: 'Process new student enrollments',
    description: 'Review and process 15 new student enrollment applications',
    assignedTo: 1,
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-03-15',
    category: 'administrative'
  },
  {
    id: 2,
    title: 'Update student attendance records',
    description: 'Verify and update attendance records for all classes',
    assignedTo: 4,
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-03-14',
    category: 'academic'
  },
  {
    id: 3,
    title: 'Library inventory check',
    description: 'Conduct monthly inventory check of library resources',
    assignedTo: 3,
    priority: 'low',
    status: 'pending',
    dueDate: '2024-03-20',
    category: 'administrative'
  },
  {
    id: 4,
    title: 'Process fee payments',
    description: 'Process outstanding fee payments and send reminders',
    assignedTo: 5,
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-03-12',
    category: 'financial'
  },
  {
    id: 5,
    title: 'System maintenance',
    description: 'Perform routine system maintenance and updates',
    assignedTo: 6,
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-03-10',
    category: 'system'
  },
  {
    id: 6,
    title: 'Classroom setup verification',
    description: 'Verify all classrooms are properly set up for next week',
    assignedTo: 8,
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-03-16',
    category: 'maintenance'
  }
];

export const staffActivities: StaffActivity[] = [
  {
    id: 1,
    staffId: 1,
    action: 'Student Enrollment',
    description: 'Processed enrollment for Anna Schmidt (Class 10A)',
    timestamp: '2024-03-12T10:30:00Z',
    category: 'student'
  },
  {
    id: 2,
    staffId: 3,
    action: 'Library Return',
    description: 'Mathematics textbook returned by Max Weber',
    timestamp: '2024-03-12T09:15:00Z',
    category: 'library'
  },
  {
    id: 3,
    staffId: 4,
    action: 'Attendance Update',
    description: 'Updated daily attendance for all classes',
    timestamp: '2024-03-12T08:45:00Z',
    category: 'attendance'
  },
  {
    id: 4,
    staffId: 5,
    action: 'Payment Received',
    description: 'Fee payment received from Lisa Müller\'s parents',
    timestamp: '2024-03-12T14:20:00Z',
    category: 'financial'
  },
  {
    id: 5,
    staffId: 6,
    action: 'System Update',
    description: 'Completed scheduled system maintenance',
    timestamp: '2024-03-12T16:00:00Z',
    category: 'system'
  },
  {
    id: 6,
    staffId: 2,
    action: 'Record Update',
    description: 'Updated student records for Class 11B',
    timestamp: '2024-03-12T11:30:00Z',
    category: 'student'
  },
  {
    id: 7,
    staffId: 8,
    action: 'Maintenance',
    description: 'Fixed lighting issue in Room 205',
    timestamp: '2024-03-12T13:45:00Z',
    category: 'maintenance'
  },
  {
    id: 8,
    staffId: 1,
    action: 'Document Upload',
    description: 'Uploaded new school policy document',
    timestamp: '2024-03-12T15:30:00Z',
    category: 'administrative'
  }
];

// Helper functions
export const getStaffById = (id: number): SchoolStaff | undefined => {
  return schoolStaff.find(staff => staff.id === id);
};

export const getTasksByStaffId = (staffId: number): StaffTask[] => {
  return staffTasks.filter(task => task.assignedTo === staffId);
};

export const getActivitiesByStaffId = (staffId: number): StaffActivity[] => {
  return staffActivities.filter(activity => activity.staffId === staffId);
};

export const getTasksByStatus = (status: StaffTask['status']): StaffTask[] => {
  return staffTasks.filter(task => task.status === status);
};

export const getTasksByPriority = (priority: StaffTask['priority']): StaffTask[] => {
  return staffTasks.filter(task => task.priority === priority);
}; 