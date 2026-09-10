import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Issue } from '../models/Issue.js';
import { Rating } from '../models/Rating.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfix';
const fallbackUri = 'mongodb://127.0.0.1:27017/campusfix';

const connectWithFallback = async () => {
  try {
    console.log(`[InitDB] Connecting to ${primaryUri}...`);
    return await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 6000 });
  } catch (err) {
    console.warn(`[InitDB] Primary connection failed: ${err.message}`);
    if (primaryUri !== fallbackUri) {
      console.log(`[InitDB] Falling back to local MongoDB: ${fallbackUri}...`);
      return await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
    }
    throw err;
  }
};

export const initCleanDatabase = async () => {
  try {
    await connectWithFallback();
    console.log('[InitDB] Connected. Purging mock data...');

    // Wipe all mock/sample issues, ratings, notifications
    const deletedIssues = await Issue.deleteMany({});
    const deletedRatings = await Rating.deleteMany({});
    const deletedNotifications = await Notification.deleteMany({});

    console.log(`[InitDB] Removed ${deletedIssues.deletedCount} mock issues.`);
    console.log(`[InitDB] Removed ${deletedRatings.deletedCount} mock ratings.`);
    console.log(`[InitDB] Removed ${deletedNotifications.deletedCount} mock notifications.`);

    // Reset categories to standard campus maintenance catalog
    await Category.deleteMany({});
    const categoriesData = [
      { name: 'Plumbing', icon: 'Droplets', severityWeight: 20, description: 'Pipes, taps, water leakages, restroom cisterns, water tanks' },
      { name: 'Electrical', icon: 'Zap', severityWeight: 25, description: 'Power outages, short circuits, switchboards, wiring faults' },
      { name: 'Lighting', icon: 'Lightbulb', severityWeight: 15, description: 'Street lights, corridor lamps, classroom tubes, pathway illumination' },
      { name: 'AC/Cooling', icon: 'Wind', severityWeight: 15, description: 'Air conditioning units, ceiling fans, chillers, ventilation' },
      { name: 'Washroom', icon: 'Bath', severityWeight: 20, description: 'Sanitation, hygiene, flush valves, drainage clogs, mirrors' },
      { name: 'Internet/Wi-Fi', icon: 'Wifi', severityWeight: 15, description: 'Access points, LAN sockets, router failures, network drops' },
      { name: 'Furniture', icon: 'Armchair', severityWeight: 10, description: 'Desks, ergonomic chairs, classroom benches, whiteboards' },
      { name: 'Infrastructure', icon: 'Building2', severityWeight: 18, description: 'Stairways, walls, windows, doors, broken tiles, ramps' },
      { name: 'Cleaning', icon: 'Sparkles', severityWeight: 12, description: 'Waste disposal, corridor mopping, spills, cleanliness' },
      { name: 'Security', icon: 'ShieldAlert', severityWeight: 25, description: 'Locks, emergency exits, access gates, security surveillance' },
      { name: 'Garden/Landscaping', icon: 'Trees', severityWeight: 6, description: 'Overgrown vegetation, pathways, sprinkler lines' },
      { name: 'Parking', icon: 'Car', severityWeight: 8, description: 'Parking lots, barricades, signage, speed humps' },
      { name: 'Other', icon: 'HelpCircle', severityWeight: 10, description: 'General campus maintenance requirements' },
    ];
    await Category.insertMany(categoriesData);
    console.log(`[InitDB] Seeded ${categoriesData.length} foundational maintenance categories.`);

    // Ensure baseline live accounts exist (or update them)
    console.log('[InitDB] Initializing core live accounts (Admin, Technicians, Reporter)...');
    
    // 1. Admin account
    let admin = await User.findOne({ email: 'admin@campusfix.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'Dr. Rajesh Verma',
        email: 'admin@campusfix.edu',
        password: 'Admin@123',
        role: 'ADMIN',
        department: 'Campus Estate & Maintenance Directorate',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      console.log('  -> Created Administrator: admin@campusfix.edu / Admin@123');
    } else {
      admin.activeTasksCount = 0;
      await admin.save();
      console.log('  -> Administrator account verified.');
    }

    // 2. Primary Worker account
    let worker1 = await User.findOne({ email: 'worker@campusfix.edu' });
    if (!worker1) {
      worker1 = await User.create({
        name: 'Ramesh Kumar',
        email: 'worker@campusfix.edu',
        password: 'Worker@123',
        role: 'WORKER',
        department: 'Electrical & Plumbing Maintenance',
        phone: '+91 98111 22233',
        specialties: ['Electrical', 'Plumbing', 'Lighting'],
        activeTasksCount: 0,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
      console.log('  -> Created Technician: worker@campusfix.edu / Worker@123');
    } else {
      worker1.activeTasksCount = 0;
      await worker1.save();
      console.log('  -> Primary technician account verified.');
    }

    // 3. Second Worker account (HVAC / Civil)
    let worker2 = await User.findOne({ email: 'hvac.tech@campusfix.edu' });
    if (!worker2) {
      worker2 = await User.create({
        name: 'Sunil Rao',
        email: 'hvac.tech@campusfix.edu',
        password: 'Worker@123',
        role: 'WORKER',
        department: 'HVAC & Refrigeration Services',
        phone: '+91 98222 33344',
        specialties: ['AC/Cooling', 'Internet/Wi-Fi'],
        activeTasksCount: 0,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      });
      console.log('  -> Created Technician: hvac.tech@campusfix.edu / Worker@123');
    } else {
      worker2.activeTasksCount = 0;
      await worker2.save();
    }

    // 4. Resident / Student account
    let student = await User.findOne({ email: 'student@campusfix.edu' });
    if (!student) {
      student = await User.create({
        name: 'Aryan Sharma',
        email: 'student@campusfix.edu',
        password: 'Student@123',
        role: 'USER',
        department: 'Computer Science & Engineering',
        phone: '+91 98444 55566',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      });
      console.log('  -> Created Campus Resident: student@campusfix.edu / Student@123');
    }

    const issuesCount = await Issue.countDocuments();
    console.log(`\n✅ DATABASE INITIALIZATION COMPLETE!`);
    console.log(`   - Live Issues: ${issuesCount} (All mock data cleared)`);
    console.log(`   - Categories: ${categoriesData.length} ready`);
    console.log(`   - Ready for live complaint creation, worker assignment, and verification.`);

    process.exit(0);
  } catch (error) {
    console.error(`[InitDB Error] ${error.message}`);
    process.exit(1);
  }
};

initCleanDatabase();
