# 🎯 SafeRoute User Guide for Binuri Nimthera

Welcome to SafeRoute, Binuri! This guide will show you exactly how to use the system as a regular user.

---

## 🚀 GETTING STARTED

### Step 1: Register Your Account

1. Open your browser (Chrome or Firefox recommended)
2. Go to: `http://localhost:3000`
3. Click **"Register"** or **"Sign Up"** button

**Enter your details:**
```
Full Name: Binuri Nimthera
Email: binuthera@gmail.com
Password: (Choose a strong password, e.g., Binuri@2025)
Confirm Password: (Same password again)
```

4. Click **"Register"** button
5. ✅ You'll be automatically logged in and taken to the dashboard

---

### Step 2: Login (For Next Time)

When you visit SafeRoute again:

1. Go to: `http://localhost:3000/login`
2. Enter your credentials:
```
Email: binuthera@gmail.com
Password: (Your password)
```
3. Click **"Login"**
4. ✅ You'll see the map dashboard

---

## 🗺️ USING THE MAP DASHBOARD

### Understanding Your Dashboard

When you login, you'll see:
- 📍 **Interactive Map** - Shows your area and hazards
- 🎯 **Your Location** - Blue marker showing where you are
- ⚠️ **Hazard Markers** - Different colored pins showing road hazards
- 🔍 **Search Bar** - Find any location in Sri Lanka
- 📊 **Filter Options** - Show/hide specific hazard types
- ➕ **Report Hazard Button** - Report new road problems

---

### Step 3: Allow Location Access

**Important:** When the browser asks "Allow location access?"

✅ **Click "Allow"**

**What happens:**
- Map centers on your current location
- You see nearby hazards around you
- You can report hazards at your exact location

**If you clicked "Block" by mistake:**
1. Click the 🔒 lock icon in address bar
2. Change location permission to "Allow"
3. Refresh the page (F5)

---

## 🚨 REPORTING HAZARDS (Main Feature!)

### Step 4: Report Your First Hazard

**Example: You see a large pothole on your street**

1. **Click** the **"Report Hazard"** button on the map

2. **Fill in the form:**

```
Type: Select "Pothole" from dropdown

Description: (Be specific! Example:)
Large pothole on Galle Road near traffic lights. 
About 40cm wide and 20cm deep. 
Causing vehicles to swerve.

Severity: Select "High" (if it's dangerous)
         or "Medium" (if it's noticeable)
         or "Low" (if it's minor)

Location: Click "Use My Current Location" button
         OR
         Enter address manually if you're reporting from home
```

3. **Upload Photo (Optional but recommended):**
   - Click "Choose File"
   - Select a photo of the pothole from your phone/computer
   - Photos help moderators verify your report faster!

4. **Click "Submit"** or **"Report Hazard"**

**What happens next:**
- ✅ Success message appears: "Hazard reported successfully!"
- 📍 Orange/yellow marker appears on map (Pending status)
- ⏳ Moderators will verify your report within 24 hours
- ✅ Once verified, marker turns green and all users can see it

---

### Different Types of Hazards You Can Report:

**🕳️ Pothole**
```
Example: "Deep pothole on Main Street near junction. 
Damaging vehicle tires."
```

**🚗 Accident**
```
Example: "Two-car collision blocking left lane. 
Police on scene. Expect delays."
```

**🚦 Traffic Jam**
```
Example: "Heavy traffic on Kandy Road due to construction. 
30-minute delay."
```

**🏗️ Construction**
```
Example: "Road widening project. One lane closed. 
Follow detour signs."
```

**🌊 Flooding**
```
Example: "Street flooding after heavy rain. 
Water 6 inches deep. Drive slowly."
```

**🚧 Road Closure**
```
Example: "Road completely closed for repairs. 
Use Galle Road as alternative."
```

**🚦 Traffic Light Malfunction**
```
Example: "Traffic light stuck on red at junction. 
Police directing traffic."
```

---

## 🔍 VIEWING HAZARDS ON MAP

### Step 5: Click on Any Hazard Marker

When you click a marker, you'll see:

```
🕳️ Pothole
━━━━━━━━━━━━━━━━━━━━━━
Description: Large pothole on Main Street...
📍 Location: Main Street, Colombo 01
⚠️ Severity: High
📊 Status: Verified ✓
👤 Reported by: Kamal P.
🕒 Reported: 2 hours ago
━━━━━━━━━━━━━━━━━━━━━━
[View Photo] [Get Directions]
```

**Understanding Status:**
- ⏳ **Pending** - Waiting for moderator verification (Orange marker)
- ✅ **Verified** - Confirmed by moderators (Green/Red marker)
- ❌ **Rejected** - Not a valid hazard (Won't appear on map)

---

## 🎯 FILTERING HAZARDS

### Step 6: Show Only Hazards You Care About

**Find the Filter button on map, then:**

**Example 1: Show only potholes**
```
✓ Pothole
☐ Accident
☐ Traffic Jam
☐ Construction
☐ Flooding
☐ Road Closure
```
Click "Apply" → Now map shows only potholes

**Example 2: Show high severity hazards only**
```
Severity: High only
Time: Last 24 hours
```
Click "Apply" → Shows recent dangerous hazards

**Example 3: Clear all filters**
```
Click "Clear Filters" or "Show All"
```

---

## 🔎 SEARCHING LOCATIONS

### Step 7: Find Any Place in Sri Lanka

**In the search bar at top of map:**

**Example searches:**
```
Colombo Fort
```
→ Map jumps to Colombo Fort Railway Station

```
Galle Face Green
```
→ Map centers on Galle Face

```
Mount Lavinia Beach
```
→ Map shows Mount Lavinia area

```
Kandy City Center
```
→ Map shows Kandy

**Tips:**
- Type slowly - suggestions appear as you type
- Click on the suggestion you want
- Map automatically zooms to that location
- You'll see all hazards near that location

---

## 🛣️ PLANNING SAFE ROUTES

### Step 8: Plan Your Journey

**Click "Safe Route" in the menu**

**Example: Going from home to work**

1. **Starting Point (From):**
```
Type: Colombo Fort
```
(Or click "Use My Current Location")

2. **Destination (To):**
```
Type: Mount Lavinia Beach
```

3. **Route Type:**
```
Select: Safest Route
```
(Avoids most hazards, might be longer)

OR
```
Select: Fastest Route
```
(Quickest time, but might have hazards)

4. **Click "Find Route"**

**What you'll see:**

```
🛣️ Safe Route Found
━━━━━━━━━━━━━━━━━━━━━━
From: Colombo Fort
To: Mount Lavinia Beach

📏 Distance: 12.5 km
⏱️ Time: 25 minutes
⚠️ Hazards on Route: 2

🚨 Hazards:
• Pothole at 3.2 km (Medium severity)
• Traffic Jam at 8.7 km (Low severity)

Alternative Routes:
• Fastest: 11.2 km, 18 mins (4 hazards)
• Shortest: 10.8 km, 22 mins (3 hazards)

[Save Route] [Start Navigation]
```

**The blue line on map shows your route**

---

### Step 9: Save Your Favorite Routes

**After planning a route:**

1. Click **"Save Route"** button
2. Enter a name:
```
Route Name: Daily Commute to Office
```
3. Click **"Save"**

**Benefits:**
- ✅ Quick access to frequent routes
- ✅ Get alerts when new hazards appear on your route
- ✅ See all saved routes in your Profile

---

## 👤 YOUR PROFILE

### Step 10: Manage Your Account

**Click your name "Binuri Nimthera" at top right**

**You'll see:**
- 📧 Your email: binuthera@gmail.com
- 👤 Your role: User
- 📅 Member since: (Today's date)
- 📊 Statistics:
  - Total reports: 5
  - Verified reports: 3
  - Saved routes: 2

---

### Step 11: Edit Your Profile

**Click "Edit Profile" button**

**You can update:**
```
Full Name: Binuri Nimthera
Phone: +94 77 XXX XXXX
Bio: Regular commuter on Galle Road
```

**Upload Profile Picture:**
1. Click "Choose File"
2. Select your photo
3. Click "Save Changes"
✅ Your photo appears next to your name

---

### Step 12: View Your Reports

**Scroll down on Profile page**

**"My Hazard Reports" section shows:**

```
📊 Report #1
Type: Pothole
Location: Galle Road, Colombo 03
Status: ✅ Verified
Reported: Dec 7, 2025
[View] [Delete]

📊 Report #2
Type: Traffic Jam
Location: Kandy Road
Status: ⏳ Pending Verification
Reported: Dec 7, 2025
[View] [Delete]
```

**You can:**
- 👁️ **View** - See full details
- 🗑️ **Delete** - Remove your own reports

---

### Step 13: View Saved Routes

**In Profile → Saved Routes section:**

```
🛣️ Daily Commute to Office
From: Colombo Fort → To: Mount Lavinia
Distance: 12.5 km | Time: 25 mins
Saved: Dec 7, 2025
[View Route] [Delete]

🛣️ Weekend Beach Trip
From: Home → To: Mount Lavinia Beach
Distance: 8.3 km | Time: 15 mins
Saved: Dec 6, 2025
[View Route] [Delete]
```

**Click "View Route"** → Map shows the route again

---

## 📱 DAILY USAGE SCENARIOS

### Scenario 1: Going to Work (Morning)

**As Binuri, you're heading to work:**

1. **Open SafeRoute** on your phone/computer
2. **Login:** binuthera@gmail.com
3. **Click "Safe Route"**
4. **From:** Use Current Location (your home)
5. **To:** Your office address
6. **Click "Find Route"**
7. ✅ **Check hazards** on the route
8. **Choose safest route** and start driving
9. 🎯 If route has flooding/closure, pick alternative route

**You arrive safely, avoiding the pothole and flooding!**

---

### Scenario 2: You See a Hazard While Driving

**You see a large pothole on your route:**

**Option A: Report Immediately (if passenger)**
1. Open SafeRoute
2. Click "Report Hazard"
3. Select "Pothole"
4. Describe: "Large pothole near bus stop"
5. Click "Use Current Location"
6. Take photo
7. Submit

**Option B: Report Later (if driving alone)**
1. Remember the location
2. When you stop safely, open SafeRoute
3. Report the hazard
4. Enter location manually or click on map

---

### Scenario 3: Planning Weekend Trip

**You want to go to Galle on Saturday:**

1. **Login to SafeRoute**
2. **Click "Safe Route"**
3. **From:** Colombo (your location)
4. **To:** Galle Fort
5. **Check the route:**
   - Distance: 120 km
   - Hazards: 5 reported
   - Flooding on Galle Road km 85
   - Construction near Kalutara
6. **Save route** as "Weekend Galle Trip"
7. **Check route again Saturday morning** for new hazards
8. ✅ **Drive safely** avoiding known hazards

---

## 🎯 TIPS FOR BEST EXPERIENCE

### ✅ DO's:

1. **Always allow location access** - Get accurate hazard info
2. **Report hazards immediately** - Help other drivers
3. **Be specific in descriptions** - "Large pothole" better than "hole"
4. **Upload photos** - Faster verification
5. **Check route before long trips** - Plan around hazards
6. **Update app daily** - New hazards reported constantly
7. **Save frequent routes** - Quick access
8. **Verify old hazards** - Report if pothole is fixed

### ❌ DON'Ts:

1. **Don't use phone while driving** - Pull over safely first
2. **Don't report fake hazards** - Your account may be suspended
3. **Don't share password** - Keep account secure
4. **Don't ignore high severity warnings** - Could be dangerous
5. **Don't report same hazard twice** - Check if already reported

---

## 🆘 TROUBLESHOOTING

### Problem: "Can't see my location on map"

**Solution:**
1. Check location permission is "Allow"
2. Make sure GPS is on (mobile)
3. Refresh page (F5)
4. Try different browser

---

### Problem: "My report is not appearing on map"

**Reason:** Reports need moderator verification first

**Status:**
- ⏳ **Pending** (Orange) - Waiting for approval (You can see it, others can't)
- ✅ **Verified** (Green/Red) - Approved (Everyone can see it)

**Wait 24 hours** - Moderators review reports daily

---

### Problem: "Login failed - Invalid password"

**Solution:**
1. Check email: binuthera@gmail.com (correct?)
2. Check password (case-sensitive)
3. Click "Forgot Password" if you forgot
4. Contact admin if still can't login

---

### Problem: "Photo upload failed"

**Solution:**
1. **Check file size** - Max 5MB
2. **Check file type** - Only JPG, PNG allowed
3. **Reduce photo size** - Use smaller resolution
4. **Try again** - Network might be slow

---

### Problem: "Map not loading"

**Solution:**
1. Check internet connection
2. Refresh page (F5)
3. Clear browser cache
4. Try different browser (Chrome/Firefox)
5. Check if backend server is running

---

## 📞 GETTING HELP

### If you have questions:

1. **Check this guide** - Most answers are here
2. **Contact moderators** - Use "Help" button in app
3. **Report bugs** - Click "Report Issue" in Profile
4. **Contact admin** - For account issues

---

## 🎉 YOUR FIRST DAY CHECKLIST

**As Binuri, complete these tasks:**

- [ ] ✅ Register account (binuthera@gmail.com)
- [ ] ✅ Login successfully
- [ ] ✅ Allow location access
- [ ] ✅ Explore map around your area
- [ ] ✅ Click on 2-3 hazard markers to see details
- [ ] ✅ Report your first hazard (even a small pothole)
- [ ] ✅ Search for "Galle Face Green"
- [ ] ✅ Plan a route (home to work)
- [ ] ✅ Save your daily commute route
- [ ] ✅ Upload profile picture
- [ ] ✅ Add phone number to profile

**After completing these, you're a SafeRoute expert! 🎯**

---

## 🌟 BECOME A POWER USER

### Level 1: Basic User (You start here)
- Report hazards
- View map
- Plan routes

### Level 2: Active Contributor (After 10 verified reports)
- Trusted reporter badge
- Faster verification
- More visibility

### Level 3: Community Helper (After 50 verified reports)
- May be promoted to Moderator
- Help verify others' reports
- Improve road safety for everyone!

---

## 📊 YOUR IMPACT

**Every time you report a hazard:**
- 🚗 Helps 100+ drivers avoid damage
- 💰 Saves vehicle repair costs
- ⏰ Reduces traffic delays
- 🏥 Prevents accidents
- 🌍 Makes Sri Lankan roads safer

**Thank you for using SafeRoute, Binuri! 🙏**

---

## 🚀 QUICK START SUMMARY

**Today's Tasks:**

1. **Register:** binuthera@gmail.com / (your password)
2. **Allow location** when prompted
3. **Report 1 hazard** you see on your route
4. **Plan your work route** and save it
5. **Check hazards** before driving tomorrow

**That's it! You're ready to make roads safer! 🎉**

---

## 📱 MOBILE vs DESKTOP

### Using on Mobile Phone:
- ✅ Best for reporting hazards on-the-go
- ✅ GPS location more accurate
- ✅ Easy to take photos
- ⚠️ Pull over safely before using!

### Using on Desktop/Laptop:
- ✅ Better for planning long routes
- ✅ Larger map view
- ✅ Easier to see multiple hazards
- ✅ Upload photos from computer

**Recommendation:** Use both! Plan on desktop, report on mobile.

---

**Welcome to SafeRoute, Binuri Nimthera! Drive safe! 🚗✨**

**For any questions, you now know exactly how to use every feature!**
