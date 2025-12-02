# SafeRoute Testing Roadmap - Moderator Perspective

## Prerequisites
- You need a moderator account
- Admin must assign moderator role to your account
- Or modify database directly to set role='moderator'

---

## 1. Create Moderator Account

### Get Moderator Role (Admin assigns)
1. Admin logs in to admin dashboard
2. Admin goes to Users section
3. Admin finds your account
4. Admin changes role from "user" to "moderator"
5. **Expected**: You now have moderator permissions

### Or Manually Update Database
1. Open MongoDB Atlas or local database
2. Find your user document
3. Update field: `role: "moderator"`
4. **Expected**: Account upgraded to moderator

---

## 2. Moderator Login

### Login as Moderator
1. Go to `http://localhost:3000/login`
2. Enter moderator credentials
3. Click "Login"
4. **Expected**: 
   - Access to dashboard
   - Access to moderation features
   - NO access to full admin panel

---

## 3. Moderator Dashboard Access

### Check Permissions
1. After login, try to access:
   - ✅ `/dashboard` - Should work
   - ✅ Hazard verification - Should work
   - ❌ `/admin` - Should be blocked (admin-only)
   - ❌ User management - Should be blocked
2. **Expected**: Limited access compared to admin

---

## 4. Hazard Verification (Primary Task)

### View Pending Hazards
1. Navigate to hazard management section
2. Filter by "Pending" status
3. **Expected**: List of unverified hazard reports

### Review Hazard Report
1. Click on pending hazard
2. Review details:
   - **Type**: Accident, Pothole, Traffic Jam, etc.
   - **Description**: Reporter's description
   - **Location**: GPS coordinates and address
   - **Photo**: Uploaded image (if any)
   - **Reporter**: Who reported it
   - **Severity**: Low/Medium/High
   - **Timestamp**: When reported
3. **Expected**: All information displays clearly

### Verify Legitimate Hazard
1. Select hazard that appears legitimate
2. Click "Verify" or "Approve" button
3. **Expected**:
   - Status changes to "Verified"
   - Hazard becomes visible to all users
   - Appears on public map
   - Reporter may receive notification

### Reject Invalid Hazard
1. Find suspicious or invalid report:
   - Duplicate report
   - Spam/fake report
   - Incorrect information
   - Test report
2. Click "Reject" or "Delete"
3. Add rejection reason (optional):
   - "Duplicate report"
   - "Insufficient information"
   - "Spam/Invalid"
4. **Expected**:
   - Hazard removed from pending queue
   - Does not appear on public map
   - Reporter may be notified

### Update Hazard Severity
1. Review hazard severity rating
2. If reporter marked incorrectly:
   - Change from "Low" to "High" (or vice versa)
3. **Expected**: Severity updated appropriately

---

## 5. Map Dashboard Features

### View All Hazards on Map
1. Go to main dashboard map
2. **Expected**: See all verified hazards
3. Pending hazards may be shown with different color/icon

### Click Hazard Marker
1. Click any hazard on map
2. **Expected**: Info popup shows:
   - Hazard type and icon
   - Description
   - Status
   - Your moderator options (verify/reject)

---

## 6. Moderator Workflow

### Daily Moderation Routine
1. **Morning Check**:
   - Login to dashboard
   - Check number of pending reports
   - Review overnight submissions

2. **Review Process**:
   - Sort by oldest first (or newest)
   - Review each hazard carefully
   - Verify legitimate reports
   - Reject spam/duplicates

3. **Quality Control**:
   - Ensure hazard types are correct
   - Verify location accuracy
   - Check severity levels
   - Review uploaded photos

4. **Batch Processing**:
   - Verify multiple legitimate hazards
   - Reject multiple spam reports
   - Update statuses efficiently

---

## 7. Search & Filter

### Filter Hazards
1. Filter by status:
   - Pending (need review)
   - Verified (approved)
   - Resolved (no longer active)
2. Filter by type:
   - Accident
   - Pothole
   - Traffic Jam
   - Road Closure, etc.
3. Filter by date range
4. **Expected**: Results update accordingly

### Search Specific Hazard
1. Use search bar
2. Search by:
   - Location name
   - Reporter name
   - Hazard ID
3. **Expected**: Matching results shown

---

## 8. Report Hazards (As Regular User Too)

### Report New Hazard
1. Click "Report Hazard" button
2. Fill in form:
   - Type: Select hazard type
   - Description: Detailed description
   - Severity: Low/Medium/High
   - Location: Current or manual
   - Photo: Upload (optional)
3. Submit report
4. **Expected**: 
   - Report created
   - Goes to pending queue
   - Another moderator can verify it

---

## 9. Update Hazard Status

### Mark Hazard as Resolved
1. Find verified hazard that's no longer present
2. Change status to "Resolved"
3. Add resolution note (optional)
4. **Expected**: 
   - Hazard marked resolved
   - May be removed from active map view
   - Kept in historical records

### Reactivate Resolved Hazard
1. If hazard returns (e.g., pothole reopens)
2. Change status back to "Active" or "Verified"
3. **Expected**: Hazard reappears on map

---

## 10. Communication (if implemented)

### Leave Comments on Reports
1. Click on hazard report
2. Add moderator comment:
   - "Verified - High priority"
   - "Location confirmed"
   - "Photo shows clear evidence"
3. Save comment
4. **Expected**: Comment visible to admins and other moderators

---

## 11. Statistics & Activity

### View Your Moderation Stats
1. Go to profile or moderator dashboard
2. Check:
   - Total hazards verified
   - Total hazards rejected
   - Accuracy rate (if tracked)
   - Activity this week/month
3. **Expected**: Your moderation activity displayed

---

## 12. Limitations Testing

### Test Moderator Restrictions
1. Try to access admin-only features:
   - ❌ User management
   - ❌ System settings
   - ❌ Admin dashboard
   - ❌ Delete users
2. **Expected**: Access denied messages

### Verify Allowed Actions
1. Confirm you CAN:
   - ✅ View all hazards
   - ✅ Verify hazards
   - ✅ Reject hazards
   - ✅ Update hazard status
   - ✅ Edit hazard details
   - ✅ View map dashboard
2. **Expected**: All these work correctly

---

## 13. Quality Assurance Checks

### Verify Data Accuracy
1. Check hazard location matches description
2. Verify severity matches situation
3. Ensure no duplicate reports
4. Confirm photo authenticity (if uploaded)

### Spot Patterns
1. Watch for:
   - Same user reporting many hazards (legitimate or spam?)
   - Multiple reports in same location
   - Unusual activity patterns
2. Report suspicious activity to admin

---

## 14. Edge Cases

### Handle Duplicate Reports
1. Find multiple reports of same hazard
2. Verify the first/best one
3. Reject duplicates with note "Duplicate of #ID"
4. **Expected**: Only one hazard shown on map

### Unclear Reports
1. Report lacks sufficient information
2. Options:
   - Reject with reason "Need more info"
   - Flag for admin review
   - Contact reporter (if feature exists)

### Conflicting Information
1. Report contradicts other data
2. Review carefully
3. Make best judgment or escalate to admin

---

## Moderator Workflow Summary

✅ Login → ✅ Check Pending Queue → ✅ Review Reports → ✅ Verify Legitimate → ✅ Reject Invalid → ✅ Update Status → ✅ Monitor Quality → ✅ Log Stats

---

## Moderator Best Practices

- [ ] Review all pending reports within 24 hours
- [ ] Be fair and consistent in verification
- [ ] Check for duplicate reports before approving
- [ ] Verify location accuracy when possible
- [ ] Assess severity levels appropriately
- [ ] Reject spam and fake reports promptly
- [ ] Add helpful notes for other moderators
- [ ] Report issues to admin when needed
- [ ] Maintain high accuracy rate
- [ ] Stay updated on moderation guidelines

---

## Key Differences: Moderator vs Admin vs User

### User (Regular)
- Can report hazards
- Can view verified hazards
- Can plan routes
- Can save locations/routes
- NO verification powers

### Moderator (You)
- Everything a user can do, PLUS:
- Can verify/reject hazard reports
- Can update hazard status
- Can edit hazard details
- CANNOT manage users
- CANNOT access admin dashboard
- CANNOT change system settings

### Admin
- Everything moderator can do, PLUS:
- Can manage all users
- Can assign/remove moderator roles
- Can access admin dashboard
- Can view all statistics
- Can configure system settings
- Can delete users
- Full system control

---

## Notes
- Moderators are trusted community members
- Maintain objectivity in verification
- Quality over quantity
- Report any technical issues to admin
- Keep user data confidential
