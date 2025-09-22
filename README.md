# Educational Platform (Grading AI)

A modern educational platform built with React that supports both student and teacher workflows with class management, assignment submission, and grading capabilities.

## 🚀 Features

### For Students
- **Dashboard**: Overview of joined classes, assignments, and grades
- **Class Management**: Join classes using class codes
- **Assignment Submission**: Full-page assignment interface with timer
- **Grade Tracking**: View grades and feedback from teachers
- **Calendar**: View upcoming assignments and deadlines
- **Chat System**: Communication with teachers and classmates

### For Teachers
- **Class Creation**: Create and manage classes
- **Assignment Management**: Create, distribute, and grade assignments
- **Student Management**: View enrolled students and their progress
- **Grading System**: Comprehensive grading interface
- **Analytics**: Class performance insights

## 📁 Project Structure

```
src/
├── component/                 # React Components
│   ├── AssignmentPage.js     # Full-page assignment submission
│   ├── BenefitsSection.js    # Homepage benefits section
│   ├── ChatSystem.js         # Real-time chat functionality
│   ├── ClassManager.js       # Class creation and management
│   ├── ClassStructure.js     # Class structure display
│   ├── GradingPage.js        # Assignment grading interface
│   ├── homepage.js           # Landing page
│   ├── login.js              # Authentication component
│   ├── NotificationSystem.js # In-app notifications
│   ├── ProtectedRoute.js     # Route protection utility
│   ├── RoleSelector.js       # User role selection
│   ├── Student.js            # Student dashboard
│   ├── StudentCalendar.js    # Student calendar view
│   ├── StudentTest.js        # Student test interface
│   ├── Teacher.js            # Teacher dashboard
│   └── TeacherDashboard.js   # Teacher analytics
├── style/                    # CSS Stylesheets
│   ├── assignment-page.css   # Assignment page styles
│   ├── globals.css           # Global design system
│   ├── login.css             # Login page styles
│   ├── student.css           # Student dashboard styles
│   ├── teacher.css           # Teacher dashboard styles
│   └── [other-css-files]     # Component-specific styles
├── utils/                    # Utility Functions
│   └── classDataManager.js   # Class data management
├── App.js                    # Main application component
└── index.js                  # Application entry point
```

## 🎨 Design System

The application uses a unified design system with:
- **Color Scheme**: Sky blue gradient with consistent primary/secondary colors
- **Typography**: Modern sans-serif fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoints

## 🔐 Authentication & Routing

### Protected Routes
- `/student-dashboard` - Student dashboard (requires student role)
- `/teacher-dashboard` - Teacher dashboard (requires teacher role)
- `/assignment/:id` - Assignment page (requires student role)

### Public Routes
- `/` - Homepage
- `/login` - Authentication
- `/role-selector` - Role selection
- `/grading` - Public grading demo

## 🛠️ Key Components

### Student Dashboard (`Student.js`)
- **Tab Navigation**: Classes, Tests, Calendar, Profile
- **Class Management**: Join new classes, view enrolled classes
- **Assignment Tracking**: View pending, submitted, and graded assignments
- **Profile Management**: Edit personal information and avatar

### Assignment Page (`AssignmentPage.js`)
- **Full-page Interface**: Professional assignment submission environment
- **Timer System**: Real-time countdown with auto-submit
- **File Upload**: Support for PDF, DOC, DOCX, TXT files
- **Progress Tracking**: Save and resume functionality

### Teacher Dashboard (`Teacher.js`)
- **Class Management**: Create and manage classes
- **Student Oversight**: View enrolled students and their progress
- **Assignment Distribution**: Create and distribute assignments
- **Grading Interface**: Comprehensive grading tools

## 🔧 State Management

### Local Storage Usage
- `userLoggedIn`: Authentication status
- `userRole`: User role (student/teacher)
- `userName`: Display name
- `studentId`: Unique student identifier

### Component State
- **React Hooks**: useState, useEffect for component state
- **Navigation**: React Router for SPA navigation
- **Form Handling**: Controlled components for form inputs

## 🎯 Development Guidelines

### Code Organization
- **Component Structure**: Logical grouping with clear imports
- **CSS Methodology**: Component-specific stylesheets with global design system
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **Documentation**: JSDoc comments for all major functions

### Best Practices
- **Responsive Design**: Mobile-first CSS with proper breakpoints
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Performance**: Lazy loading and optimized component structure
- **Security**: Protected routes and input validation

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Default credentials available on login page

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔄 Data Flow

1. **Authentication**: Login → Role Selection → Dashboard
2. **Class Management**: Join/Create → View Details → Manage Content
3. **Assignment Flow**: Create → Distribute → Submit → Grade → Feedback

## 🎨 UI Components

### Reusable Components
- **Button System**: Primary, secondary, danger variants
- **Form Elements**: Consistent input styling and validation
- **Modal System**: Overlay components for interactions
- **Navigation**: Tab system with active states

### Design Tokens
- **Colors**: Defined in CSS custom properties
- **Spacing**: Consistent padding/margin system
- **Typography**: Font weight and size hierarchy
- **Shadows**: Elevation system for depth

## 📊 Features in Development

- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Performance insights and reporting
- **Mobile App**: React Native companion app
- **API Integration**: Backend service connection

---

Built with ❤️ using React and modern web technologies.