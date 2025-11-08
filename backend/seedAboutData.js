const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AboutContent = require('./models/AboutContent');
const TeamMember = require('./models/TeamMember');
const FAQ = require('./models/FAQ');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find an admin user to use as addedBy
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }
    console.log('Using admin user:', adminUser.email);

    // Clear existing data
    await AboutContent.deleteMany({});
    await TeamMember.deleteMany({});
    await FAQ.deleteMany({});
    console.log('Cleared existing data');

    // Seed About Content
    const missionContent = new AboutContent({
      section: 'mission',
      title: 'Our Mission',
      content: 'SafeRoute is dedicated to creating safer communities through technology. We believe that everyone deserves to travel safely, and by crowdsourcing hazard information from our users, we can build the most comprehensive and up-to-date safety database. Our platform combines real-time reporting, intelligent route planning, and community collaboration to help you avoid potential dangers and reach your destination safely.',
      order: 1,
      isActive: true,
      metadata: {
        icon: '🎯'
      }
    });

    const featuresContent = new AboutContent({
      section: 'features',
      title: 'Why Choose SafeRoute?',
      content: 'Discover the features that make SafeRoute your trusted travel companion. Real-time hazard reporting, intelligent route planning, safety alerts, community-driven data, verified reports, and comprehensive data analytics.',
      order: 2,
      isActive: true,
      metadata: {
        icon: '✨'
      }
    });

    await AboutContent.insertMany([missionContent, featuresContent]);
    console.log('Seeded about content');

    // Seed Team Members
    const teamMembers = [
      {
        name: 'Sarah Johnson',
        role: 'CEO & Founder',
        bio: 'Passionate about leveraging technology to create safer communities. 10+ years in tech leadership.',
        order: 1,
        isActive: true,
        addedBy: adminUser._id,
        socialLinks: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          github: 'https://github.com'
        }
      },
      {
        name: 'Michael Chen',
        role: 'CTO',
        bio: 'Expert in real-time systems and mapping technologies. Previously led engineering teams at major tech companies.',
        order: 2,
        isActive: true,
        addedBy: adminUser._id,
        socialLinks: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com'
        }
      },
      {
        name: 'Emily Rodriguez',
        role: 'Head of Safety Operations',
        bio: 'Former traffic safety analyst with 8 years of experience in urban planning and road safety initiatives.',
        order: 3,
        isActive: true,
        addedBy: adminUser._id,
        socialLinks: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com'
        }
      },
      {
        name: 'David Kim',
        role: 'Lead Developer',
        bio: 'Full-stack developer specializing in mapping applications and real-time data processing.',
        order: 4,
        isActive: true,
        addedBy: adminUser._id,
        socialLinks: {
          github: 'https://github.com',
          twitter: 'https://twitter.com'
        }
      }
    ];

    await TeamMember.insertMany(teamMembers);
    console.log('Seeded team members');

    // Seed FAQs
    const faqs = [
      {
        question: 'What is SafeRoute?',
        answer: 'SafeRoute is a community-driven platform that helps you navigate safely by providing real-time information about road hazards, accidents, and unsafe conditions. Users can report hazards they encounter, and our system uses this data to suggest the safest routes to your destination.',
        category: 'General',
        order: 1,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'How do I report a hazard?',
        answer: 'Simply log in to your account, navigate to the map dashboard, click on the location where you see a hazard, and fill out the report form. You can add photos, descriptions, and specify the type of hazard. Our team will verify the report and make it visible to other users.',
        category: 'General',
        order: 2,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'Is SafeRoute free to use?',
        answer: 'Yes! SafeRoute is completely free for all users. We believe everyone deserves access to safety information. You just need to create a free account to start reporting and viewing hazards.',
        category: 'General',
        order: 3,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'How accurate is the hazard information?',
        answer: 'All hazard reports are verified by our moderation team before being displayed to users. We also use a community validation system where users can confirm or dispute reports. Reports are automatically marked as resolved after a certain time period or when verified as cleared.',
        category: 'Safety',
        order: 4,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'What types of hazards can I report?',
        answer: 'You can report various types of hazards including potholes, road damage, accidents, flooding, debris on road, poor visibility conditions, construction zones, and any other safety concerns that might affect travelers.',
        category: 'Safety',
        order: 5,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'How does the safe route planning work?',
        answer: 'Our algorithm analyzes all verified hazard reports in real-time and calculates the safest route to your destination. It considers the severity of hazards, their current status, and traffic conditions to suggest the best path. You can compare the safe route with the fastest route to make an informed decision.',
        category: 'Features',
        order: 6,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'Can I use SafeRoute offline?',
        answer: 'Currently, SafeRoute requires an internet connection to access real-time hazard data and calculate safe routes. However, we are working on an offline mode that will cache recent hazard data for areas you frequently travel.',
        category: 'Technical',
        order: 7,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'How do notifications work?',
        answer: 'You can enable notifications to receive alerts about new hazards along your saved routes or in your area. Notifications can be customized based on hazard severity and type. You can manage your notification preferences in your profile settings.',
        category: 'Features',
        order: 8,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes, we take privacy seriously. Your personal information is encrypted and stored securely. We only share your username with reported hazards, not your email or other personal details. You can read our full Privacy Policy for more information.',
        category: 'Safety',
        order: 9,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'What devices are supported?',
        answer: 'SafeRoute works on any modern web browser (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices. We are also developing native mobile apps for iOS and Android that will be released soon.',
        category: 'Technical',
        order: 10,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'How can I contribute to SafeRoute?',
        answer: 'The best way to contribute is by reporting hazards you encounter and verifying reports from other users. You can also share SafeRoute with friends and family to grow our community. If you are a developer, check our GitHub repository for ways to contribute to the codebase.',
        category: 'General',
        order: 11,
        isActive: true,
        addedBy: adminUser._id
      },
      {
        question: 'What happens to old hazard reports?',
        answer: 'Hazard reports are automatically marked for review after 7 days. If a hazard is confirmed as still present, it stays active. If it has been resolved or cannot be verified, it is marked as resolved. You can still view resolved hazards in the history, but they do not affect route planning.',
        category: 'Technical',
        order: 12,
        isActive: true,
        addedBy: adminUser._id
      }
    ];

    await FAQ.insertMany(faqs);
    console.log('Seeded FAQs');

    console.log('\n✅ Database seeded successfully!');
    console.log('Created:');
    console.log('- 2 About Content sections');
    console.log('- 4 Team Members');
    console.log('- 12 FAQs');
    console.log('\nYou can now visit the About page at http://localhost:3000/about');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedData();
