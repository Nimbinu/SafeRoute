# SafeRoute Testing Roadmap - Admin Perspective

## Prerequisites
- You need an admin account
- To create admin: Run `node makeAdmin.js <email>` in backend folder
- Or use existing admin credentials

---

## 1. Create Admin Account

### Make User Admin
1. Open terminal in `e:\SafeRoute\backend`
2. Run command:
   ```
   node makeAdmin.js sandali12@gmail.com
   ```
3. **Expected**: User is now admin with full permissions

---

## 2. Admin Login

### Login as Admin
1. Go to `http://localhost:3000/login`
2. Enter admin credentials:
   - Email: sandali12@gmail.com (or your admin email)
   - Password: password123
3. Click "Login"
4. **Expected**: Access to admin features

---

## 3. Access Admin Dashboard

### Navigate to Admin Panel
1. After login, go to `http://localhost:3000/admin`
2. OR click "Admin Dashboard" in sidebar/menu
3. **Expected**: Admin dashboard loads with:
   - Overview statistics
   - User management
   - Hazard management
   - System controls

---

## 4. Dashboard Overview

### View Statistics
1. Check dashboard metrics:
   - **Total Users**: Count of registered users
   - **Total Hazards**: All reported hazards
   - **Active Hazards**: Currently active hazards
   - **Resolved Hazards**: Resolved count
   - **Pending Reports**: Awaiting verification
2. **Expected**: All numbers display correctly

### View Charts (if implemented)
1. Check hazard distribution chart
2. View user activity graph
3. Review hazard trends
4. **Expected**: Visual data representations

---

## 5. User Management

### View All Users
1. Navigate to "Users" tab/section
2. **Expected**: Table showing:
   - User ID
   - Full Name
   - Email
   - Role (user/admin/moderator)
   - Registration Date
   - Status (Active/Inactive)

### Search Users
1. Use search bar to find user by name/email
2. **Expected**: Filtered results display

### View User Details
1. Click on any user row
2. **Expected**: User profile modal/page shows:
   - Personal information
   - Reported hazards count
   - Account status
   - Activity history

### Manage User Roles
1. Select a user
2. Change role dropdown: User → Moderator → Admin
3. Click "Update Role"
4. **Expected**: 
   - Role updated successfully
   - User gains new permissions

### Suspend/Activate Users
1. Find user to suspend
2. Click "Suspend" or toggle status
3. **Expected**: User account suspended (cannot login)
4. Reactivate user
5. **Expected**: User can login again

### Delete User (if implemented)
1. Select problematic user
2. Click "Delete User"
3. Confirm deletion
4. **Expected**: User removed from system

---

## 6. Hazard Management

### View All Hazards
1. Go to "Hazards" section
2. **Expected**: List of all reported hazards:
   - Hazard ID
   - Type
   - Location
   - Reporter
   - Status
   - Severity
   - Date reported

### Filter Hazards
1. Filter by:
   - Status (Pending/Verified/Resolved)
   - Type (Accident/Pothole/etc.)
   - Severity (Low/Medium/High)
   - Date range
2. **Expected**: Results update accordingly

### Review Pending Hazards
1. Filter by "Pending" status
2. **Expected**: See all unverified reports

### Verify Hazard
1. Click on pending hazard
2. Review details:
   - Description
   - Location
   - Photo (if uploaded)
   - Reporter info
3. Click "Verify" or "Approve"
4. **Expected**: 
   - Status changes to "Verified"
   - Hazard visible to all users

### Reject Hazard
1. Select suspicious/invalid hazard
2. Click "Reject" or "Delete"
3. Add rejection reason (optional)
4. **Expected**: 
   - Hazard removed or marked invalid
   - Reporter notified (if implemented)

### Update Hazard Status
1. Find verified hazard
2. Change status to "Resolved"
3. Add resolution notes
4. **Expected**: Hazard marked as resolved

### Edit Hazard Details
1. Click "Edit" on any hazard
2. Modify:
   - Type
   - Severity
   - Description
   - Location
3. Save changes
4. **Expected**: Hazard updated

### Delete Hazard
1. Select hazard to remove
2. Click "Delete"
3. Confirm deletion
4. **Expected**: Hazard permanently removed

### View Hazard on Map
1. Click "View on Map" for any hazard
2. **Expected**: Map opens showing hazard location

---

## 7. Analytics & Reports

### Generate Reports
1. Go to "Reports" section
2. Select report type:
   - User activity report
   - Hazard statistics
   - Monthly summary
3. Set date range
4. Click "Generate Report"
5. **Expected**: Report displays/downloads

### Export Data
1. Click "Export" button
2. Choose format (CSV/Excel/PDF)
3. **Expected**: Data file downloads

---

## 8. System Settings (if implemented)

### Configure System
1. Go to "Settings" tab
2. Adjust:
   - Auto-verification rules
   - Notification settings
   - Data retention policies
3. Save changes
4. **Expected**: Settings applied system-wide

---

## 9. Content Management

### Manage About Page (if exists)
1. Navigate to "Content" section
2. Edit About page content
3. Update team members
4. Manage FAQs
5. **Expected**: Changes reflected on website

---

## 10. Moderator Management

### Assign Moderator Role
1. Go to Users section
2. Select reliable user
3. Change role to "Moderator"
4. **Expected**: User can now verify hazards

### View Moderator Activity
1. Check moderator actions log
2. **Expected**: See verification history

---

## 11. Security & Permissions Testing

### Test Admin-Only Access
1. Logout
2. Login as regular user
3. Try to access `/admin`
4. **Expected**: Access denied, redirected

### Verify Admin Powers
1. As admin, confirm you can:
   - ✅ View all users
   - ✅ Modify user roles
   - ✅ Verify/reject hazards
   - ✅ Delete content
   - ✅ Access analytics

---

## 12. Bulk Operations

### Bulk Verify Hazards
1. Select multiple pending hazards
2. Click "Bulk Verify"
3. **Expected**: All selected hazards verified

### Bulk Delete
1. Select multiple items (users/hazards)
2. Click "Bulk Delete"
3. Confirm action
4. **Expected**: All items removed

---

## 13. Search & Sort

### Search Functionality
1. Use global search bar
2. Search for users, hazards, locations
3. **Expected**: Relevant results displayed

### Sort Data
1. Click column headers to sort:
   - By date
   - By name
   - By status
2. **Expected**: Data reorders

---

## 14. Notifications & Alerts

### View Admin Notifications
1. Check notification center
2. **Expected**: Alerts for:
   - New user registrations
   - Pending hazard reports
   - System issues

---

## Admin Workflow Summary

✅ Login as Admin → ✅ View Dashboard Stats → ✅ Review Pending Hazards → ✅ Verify/Reject Reports → ✅ Manage Users → ✅ Assign Moderators → ✅ Generate Reports → ✅ Monitor System

---

## Critical Admin Tasks Checklist

- [ ] Verify new hazard reports daily
- [ ] Review user accounts for suspicious activity
- [ ] Monitor system statistics
- [ ] Resolve user complaints
- [ ] Maintain data integrity
- [ ] Backup system data
- [ ] Update content as needed
- [ ] Train and manage moderators

---

## Notes
- Admin has highest privileges - use carefully
- All admin actions should be logged
- Regularly review system health
- Keep user data confidential
