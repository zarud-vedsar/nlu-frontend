export const RoleData = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Admin",
        value: "Admin",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Faculty",
        value: "Faculty",
        crud: ["list", "others dashboard"], // CRUD operations
      },
    ],
  },
  {
    title: "Exam Management",
    items: [
      {
        label: "Add Exam Paper",
        value: "Add Exam Paper",
        crud: ["create"],
      },
      {
        label: "Exam Paper List",
        value: "Exam Paper List",
        crud: [
          "update",
          "delete",
          "list",
          "change password",
          "add question",
          "marks upload",
          "view exam paper",
        ],
      },
      {
        label: "Admit Card",
        value: "Admit Card",
        crud: ["create", "list", "download"], // CRUD operations
      },
      {
        label: "Assignment",
        value: "Assignment",
        crud: [
          "create",
          "list",
          "update",
          "status",
          "delete",
          "add question",
          "recycle bin",
        ], // CRUD operations
      },
      {
        label: "Assignment Response",
        value: "Assignment Response",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Quiz",
        value: "Quiz",
        crud: [
          "create",
          "list",
          "update",
          "status",
          "delete",
          "add question",
          "recycle bin",
        ], // CRUD operations
      },
      {
        label: "Quiz Response",
        value: "Quiz Response",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Expense Management",
    items: [
      {
        label: "Expense Category",
        value: "Expense Category",
        crud: [
          "update",
          "delete",
          "list",
          "add category",
        ],
      },
      {
        label: "Add New Expense",
        value: "Add New Expense",
        crud: [
          "update",
          "add question",
          
        ],
      },
      {
        label: "Expense List",
        value: "Expense List",
        crud: [
          "update",
          "delete",
          "list",
          "add expense",
        ],
            },
     
    ],
  },
  {
    title: "Attendance Management",
    items: [
      {
        label: "Mark Class Attendance",
        value: "Mark Class Attendance",
        crud: ["mark attendance"], // CRUD operations
      },
      {
        label: "Class Attendance History",
        value: "Class Attendance History",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Mark Hostel Attendance",
        value: "Mark Hostel Attendance",
        crud: ["mark attendance"], // CRUD operations
      },
      {
        label: "Update Hostel Attendance",
        value: "Update Hostel Attendance",
        crud: ["update"], // CRUD operations
      },
      {
        label: "Hostel Attendance History",
        value: "Hostel Attendance History",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Compile Class Attendance",
        value: "Compile Class Attendance",
        crud: ["create"], // CRUD operations
      },
      {
        label: "View Compile Attendance",
        value: "View Compile Attendance",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Expense Management",
    items: [
      {
        label: "Expense Category",
        value: "Expense Category",
        crud: ["create", "update", "list", "delete"], // CRUD operations
      },
      {
        label: "Add New Expense",
        value: "Add New Expense",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Expense List",
        value: "Expense List",
        crud: ["update", "list", "delete"], // CRUD operations
      },
    ],
  },
  {
    title: "Learning Management",
    items: [
      {
        label: "Session",
        value: "Session",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Faculty Department",
        value: "Faculty Department",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Department",
        value: "Department",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Designation",
        value: "Designation",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Course",
        value: "Course",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Semester",
        value: "Semester",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Session Wise Semester Class",
        value: "Session Wise Semester Class",
        crud: ["create", "update", "list"], // CRUD operations
      },
      {
        label: "Semester Wise Subject",
        value: "Semester Wise Subject",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Topic",
        value: "Topic",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        label: "Add Pdfs",
        value: "Add Pdfs",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Pdfs List",
        value: "Pdfs List",
        crud: ["update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Add Videos",
        value: "Add Videos",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Videos List",
        value: "Videos List",
        crud: ["update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Add Live Class",
        value: "Add Live Class",
        crud: ["create"],
      },
      {
        label: "Live Classes List",
        value: "Live Classes List",
        crud: ["update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      {
        label: "Inventory Category",
        value: "Inventory Category",
        crud: ["create", "update", "status", "list"], // CRUD operations
      },
      {
        label: "Add Product",
        value: "Add Product",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Product List",
        value: "Product List",
        crud: ["update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Stock In",
        value: "Stock In",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Stock In History",
        value: "Stock In History",
        crud: ["update", "list"], // CRUD operations
      },
      {
        label: "Stock Out",
        value: "Stock Out",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Stock Out History",
        value: "Stock Out History",
        crud: ["update", "list"], // CRUD operations
      },
      {
        label: "Critical Stock Products",
        value: "Critical Stock Products",
        crud: ["list", "notify for restock"], // CRUD operations
      },
      {
        label: "Restock Notification List",
        value: "Restock Notification List",
        crud: ["list", "view", "Update Restock Notification Status"], // CRUD operations
      },
    ],
  },
  {
    title: "Time Table Management",
    items: [
      {
        label: "Time Slot",
        value: "Time Slot",
        crud: ["create", "update", "status", "list"], // CRUD operations
      },
      {
        label: "Add New Time Table",
        value: "Add New Time Table",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Time Table List",
        value: "Time Table List",
        crud: [
          "update",
          "status",
          "list",
          "download",
          "Send Time Table Update Notification to Student via Email",
        ], // CRUD operations
      },
      {
        label: "Subjects Assigned to Faculty",
        value: "Subjects Assigned to Faculty",
        crud: ["create"], // CRUD operations
      },
      {
        label: "List of Subjects Assigned to Faculty",
        value: "List of Subjects Assigned to Faculty",
        crud: ["update", "list"], // CRUD operations
      },
    ],
  },
  {
    title: "Communication Management",
    items: [
      {
        label: "New Message",
        value: "New Message",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Message List",
        value: "Message List",
        crud: ["update", "list"], // CRUD operations
      },
    ],
  },
  {
    title: "Hostel Management",
    items: [
      {
        label: "Add Room",
        value: "Add Room",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Room List",
        value: "Room List",
        crud: ["update", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Visitor Entry", // Changed from title to label
        value: "Visitor Entry",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Hostel Visitor History", // Changed from title to label
        value: "Hostel Visitor History",
        crud: ["update", "list"], // CRUD operations
      },
      {
        label: "Room Allotment",
        value: "Room Allotment",
        crud: ["allot room to student"], // CRUD operations
      },
      {
        label: "Alloted Room History",
        value: "Alloted Room History",
        crud: ["update", "list"], // CRUD operations
      },
      {
        label: "Raised Room Queries",
        value: "Raised Room Queries",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Room Complaints",
        value: "Room Complaints",
        crud: ["list", "remark"],
      },

      {
        label: "Leave Request",
        value: "Leave Request",
        crud: ["list", "remark", "response", "mark as return"], // CRUD operations
      },
    ],
  },
  {
    title: "Visitor Management",
    items: [
      {
        label: "Registration",
        value: "Registration",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Visitor History",
        value: "Visitor History",
        crud: ["update", "list"], // CRUD operations
      },
    ],
  },
  {
    title: "Student Management",
    items: [
      {
        label: "Applications List",
        value: "Applications List",
        crud: ["list", "response"], // CRUD operations
      },
      {
        label: "Academic Student List",
        value: "Academic Student List",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Feedbacks",
        value: "Feedbacks",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Announcements",
    items: [
      {
        label: "Achievement",
        value: "Achievement",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Announcements",
        value: "Announcements",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
    ],
  },
  {
    title: "Website CMS Settings",
    items: [
      {
        label: "Menu",
        value: "Menu",
        crud: ["create", "update", "status", "list", "delete"], // CRUD operations
      },
      {
        label: "Add Page",
        value: "Add Page",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Page List",
        value: "Page List",
        crud: ["update", "status", "list", "delete"], // CRUD operations
      },
      {
        label: "Faqs",
        value: "Faqs",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "About",
        value: "About",
        crud: ["update"], // CRUD operations
      },
      {
        label: "Important Update Sliders",
        value: "Important Update Sliders",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Message",
        value: "Message",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Mission",
        value: "Mission",
        crud: ["update"], // CRUD operations
      },
      {
        label: "Vission",
        value: "Vission",
        crud: ["update"], // CRUD operations
      },
      {
        label: "Popup Notice",
        value: "Popup Notice",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Speciality",
        value: "Speciality",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Useful Links",
        value: "Useful Links",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Website Home Video",
        value: "Website Home Video",
        crud: ["update"], // CRUD operations
      },
    ],
  },
  {
    title: "HR Management",
    items: [
      {
        label: "Employee",
        value: "Employee",
        crud: ["create", "update", "status", "list"], // CRUD operations
      },
    ],
  },
  {
    title: "Inquiry",
    items: [
      {
        label: "Contact",
        value: "Contact",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Feedback",
        value: "Feedback",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Grievance",
        value: "Grievance",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Library Management",
    items: [
      {
        label: "Book",
        value: "Book",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Issue Book",
        value: "Issue Book",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Library Setting",
        value: "Library Setting",
        crud: ["update"], // CRUD operations
      },
    ],
  },
  {
    title: "Media",
    items: [
      {
        label: "Media Category",
        value: "Media Category",
        crud: ["create", "update", "status", "list", "delete"], // CRUD operations
      },
      {
        label: "Image",
        value: "Image",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Video",
        value: "Video",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Job Category",
        value: "Job Category",
        crud: ["create", "update", "status", "list", "delete"], // CRUD operations
      },
      {
        label: "Job",
        value: "Job",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Job Applications",
        value: "Job Applications",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        label: "Reports",
        value: "Reports",
        crud: ["list"], // CRUD operations
      },
    ],
  },
  {
    title: "Policies",
    items: [
      {
        label: "Anti Ragging Policy",
        value: "Anti Ragging Policy",
        crud: ["create", "list"], // CRUD operations
      },
      {
        label: "Copyright Policy",
        value: "Copyright Policy",
        crud: ["create", "list"], // CRUD operations
      },
      {
        label: "Privacy Policy",
        value: "Privacy Policy",
        crud: ["create", "list"], // CRUD operations
      },
      {
        label: "Terms Of Use Policy",
        value: "Terms Of Use Policy",
        crud: ["create", "list"], // CRUD operations
      },
      {
        label: "Terms And Conditions",
        value: "Terms And Conditions",
        crud: ["create", "list"], // CRUD operations
      },
    ],
  },
  {
    title: "Student Corner",
    items: [
      {
        label: "Scholarship",
        value: "Scholarship",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Internship",
        value: "Internship",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Internship Application",
        value: "Internship Application",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Placement",
        value: "Placement",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
      {
        label: "Placement Application",
        value: "Placement Application",
        crud: ["list"], // CRUD operations
      },
      {
        label: "Students Testimonial",
        value: "Students Testimonial",
        crud: ["create", "update", "status", "list", "delete", "recycle bin"], // CRUD operations
      },
    ],
  },
  {
    title: "Role & Permission",
    items: [
      {
        label: "Add New",
        value: "Add New",
        crud: ["create"], // CRUD operations
      },
      {
        label: "Role List",
        value: "Role List",
        crud: ["update", "status", "list", "delete"], // CRUD operations
      },
    ],
  },
  {
    title: "University Settings",
    items: [
      {
        label: "University Settings",
        value: "University Settings",
        crud: ["update"], // CRUD operations
      },
    ],
  },
];

/**
 * export const RoleData = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        value: "Dashboard",
        crud: ["create", "read", "update", "delete", "status"] // CRUD operations
      }
    ]
  },
  {
    title: "Standard Pages",
    items: [
      {
        label: "Standard Pages",
        value: "Standard Pages",
        crud: ["create", "read", "update", "delete", "status"] // CRUD operations
      }
    ]
  },
  {
    title: "Announcement",
    items: [
      {
        label: "Announcement",
        value: "Announcement",
        crud: ["create", "read", "update", "delete", "status"] // CRUD operations
      }
    ]
  },
  {
    title: "CMS",
    items: [
      // Full CRUD permissions
      {
        label: "Menu",
        value: "Menu",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Faqs",
        value: "Faqs",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Gallery",
        value: "Gallery",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Useful Links",
        value: "Useful Links",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Messages",
        value: "Messages",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Popup Notice",
        value: "Popup Notice",
        crud: ["create", "read", "update", "delete", "status"]
      },
      {
        label: "Students Testimonial",
        value: "Students Testimonial",
        crud: ["create", "read", "update", "delete", "status"]
      },
      // Limited permissions (only "update")
      {
        label: "About",
        value: "About",
        crud: ["update"]
      },
      {
        label: "Mission",
        value: "Mission",
        crud: ["update"]
      },
      {
        label: "Vision",
        value: "Vision",
        crud: ["update"]
      }
    ]
  }
];

 */
