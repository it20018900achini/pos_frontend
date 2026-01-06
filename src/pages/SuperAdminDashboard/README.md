# SuperAdmin Dashboard

A comprehensive dashboard for managing all stores, commissions, and system-wide operations in the POS system.

## 🏗️ Folder Structure

```
src/pages/SuperAdminDashboard/
├── components/
│   ├── SuperAdminSidebar.jsx      # Navigation sidebar
│   ├── SuperAdminTopbar.jsx       # Top navigation bar
│   ├── StoreStatusBadge.jsx       # Status indicator component
│   ├── StoreTable.jsx             # Store listing table
│   ├── StoreDetailDrawer.jsx      # Store details slide-out panel
│   └── index.js                   # Component exports
├── Dashboard.jsx                  # Main dashboard with stats and charts
├── StoreListPage.jsx              # All stores management
├── StoreDetailsPage.jsx           # Individual store details
├── PendingRequestsPage.jsx        # Store approval requests
├── CommissionsPage.jsx            # Commission management
├── ExportsPage.jsx                # Data export functionality
├── SettingsPage.jsx               # Admin settings and preferences
├── SuperAdminDashboard.jsx        # Main layout wrapper
├── index.js                       # Page exports
└── README.md                      # This file
```

## 🧭 Navigation Menu

- **📊 Dashboard** - Overview with statistics and charts
- **🏪 Stores** - Manage all registered stores
- **📥 Pending Requests** - Review store approval requests
- **💸 Commissions** - Manage store commission rates
- **📤 Exports** - Generate and download reports
- **⚙️ Settings** - Admin profile and system settings

## 🖥️ Main Pages

### 1. Dashboard (`/super-admin/dashboard`)
- **Stat Cards**: Total Stores, Active Stores, Blocked Stores, Pending Requests
- **Bar Chart**: Store registrations over the last 30 days
- **Pie Chart**: Store status distribution
- **Recent Activity**: Latest system events

### 2. Stores (`/super-admin/stores`)
- **Table View**: Complete store listing with search and filters
- **Actions**: View details, block/activate stores, edit information
- **Filters**: Status, date range, search by name/owner/email
- **Store Detail Drawer**: Slide-out panel with comprehensive store information

### 3. Pending Requests (`/super-admin/requests`)
- **Request Table**: List of stores awaiting approval
- **Approval Actions**: Approve or reject with reason
- **Document Review**: View uploaded business documents
- **Confirmation Dialogs**: Safe approval/rejection process

### 4. Commissions (`/super-admin/commissions`)
- **Commission Rates**: View and edit store commission percentages
- **Earnings Summary**: Total and average commission statistics
- **Rate History**: Track commission rate changes
- **Edit Modal**: Update commission rates with validation

### 5. Exports (`/super-admin/exports`)
- **Export Types**: Store List, Status Summary, Commission Report, Pending Requests
- **Date Range**: Filter exports by date
- **Recent Exports**: Download history and status
- **Multiple Formats**: CSV and Excel exports

### 6. Settings (`/super-admin/settings`)
- **Profile Management**: Update admin information
- **Security**: Change password with validation
- **Notifications**: Configure notification preferences
- **System Settings**: Auto-approval, document verification, maintenance mode

## 🧩 Reusable Components

### StoreStatusBadge
- Displays store status with appropriate colors
- Supports: Active (green), Pending (yellow), Blocked (red)
- Includes status icons for better UX

### StoreTable
- Responsive table with search and filtering
- Action dropdowns for each store
- Status-based action availability
- Pagination support

### StoreDetailDrawer
- Slide-out panel for detailed store information
- Owner and store information sections
- Document previews
- Quick action buttons

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Collapsible sidebar** for smaller screens
- **Horizontal scrolling** for tables on mobile
- **Touch-friendly** buttons and interactions

## 🎨 Theme & UX

- **Consistent color scheme** with shadcn/ui components
- **Status-based colors**: Green (success), Yellow (warning), Red (error)
- **Icon usage**: Lucide React icons throughout
- **Toast notifications** for user feedback
- **Loading states** and error handling

## 🔧 Technical Features

- **Redux integration** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Form validation** with proper error handling
- **Mock data** for development and testing
- **TypeScript-ready** structure

## 🚀 Getting Started

1. **Access**: Navigate to `/super-admin` with `SUPER_ADMIN` role
2. **Dashboard**: Start with the overview dashboard
3. **Stores**: Manage store registrations and statuses
4. **Requests**: Review and approve pending store requests
5. **Commissions**: Set and manage commission rates
6. **Exports**: Generate reports as needed
7. **Settings**: Configure your preferences

## 🔐 Security

- **Role-based access** control
- **Password validation** for changes
- **Confirmation dialogs** for critical actions
- **Input sanitization** and validation
- **Secure routing** with proper authentication

## 📊 Data Management

- **Real-time updates** for store status changes
- **Bulk operations** for efficiency
- **Export capabilities** for reporting
- **Audit trail** for important actions
- **Backup and restore** functionality

## 🎯 Future Enhancements

- **Advanced analytics** and reporting
- **Bulk store operations**
- **Automated approval workflows**
- **Integration with external services**
- **Mobile app support**
- **Real-time notifications**
- **Advanced filtering and search**
- **Custom dashboard widgets** 