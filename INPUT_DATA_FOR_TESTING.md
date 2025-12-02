# 📋 SAFEROUTE - ALL INPUT DATA FOR TESTING

Copy and paste these exact values when testing!

---

## 1️⃣ REGISTRATION PAGE - Valid Data

### First User:
```
Full Name: John Smith
Email: john.smith@gmail.com
Password: Test123456
Confirm Password: Test123456
```

### Second User:
```
Full Name: Sarah Johnson
Email: sarah.johnson@gmail.com
Password: Test123456
Confirm Password: Test123456
```

### Third User:
```
Full Name: David Lee
Email: david.lee@gmail.com
Password: Test123456
Confirm Password: Test123456
```

---

## 2️⃣ LOGIN PAGE - Valid Credentials

### Regular User:
```
Email: john.smith@gmail.com
Password: Test123456
```

### Moderator (after creating):
```
Email: moderator@saferoute.com
Password: Moderator123
```

### Admin (after creating):
```
Email: admin@saferoute.com
Password: Admin123456
```

---

## 3️⃣ REPORT HAZARD #1 - Pothole

```
Type: Pothole
Description: Large pothole on Main Street near the intersection causing vehicle damage. Approximately 30cm deep and 50cm wide.
Severity: High
Latitude: 6.9271
Longitude: 79.8612
Address: Main Street, Colombo 01
```

---

## 4️⃣ REPORT HAZARD #2 - Accident

```
Type: Accident
Description: Two-vehicle collision blocking the left lane. Traffic moving slowly. Emergency services on site.
Severity: High
Latitude: 6.9312
Longitude: 79.8508
Address: Galle Road, Colombo 03
```

---

## 5️⃣ REPORT HAZARD #3 - Traffic Jam

```
Type: Traffic Jam
Description: Heavy traffic on Highway 1 due to ongoing road construction. Expect delays of 15-20 minutes.
Severity: Medium
Latitude: 6.9497
Longitude: 79.8500
Address: Kandy Road, Colombo 10
```

---

## 6️⃣ REPORT HAZARD #4 - Construction

```
Type: Construction
Description: Road widening project in progress. One lane closed. Follow detour signs.
Severity: Medium
Latitude: 6.9200
Longitude: 79.8550
Address: Baseline Road, Colombo 09
```

---

## 7️⃣ REPORT HAZARD #5 - Flooding

```
Type: Flooding
Description: Street flooding due to heavy rain. Water level approximately 6 inches. Drive with caution.
Severity: High
Latitude: 6.9400
Longitude: 79.8600
Address: Duplication Road, Colombo 04
```

---

## 8️⃣ REPORT HAZARD #6 - Road Closure

```
Type: Road Closure
Description: Road completely closed for maintenance. Use alternative route via Galle Road.
Severity: High
Latitude: 6.9150
Longitude: 79.8480
Address: Marine Drive, Colombo 03
```

---

## 9️⃣ SEARCH LOCATIONS (For Search Bar)

Copy and paste these one by one in the search bar:

```
Colombo Fort
```

```
Galle Face Green
```

```
Mount Lavinia Beach
```

```
National Museum Colombo
```

```
Independence Square
```

```
Bambalapitiya
```

```
Dehiwala Zoo
```

---

## 🔟 ROUTE PLANNING

### Route 1:
```
From: Colombo Fort
To: Mount Lavinia
Route Name: Daily Commute to Office
```

### Route 2:
```
From: Galle Face Green
To: National Museum Colombo
Route Name: Weekend Museum Visit
```

### Route 3:
```
From: Independence Square
To: Bambalapitiya
Route Name: Shopping Route
```

---

## 1️⃣1️⃣ PROFILE UPDATE

```
Full Name: John Smith Updated
Phone: +94 77 123 4567
Bio: Regular SafeRoute user committed to road safety
```

---

## 1️⃣2️⃣ ERROR TESTING - Wrong Login

### Wrong Password:
```
Email: john.smith@gmail.com
Password: WrongPassword999
```

### Non-existent Email:
```
Email: nobody@gmail.com
Password: Test123456
```

### Invalid Email Format:
```
Email: notanemail
Password: Test123456
```

---

## 1️⃣3️⃣ ERROR TESTING - Registration

### Password Mismatch:
```
Full Name: Test User
Email: test.user@gmail.com
Password: Password123
Confirm Password: Password456
```

### Duplicate Email:
```
Full Name: Another Person
Email: john.smith@gmail.com
Password: Test123456
Confirm Password: Test123456
```

### Weak Password:
```
Full Name: Weak User
Email: weak@gmail.com
Password: 123
Confirm Password: 123
```

---

## 1️⃣4️⃣ ADMIN ACTIONS - Reasons

### Suspend User:
```
Reason: Spam activities detected
```

### Delete User:
```
Reason: Multiple policy violations
```

### Reject Hazard:
```
Reason: Insufficient information provided
```

---

## 1️⃣5️⃣ MODERATOR ACTIONS

### Verify Hazard Note:
```
Verification Note: Hazard verified with photo evidence
```

### Reject Hazard Note:
```
Rejection Note: Unable to verify location coordinates
```

---

## 1️⃣6️⃣ SECURITY TESTING - XSS Attempts

### XSS in Description:
```
<script>alert('XSS Attack')</script>
```

### XSS in Name:
```
<img src=x onerror=alert('XSS')>
```

---

## 1️⃣7️⃣ SPECIAL CHARACTERS TEST

```
Description: Testing special characters @#$%^&*()_+-={}[]|:;"'<>,.?/~`
```

```
Full Name: José María García-López
```

```
Address: O'Malley's Street, D'Souza Lane
```

---

## 1️⃣8️⃣ GPS COORDINATES (For Manual Location Entry)

```
Colombo Fort: 6.9344, 79.8428
```

```
Galle Face: 6.9271, 79.8456
```

```
Mount Lavinia: 6.8373, 79.8636
```

```
Bambalapitiya: 6.8935, 79.8553
```

```
Wellawatta: 6.8774, 79.8585
```

```
Dehiwala: 6.8520, 79.8630
```

---

## 1️⃣9️⃣ PHONE NUMBERS

```
+94 77 123 4567
```

```
+94 77 234 5678
```

```
+94 77 345 6789
```

```
+94 77 456 7890
```

---

## 2️⃣0️⃣ CREATE MODERATOR - PowerShell Script

Open PowerShell in backend folder and run:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(() => {
  User.create({
    fullName: 'Mike Moderator',
    email: 'moderator@saferoute.com',
    password: 'Moderator123',
    role: 'moderator'
  }).then(mod => {
    console.log('✅ Moderator created:', mod.email);
    process.exit(0);
  });
});
```

---

## 2️⃣1️⃣ CREATE ADMIN - PowerShell Script

Open PowerShell in backend folder and run:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(() => {
  User.create({
    fullName: 'Admin Boss',
    email: 'admin@saferoute.com',
    password: 'Admin123456',
    role: 'admin'
  }).then(admin => {
    console.log('✅ Admin created:', admin.email);
    process.exit(0);
  });
});
```

---

## 2️⃣2️⃣ LONG TEXT TEST (500+ characters)

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
```

---

## ✅ QUICK COPY - MOST USED

**Login (User):**
```
john.smith@gmail.com
Test123456
```

**Quick Hazard:**
```
Type: Pothole
Description: Large pothole causing vehicle damage
Severity: High
Latitude: 6.9271
Longitude: 79.8612
```

**Quick Route:**
```
From: Colombo Fort
To: Mount Lavinia
```

---

## 📱 TESTING ORDER

1. Register: `john.smith@gmail.com` / `Test123456`
2. Login: Same credentials
3. Report Hazard #1: Pothole (copy from section 3)
4. Report Hazard #2: Accident (copy from section 4)
5. Report Hazard #3: Traffic Jam (copy from section 5)
6. Search: `Galle Face Green`
7. Plan Route: Colombo Fort → Mount Lavinia
8. Save Route: `Daily Commute to Office`
9. Update Profile: (copy from section 11)
10. Create Moderator: (run script from section 20)
11. Login as Moderator: `moderator@saferoute.com` / `Moderator123`
12. Verify a hazard
13. Create Admin: (run script from section 21)
14. Login as Admin: `admin@saferoute.com` / `Admin123456`
15. Promote user to moderator
16. Test errors: Wrong password, XSS, etc.

---

**✨ All data is ready to copy and paste! Just follow the testing order above!**
