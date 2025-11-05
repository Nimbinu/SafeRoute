# Admin Dashboard - Quick Reference

## 🚀 Quick Start

### Access Admin Dashboard
```
URL: http://localhost:3000/admin
Requirements: 
  - Must be logged in
  - Role must be 'admin' or 'moderator'
  - Valid JWT token in localStorage
```

---

## 🎯 Button Functions

### ✓ Verify Button
**Purpose:** Approve a pending hazard report

**When Shown:** Only for hazards with status "Pending"

**API Call:**
```
PATCH /api/admin/hazards/:id/verify
Authorization: Bearer <token>
```

**What Happens:**
1. Status changes: Pending → Verified
2. Sets `verifiedBy` to your user ID
3. Sets `verifiedAt` to current time
4. Updates UI immediately
5. Refreshes statistics
6. Shows success alert

**Frontend Code:**
```javascript
onClick={() => handleVerify(report._id)}
```

---

### ✓ Resolve Button
**Purpose:** Mark hazard as fixed/resolved

**When Shown:** For hazards with status "Pending" or "Verified"

**API Call:**
```
PATCH /api/admin/hazards/:id/resolve
Authorization: Bearer <token>
```

**What Happens:**
1. Status changes to "Resolved"
2. Sets `resolvedAt` to current time
3. Updates UI immediately
4. Refreshes statistics
5. Shows success alert

**Frontend Code:**
```javascript
onClick={() => handleResolve(report._id)}
```

---

### 🗑️ Delete Button
**Purpose:** Remove invalid/spam hazard reports

**When Shown:** Always (for all hazards)

**API Call:**
```
DELETE /api/admin/hazards/:id
Authorization: Bearer <token>
```

**What Happens:**
1. Shows confirmation dialog
2. If confirmed, soft deletes (sets `isActive: false`)
3. Removes from UI list
4. Refreshes statistics
5. Shows success alert

**Frontend Code:**
```javascript
onClick={() => handleDelete(report._id)}
```

---

## 📊 Statistics

### Displayed Stats:
- **Total Reports** - All active hazards
- **Verified Reports** - Approved hazards (with percentage)
- **Resolved Reports** - Fixed hazards (with percentage)
- **Pending Reports** - Awaiting review

### Auto-Refresh:
Stats automatically update after:
- ✅ Verifying a hazard
- ✅ Resolving a hazard
- ✅ Deleting a hazard

---

## 🔍 Filters

### Status Filter (Dropdown)
```
Options:
- All       → Shows all hazards
- Pending   → Shows only pending
- Verified  → Shows only verified
- Resolved  → Shows only resolved
```

**API Impact:** Sends `?status=<value>` query parameter

**Usage:**
```javascript
<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="All">All</option>
  <option value="Pending">Pending</option>
  <option value="Verified">Verified</option>
  <option value="Resolved">Resolved</option>
</select>
```

---

### Location Filter (Text Input)
```
Purpose: Search by location address
Type: Client-side filter (no API call)
Updates: Instantly as you type
```

**Usage:**
```javascript
<input 
  placeholder="Filter by location..." 
  value={locationFilter}
  onChange={(e) => setLocationFilter(e.target.value)}
/>
```

---

## 📄 Pagination

### Controls:
- **← Previous** - Go to previous page
- **Page X of Y** - Current page indicator
- **Next →** - Go to next page

### Settings:
- **Items per page:** 20
- **Auto-reset:** Page resets to 1 when filter changes

**API Call:**
```
GET /api/admin/hazards?page=1&limit=20&status=Pending
```

**Frontend State:**
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({
  total: 150,
  page: 1,
  pages: 8,
  limit: 20
});
```

---

## 🎨 UI Elements

### Status Badges
```css
Pending   → 🟡 Yellow (#fef3c7)
Verified  → 🟢 Green (#d1fae5)
Resolved  → ⚪ Gray (#f3f4f6)
```

### Severity Icons
```
🔴 Critical
🟠 High
🟡 Medium
🟢 Low
⚪ Unknown
```

### Action Buttons
```css
Verify   → Blue (#3b82f6)
Resolve  → Green (#10b981)
Delete   → Red (#ef4444)
```

---

## 🔄 Complete Action Flow

### Example: Verifying a Hazard

```
1. USER ACTION
   Click "✓ Verify" button on pending hazard
   ↓
2. FRONTEND
   handleVerify(reportId) called
   ↓
3. API REQUEST
   PATCH /api/admin/hazards/67890abc/verify
   Headers: { Authorization: Bearer <token> }
   ↓
4. BACKEND
   Find hazard by ID
   Update: status = "Verified"
           verifiedBy = adminId
           verifiedAt = Date.now()
   Save to MongoDB
   ↓
5. RESPONSE
   {
     "success": true,
     "message": "Hazard verified successfully",
     "data": { "hazard": {...} }
   }
   ↓
6. FRONTEND UPDATE
   Update reports state (replace old with new hazard)
   Fetch fresh statistics
   Show alert: "Hazard verified successfully!"
   ↓
7. UI REFRESH
   Status badge changes: Pending → Verified
   Verify button disappears
   Stats update: Pending -1, Verified +1
   User sees updated table
```

---

## 🔐 Access Control

### Role Requirements
```javascript
Allowed Roles:
- admin      → Full access ✅
- moderator  → Full access ✅
- user       → Access denied ❌
```

### Access Check Code:
```javascript
if (user.role !== 'admin' && user.role !== 'moderator') {
  alert('Access denied. Admin privileges required.');
  navigate('/dashboard');
}
```

---

## 🧪 Quick Test Checklist

### ✅ Basic Functionality
- [ ] Page loads without errors
- [ ] Statistics display real numbers
- [ ] Hazards table shows data
- [ ] Profile shows your name/email
- [ ] Role badge shows "🔑 Admin" or "👮 Moderator"

### ✅ Filters
- [ ] Status filter changes table content
- [ ] Location filter searches correctly
- [ ] Clear filters shows all results

### ✅ Pagination
- [ ] Next/Previous buttons work
- [ ] Page number displays correctly
- [ ] Disabled states work (first/last page)

### ✅ Verify Button
- [ ] Only shows for Pending hazards
- [ ] Changes status to Verified
- [ ] Updates stats immediately
- [ ] Shows success alert

### ✅ Resolve Button
- [ ] Shows for Pending/Verified hazards
- [ ] Changes status to Resolved
- [ ] Updates stats immediately
- [ ] Shows success alert

### ✅ Delete Button
- [ ] Shows confirmation dialog
- [ ] Removes hazard from list
- [ ] Updates stats immediately
- [ ] Shows success alert

---

## 🐛 Troubleshooting

### Issue: Can't access /admin
**Solutions:**
- Check if logged in (token exists)
- Verify user role is admin/moderator
- Check browser console for errors
- Try logging out and back in

### Issue: Buttons not working
**Solutions:**
- Check browser Network tab for failed requests
- Verify backend is running on port 5004
- Check JWT token is valid
- Look for error alerts

### Issue: Statistics not updating
**Solutions:**
- Check API call to /api/admin/stats succeeds
- Verify MongoDB connection
- Check backend logs for errors
- Refresh the page

### Issue: No hazards showing
**Solutions:**
- Check if any hazards exist in database
- Verify status filter (try "All")
- Clear location filter
- Check backend logs

---

## 📡 API Quick Reference

```javascript
// Get statistics
GET /api/admin/stats

// Get hazards (with filters)
GET /api/admin/hazards?status=Pending&page=1&limit=20

// Verify hazard
PATCH /api/admin/hazards/:id/verify

// Resolve hazard
PATCH /api/admin/hazards/:id/resolve

// Delete hazard
DELETE /api/admin/hazards/:id

// All require:
Headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

---

## 💡 Pro Tips

1. **Use Filters Efficiently**
   - Start with status filter to narrow results
   - Then use location search for specific areas
   - Clear filters to see all results

2. **Verify Before Resolving**
   - Verify hazards first to confirm validity
   - Then resolve when actually fixed
   - Delete if spam/invalid

3. **Monitor Statistics**
   - Watch pending count to see workload
   - High pending = needs attention
   - High resolved = good progress

4. **Bulk Actions**
   - Filter by "Pending"
   - Verify multiple quickly
   - Use location filter to group nearby hazards

5. **Check Details**
   - Note reported by user
   - Check severity level
   - Review location carefully
   - Look at report date

---

## 🎯 Common Workflows

### Morning Review Workflow:
```
1. Check Total Reports (see overall activity)
2. Filter by "Pending" status
3. Review each pending hazard
4. Verify legitimate reports
5. Delete spam/invalid reports
6. Check statistics to track progress
```

### Hazard Resolution Workflow:
```
1. Filter by "Verified" status
2. Check which hazards are being fixed
3. Mark as "Resolved" when fixed
4. Monitor "Resolved" count growth
```

### Location-Based Review:
```
1. Type area name in location filter
2. See all hazards in that area
3. Verify/resolve area-specific hazards
4. Track patterns in specific locations
```

---

## 🚀 Success Indicators

You know everything is working when:
- ✅ Stats show real numbers from database
- ✅ Clicking Verify changes badge to green
- ✅ Clicking Resolve changes badge to gray
- ✅ Clicking Delete removes hazard
- ✅ Stats update after each action
- ✅ Filters change what you see
- ✅ Pagination navigates pages
- ✅ No console errors
- ✅ All alerts appear correctly

---

**Your admin dashboard is fully functional! Start managing hazards!** 🎉
