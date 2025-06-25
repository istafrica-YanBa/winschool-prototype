const menuItems = [
  // ... existing menu items ...
  
  {
    label: 'Library Management',
    icon: 'book',
    roles: ['ADMIN', 'librarian'],
    children: [
      {
        label: 'Books Management',
        to: '/library/books',
        roles: ['ADMIN', 'librarian']
      },
      {
        label: 'Book Lending',
        children: [
          {
            label: 'Student Lending',
            to: '/library/student-lending',
            roles: ['ADMIN', 'librarian']
          },
          {
            label: 'Class Lending',
            to: '/library/class-lending',
            roles: ['ADMIN', 'librarian']
          },
          {
            label: 'Course Lending',
            to: '/library/course-lending',
            roles: ['ADMIN', 'librarian']
          }
        ],
        roles: ['ADMIN', 'librarian']
      },
      {
        label: 'Library Fees',
        to: '/library/fees',
        roles: ['ADMIN', 'librarian']
      },
      {
        label: 'Reservations',
        to: '/library/reservations',
        roles: ['ADMIN', 'librarian']
      }
    ]
  }
] 