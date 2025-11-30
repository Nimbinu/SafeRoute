# SafeRoute - Administrator Guide (Admin Role)

## 🎯 Overview
This guide is for **administrators** who manage the SafeRoute system, verify hazards, manage users, and maintain system integrity.

---

## 🔐 Admin Access

### Admin Login Credentials:
```
Email: admin@saferoute.com
Password: admin123
```

### Creating Admin Account (via Backend):
```bash
cd backend
node makeAdmin.js admin@saferoute.com
```

### Steps to Login:
1. Go to `http://localhost:3000`
2. Enter admin email and password
3. Click **"Login"** button
4. Redirected to **Admin Dashboard** (not regular Dashboard)

---

## 📱 Admin Pages - Complete Guide

---

## 1️⃣ ADMIN DASHBOARD PAGE (`/admin`)

### What You See:

#### System Overview Cards:

**1. Total Users 👥**
```
Count: 1,234
Description: Registered users in system
Action: Click → View all users
```

**2. Active Hazards ⚠️**
```
Count: 45
Description: Current hazards requiring attention
Action: Click → Manage hazards
```

**3. Pending Reports 📝**
```
Count: 12
Description: Hazards awaiting verification
Action: Click → Review pending hazards
```

**4. Total Routes 🗺️**
```
Count: 5,678
Description: Routes calculated by users
Action: Click → View route statistics
```

### Main Sections:

#### A. User Management Tab
- View all registered users
- Search and filter users
- Manage user roles
- Deactivate/activate accounts

#### B. Hazard Management Tab
- All hazards list
- Pending hazards (need verification)
- Verified hazards
- Resolved hazards
- Rejected hazards

#### C. About Page Management Tab
- Update company information
- Manage FAQs
- Manage team members
- System settings

#### D. System Statistics
- Daily/weekly/monthly reports
- User activity graphs
- Hazard trends
- Route popularity

### Header Elements:
- **Admin Dashboard** title
- **Profile** button → Your admin profile
- **Logout** button → Exit admin panel

---

## 2️⃣ USER MANAGEMENT SECTION

### Overview:

#### Users List Display:
```
ID | Name           | Email                  | Role  | Status | Joined
---|----------------|------------------------|-------|--------|----------
1  | John Doe       | john@example.com       | User  | Active | Jan 2024
2  | Sarah Johnson  | sarah@example.com      | User  | Active | Feb 2024
3  | Admin User     | admin@saferoute.com    | Admin | Active | Jan 2024
```

### Search & Filter:
- **Search Bar**: Find by name or email
- **Role Filter**: All / Admin / User
- **Status Filter**: All / Active / Inactive
- **Sort**: By name, date joined, role

### User Actions:

#### 1. View User Details
**Steps:**
1. Click on user name or email
2. User detail modal opens

**Information Displayed:**
```
Full Name: John Doe
Email: john@example.com
Phone: +94 71 234 5678
Role: User
Status: Active
Joined: January 15, 2024
Last Login: November 28, 2024

Statistics:
- Routes Calculated: 45
- Hazards Reported: 12
- Reports Verified: 8
```

#### 2. Change User Role
**Steps:**
1. Click **"Edit"** button on user row
2. Select new role from dropdown:
   ```
   ○ User (Standard access)
   ● Admin (Full system access)
   ```
3. Click **"Update Role"**
4. Confirmation dialog appears
5. Click **"Confirm"**

**Example:**
```
User: sarah@example.com
Current Role: User
New Role: Admin
Action: Promote to Administrator
```

#### 3. Deactivate/Activate User
**Steps:**
1. Click **"Status"** toggle on user row
2. Confirmation dialog:
   ```
   Are you sure you want to deactivate this user?
   User: john@example.com
   
   [Cancel] [Deactivate]
   ```
3. Click **"Deactivate"** or **"Activate"**
4. Status updated immediately

**Effects:**
- Deactivated users cannot login
- Their hazard reports remain visible
- Routes history preserved
- Can be reactivated anytime

#### 4. Delete User (Permanent)
**Steps:**
1. Click **"Delete"** button (🗑️ icon)
2. Warning dialog:
   ```
   ⚠️ WARNING: This action cannot be undone!
   
   Delete user: john@example.com?
   - All user data will be permanently removed
   - Hazard reports will be marked as "Anonymous"
   - Route history will be deleted
   
   Type 'DELETE' to confirm:
   [_____________]
   
   [Cancel] [Delete Permanently]
   ```
3. Type "DELETE" in confirmation box
4. Click **"Delete Permanently"**
5. User removed from system

---

## 3️⃣ HAZARD MANAGEMENT SECTION

### Overview Tabs:

#### Tab Navigation:
- **All Hazards** (Shows everything)
- **Pending** (Requires verification)
- **Verified** (Admin approved)
- **Resolved** (Issue fixed)
- **Rejected** (Invalid reports)

### Hazards List Display:

```
ID  | Type         | Location              | Severity | Status   | Reported By    | Date
----|--------------|----------------------|----------|----------|----------------|----------
101 | Road Damage  | Main St, Colombo     | High     | Pending  | john@ex.com    | Nov 28
102 | Flood        | Kandy Road          | Critical | Verified | sarah@ex.com   | Nov 27
103 | Construction | Galle Fort          | Low      | Verified | admin@sf.com   | Nov 26
```

### Filter & Search:
- **Search**: By type, location, reporter
- **Severity**: All / Critical / High / Medium / Low
- **Status**: All / Pending / Verified / Resolved / Rejected
- **Date Range**: Last 7 days / 30 days / All time
- **Reporter**: Specific user

### Hazard Actions:

#### 1. Review Pending Hazard (Most Important)

**Steps:**
1. Click on hazard ID or row
2. Hazard detail modal opens

**Information Displayed:**
```
Hazard ID: #101
Type: Road Damage
Location: Main Street, Colombo 07
Coordinates: 6.9271, 79.8612
Severity: High
Status: Pending
Reported By: john@example.com
Reported On: November 28, 2024, 10:30 AM

Description:
Large pothole approximately 2 feet deep on Main Street 
near the traffic light. Causing vehicles to swerve 
dangerously. Water accumulated inside making it 
difficult to see depth.

Photos: [View Images]
[Photo 1] [Photo 2]

Map View: [Interactive map showing exact location]
```

**Verification Actions:**

**A. Verify Hazard**
```
Steps:
1. Review all information carefully
2. Check photos if available
3. Verify location on map
4. Click "Verify" button
5. Add optional admin notes:
   
   Admin Notes: Verified via traffic camera footage.
                Contact road authority notified.
                
6. Click "Confirm Verification"

Result: Status → Verified
        Email notification sent to reporter
```

**B. Reject Hazard**
```
Steps:
1. Click "Reject" button
2. Select rejection reason:
   ○ Duplicate report
   ○ Invalid location
   ○ Insufficient information
   ○ Spam/false report
   ○ Already resolved
   ○ Other

3. Add rejection note (required):
   
   Rejection Reason: This hazard was already reported 
                     by another user (Hazard #095).
                     
4. Click "Confirm Rejection"

Result: Status → Rejected
        Email notification sent to reporter explaining why
```

**C. Mark as Resolved**
```
Steps:
1. Click "Mark Resolved" button
2. Add resolution notes:
   
   Resolution Notes: Pothole has been filled by 
                     municipal corporation on Nov 29.
                     Road is now safe for travel.
                     
3. Click "Confirm Resolution"

Result: Status → Resolved
        Hazard removed from active warnings
        Reporter notified
```

**D. Edit Hazard Information**
```
Steps:
1. Click "Edit" button
2. Modify any field:
   - Hazard Type
   - Location/Coordinates
   - Severity (upgrade/downgrade)
   - Description

Example Edit:
   Original Severity: Medium
   Updated Severity: High
   Admin Note: Severity increased after field verification
   
3. Click "Save Changes"
4. Change log recorded
```

#### 2. Bulk Actions

**Steps:**
1. Select multiple hazards (checkboxes)
2. Choose bulk action:
   - Verify Selected
   - Reject Selected
   - Mark Resolved
   - Delete Selected
3. Confirm action
4. All selected hazards updated

**Example:**
```
Selected: 5 hazards
Action: Verify Selected
Confirmation: Verify all 5 hazards?
Result: All 5 → Verified status
```

---

## 4️⃣ ABOUT PAGE MANAGEMENT

### What You Can Manage:

#### A. Company Information

**Edit Company Details:**
```
Steps:
1. Navigate to "About Page" tab
2. Click "Edit Company Info"
3. Update fields:

   Company Name: SafeRoute
   Mission: Making roads safer for everyone
   Vision: A future with zero road hazards
   Description: Community-driven platform...
   
4. Click "Save Changes"
```

#### B. FAQ Management

**View Current FAQs:**
```
FAQ List:
1. What is SafeRoute?
2. How do I report a hazard?
3. How are routes calculated?
4. Is the service free?
```

**Add New FAQ:**
```
Steps:
1. Click "Add FAQ" button
2. Fill form:

   Question: How long does verification take?
   Answer: Most hazards are verified within 24 hours.
           Critical hazards are prioritized and may be
           verified within 1-2 hours.
   Category: General
   Order: 5
   
3. Click "Add FAQ"
```

**Edit Existing FAQ:**
```
Steps:
1. Click "Edit" on FAQ item
2. Update question or answer
3. Click "Save Changes"
```

**Delete FAQ:**
```
Steps:
1. Click "Delete" button
2. Confirm deletion
3. FAQ removed from About page
```

**Reorder FAQs:**
```
Steps:
1. Click "Reorder" button
2. Drag and drop FAQs to desired position
3. Click "Save Order"
```

#### C. Team Member Management

**Current Team Display:**
```
Name          | Role                | Photo        | Order
--------------|---------------------|--------------|------
John Smith    | Founder & CEO       | [Photo]      | 1
Sarah Lee     | CTO                 | [Photo]      | 2
Mike Johnson  | Lead Developer      | [Photo]      | 3
```

**Add Team Member:**
```
Steps:
1. Click "Add Team Member"
2. Fill form:

   Name: Emma Wilson
   Role: Community Manager
   Bio: Passionate about road safety...
   Email: emma@saferoute.com
   LinkedIn: linkedin.com/in/emmawilson
   Twitter: @emmawilson
   Photo: [Upload Image]
   Display Order: 4
   
3. Click "Add Member"
```

**Edit Team Member:**
```
Steps:
1. Click "Edit" on team member
2. Update any information
3. Upload new photo if needed
4. Click "Save Changes"
```

**Remove Team Member:**
```
Steps:
1. Click "Remove" button
2. Confirm removal
3. Member removed from About page
```

---

## 5️⃣ STATISTICS & REPORTS

### Dashboard Analytics:

#### User Statistics
```
Total Registered Users: 1,234
Active Users (Last 30 days): 856
New Registrations (This Month): 45
User Growth Rate: +12%
```

#### Hazard Statistics
```
Total Hazards Reported: 567
Pending Verification: 12
Verified Hazards: 423
Resolved Hazards: 98
Rejected Reports: 34

Breakdown by Severity:
- Critical: 15
- High: 87
- Medium: 234
- Low: 231

Breakdown by Type:
- Road Damage: 245
- Construction: 123
- Flood: 67
- Accident: 45
- Other: 87
```

#### Route Statistics
```
Total Routes Calculated: 5,678
Routes This Month: 234
Average Routes per User: 4.6
Popular Routes:
1. Colombo → Kandy (456 times)
2. Galle → Colombo (234 times)
3. Kandy → Nuwara Eliya (198 times)
```

### Generate Reports:

**Steps:**
1. Click "Generate Report" button
2. Select report type:
   - User Activity Report
   - Hazard Analysis Report
   - Route Usage Report
   - System Performance Report
3. Select date range
4. Choose format: PDF / CSV / Excel
5. Click "Generate"
6. Download report

**Example Report:**
```
Report Type: Hazard Analysis
Date Range: November 1-30, 2024
Format: PDF

Content:
- Total hazards by type
- Geographic distribution
- Response time analysis
- Verification rate
- Resolution time
```

---

## 6️⃣ ADMIN PROFILE PAGE

### What You See:
Same as regular user profile, but with additional admin badge

### Admin-Specific Features:

#### System Permissions
```
Permissions:
✅ Manage Users
✅ Verify Hazards
✅ Edit Content
✅ View Analytics
✅ Generate Reports
✅ System Settings
```

#### Activity Log
```
Recent Actions:
- Verified Hazard #101 (2 hours ago)
- Promoted user sarah@example.com to Admin (1 day ago)
- Updated FAQ section (2 days ago)
- Generated monthly report (3 days ago)
```

---

## 🎯 Admin Workflow Examples

### Typical Daily Workflow:

#### Morning Routine (9:00 AM)
```
1. Login to Admin Dashboard
2. Check "Pending Reports" count
3. Review overnight hazard submissions
4. Verify legitimate hazards
5. Reject spam/duplicates
6. Respond to urgent Critical hazards
```

#### Hazard Verification Process:
```
Step 1: Open Pending Hazards tab (12 items)

Step 2: Review first hazard
   - Check location on map
   - View uploaded photos
   - Read description
   - Verify with reporter if needed

Step 3: Make decision
   → Valid? Click "Verify"
   → Duplicate? Click "Reject" → Select reason
   → Need more info? Contact reporter

Step 4: Add admin notes
   → Document verification method
   → Add any additional details

Step 5: Confirm action
   → Hazard status updated
   → Reporter notified

Step 6: Repeat for remaining hazards

Step 7: Check resolved hazards
   → Remove from active list
   → Update statistics
```

### Weekly Tasks:

**Monday:**
- Review user registration trends
- Check for inactive users
- Generate weekly statistics report

**Wednesday:**
- Update FAQ if needed
- Review resolved hazards
- Clean up rejected reports

**Friday:**
- Generate weekly performance report
- Check system health
- Plan content updates

---

## 📊 Key Performance Indicators (KPIs)

### Monitor These Metrics:

#### User Engagement
```
Target: 70% active users per month
Current: 856/1,234 = 69.4%
Status: ⚠️ Needs attention
```

#### Hazard Response Time
```
Target: <24 hours average
Current: 18.5 hours average
Status: ✅ Meeting target
```

#### Verification Accuracy
```
Target: <5% false positives
Current: 3.2%
Status: ✅ Meeting target
```

#### User Satisfaction
```
Target: >80% positive reports
Current: 87%
Status: ✅ Exceeding target
```

---

## 🔧 Admin Tools & Functions

### User Management Tools:

#### Bulk User Actions
```
Functions:
- Export user list (CSV/Excel)
- Send bulk email notifications
- Mass role updates
- Batch deactivation
- User analytics export
```

#### User Search Advanced
```
Search by:
- Email domain (@gmail.com)
- Registration date range
- Last active date
- Number of reports submitted
- Routes calculated count
```

### Hazard Management Tools:

#### Hazard Analytics
```
View:
- Heatmap of hazard locations
- Time-series of reports
- Severity trends
- Type distribution
- Resolution rate over time
```

#### Automated Actions
```
Set rules:
- Auto-verify reports from trusted users
- Auto-flag suspicious reports
- Escalate critical hazards
- Send alerts for specific areas
```

---

## 💡 Best Practices for Admins

### Hazard Verification:
1. ✅ Always check photos when available
2. ✅ Verify location on map
3. ✅ Cross-reference with other reports
4. ✅ Contact reporter for clarity if needed
5. ✅ Document verification method in notes
6. ✅ Prioritize Critical severity hazards
7. ✅ Update status promptly (within 24 hours)

### User Management:
1. ✅ Regularly review inactive accounts
2. ✅ Monitor for spam/fake accounts
3. ✅ Respond to user inquiries quickly
4. ✅ Document role changes with reasons
5. ✅ Preserve user data unless legally required to delete

### System Maintenance:
1. ✅ Review statistics weekly
2. ✅ Update FAQ based on common questions
3. ✅ Keep About page information current
4. ✅ Monitor system performance
5. ✅ Generate regular backup reports

---

## 🚨 Emergency Procedures

### Critical Hazard Response:
```
When Critical severity hazard is reported:

1. Immediate Actions (Within 1 hour):
   ✅ Verify report authenticity
   ✅ Check location accuracy
   ✅ View photographic evidence
   
2. Escalation (If confirmed):
   ✅ Mark as "Verified" immediately
   ✅ Add high-priority flag
   ✅ Notify local authorities (if applicable)
   ✅ Send alert to users in affected area
   
3. Monitoring:
   ✅ Track until resolved
   ✅ Update status regularly
   ✅ Communicate with reporter
```

### System Issues:
```
If users report problems:

1. Check system status dashboard
2. Review error logs
3. Test affected functionality
4. Document issue
5. Contact technical team if needed
6. Notify users of known issues
```

---

## 🎯 Quick Reference - Admin Actions

| Task | Navigation | Time Est. |
|------|------------|-----------|
| **Verify Hazard** | Admin Dashboard → Pending → Select → Verify | 2-5 min |
| **Reject Report** | Admin Dashboard → Pending → Select → Reject | 1-3 min |
| **Promote User** | Users Tab → Select User → Change Role → Admin | 1 min |
| **Add FAQ** | About Tab → FAQs → Add New | 3-5 min |
| **Add Team Member** | About Tab → Team → Add Member | 5-10 min |
| **Generate Report** | Statistics → Generate Report → Download | 2-3 min |
| **Deactivate User** | Users Tab → Select → Toggle Status | 30 sec |

---

## 📞 Admin Support

### Escalation Contacts:
- **Technical Issues**: tech-support@saferoute.com
- **Legal Matters**: legal@saferoute.com
- **Emergency**: +94 11 234 5678

### Resources:
- Admin Manual (this document)
- API Documentation: `/backend/README.md`
- Database Schema: `/backend/models/`
- System Logs: `/backend/logs/`

---

**User Role**: Administrator  
**Access Level**: Full System Access  
**Last Updated**: November 30, 2025  
**Version**: 1.0
