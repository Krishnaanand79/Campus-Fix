import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Issue } from '../models/Issue.js';
import { Rating } from '../models/Rating.js';
import { Notification } from '../models/Notification.js';
import { calculatePriorityScore } from '../utils/priorityCalculator.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfix';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
    console.log('[Seed] Connected. Clearing existing collections...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Issue.deleteMany({});
    await Rating.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Creating demo users...');
    // Create Users
    const admin = await User.create({
      name: 'Dr. Rajesh Verma',
      email: 'admin@campusfix.edu',
      password: 'Admin@123',
      role: 'ADMIN',
      department: 'Campus Estate & Maintenance Directorate',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const worker1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'worker@campusfix.edu',
      password: 'Worker@123',
      role: 'WORKER',
      department: 'Electrical & Plumbing Division',
      phone: '+91 98111 22233',
      specialties: ['Electrical', 'Plumbing', 'Lighting'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const worker2 = await User.create({
      name: 'Sunil Rao',
      email: 'hvac.tech@campusfix.edu',
      password: 'Worker@123',
      role: 'WORKER',
      department: 'HVAC & Refrigeration Services',
      phone: '+91 98222 33344',
      specialties: ['AC/Cooling', 'Internet/Wi-Fi'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    const worker3 = await User.create({
      name: 'Mohan Lal',
      email: 'civil.tech@campusfix.edu',
      password: 'Worker@123',
      role: 'WORKER',
      department: 'Civil Infrastructure & Carpentry',
      phone: '+91 98333 44455',
      specialties: ['Furniture', 'Infrastructure', 'Washroom'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    });

    const student = await User.create({
      name: 'Aryan Sharma',
      email: 'student@campusfix.edu',
      password: 'Student@123',
      role: 'USER',
      department: 'Computer Science & Engineering (3rd Year)',
      phone: '+91 98444 55566',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    });

    const faculty = await User.create({
      name: 'Prof. Ananya Sen',
      email: 'faculty@campusfix.edu',
      password: 'Faculty@123',
      role: 'USER',
      department: 'Electronics & Communication Eng.',
      phone: '+91 98555 66677',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Creating categories...');
    const categoriesData = [
      { name: 'Plumbing', icon: 'Droplets', severityWeight: 20, description: 'Pipes, taps, water leakages, tanks' },
      { name: 'Electrical', icon: 'Zap', severityWeight: 25, description: 'Power failures, switches, short circuits, wires' },
      { name: 'Lighting', icon: 'Lightbulb', severityWeight: 15, description: 'Street lights, corridor lamps, classroom tubes' },
      { name: 'AC/Cooling', icon: 'Wind', severityWeight: 15, description: 'Air conditioners, ceiling fans, chillers' },
      { name: 'Washroom', icon: 'Bath', severityWeight: 20, description: 'Hygiene, flush mechanisms, drainage, mirrors' },
      { name: 'Internet/Wi-Fi', icon: 'Wifi', severityWeight: 15, description: 'Access points, LAN ports, optic fiber lines' },
      { name: 'Furniture', icon: 'Armchair', severityWeight: 10, description: 'Desks, chairs, podiums, lab benches' },
      { name: 'Infrastructure', icon: 'Building2', severityWeight: 18, description: 'Roads, walls, stairs, windows, doors' },
      { name: 'Cleaning', icon: 'Sparkles', severityWeight: 12, description: 'Garbage accumulation, corridor mopping' },
      { name: 'Garden/Landscaping', icon: 'Trees', severityWeight: 6, description: 'Overgrown branches, sprinkler systems' },
      { name: 'Security', icon: 'ShieldAlert', severityWeight: 25, description: 'Broken locks, gates, CCTV cameras' },
      { name: 'Parking', icon: 'Car', severityWeight: 8, description: 'Parking bays, barricades, lighting' },
      { name: 'Other', icon: 'HelpCircle', severityWeight: 10, description: 'General maintenance requirements' },
    ];
    await Category.insertMany(categoriesData);

    console.log('[Seed] Creating realistic issues with diverse lifecycle states...');

    // Issue 1: IN_PROGRESS (High Priority, heavily upvoted)
    const issue1Data = {
      title: 'Continuous High-Pressure Water Leakage near Hostel Block A Entrance',
      description: 'A major water pipe joint ruptured near the main entrance portico of Hostel Block A. Fresh drinking water is continuously gushing out onto the driveway creating a massive muddy puddle and slip hazard for residents.',
      category: 'Plumbing',
      location: {
        block: 'Hostel Block A',
        floor: 'Ground Floor',
        area: 'Main Entrance Portico & Ramp',
      },
      images: [
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
      ],
      reportedBy: student._id,
      upvotes: [student._id, faculty._id, admin._id],
      upvotesCount: 43,
      severity: 'HIGH',
      status: 'IN_PROGRESS',
      assignedWorker: worker1._id,
      assignedAt: new Date(Date.now() - 24 * 3600000),
      acknowledgedAt: new Date(Date.now() - 20 * 3600000),
      inProgressAt: new Date(Date.now() - 2 * 3600000),
      deadline: new Date(Date.now() + 12 * 3600000),
      timeline: [
        {
          status: 'REPORTED',
          changedBy: student._id,
          note: 'Reported by Aryan Sharma with high severity flag.',
          timestamp: new Date(Date.now() - 36 * 3600000),
        },
        {
          status: 'UNDER_REVIEW',
          changedBy: admin._id,
          note: 'Verified on site by admin team.',
          timestamp: new Date(Date.now() - 28 * 3600000),
        },
        {
          status: 'ASSIGNED',
          changedBy: admin._id,
          note: 'Assigned urgently to Ramesh Kumar with replacement pipe fittings.',
          timestamp: new Date(Date.now() - 24 * 3600000),
        },
        {
          status: 'ACKNOWLEDGED',
          changedBy: worker1._id,
          note: 'Technician acknowledged; collecting 2-inch PVC pressure couplings from store.',
          timestamp: new Date(Date.now() - 20 * 3600000),
        },
        {
          status: 'IN_PROGRESS',
          changedBy: worker1._id,
          note: 'Main valve isolated, excavation and joint welding in progress.',
          timestamp: new Date(Date.now() - 2 * 3600000),
        },
      ],
    };
    const { score: score1, priority: prio1 } = calculatePriorityScore(issue1Data);
    issue1Data.priorityScore = score1;
    issue1Data.priority = prio1;
    const issue1 = await Issue.create(issue1Data);

    // Issue 2: RESOLVED (Waiting for Student Verification & Rating!)
    const issue2Data = {
      title: 'Water Cooler Dispenser Motor Burned Out in Main Cafeteria',
      description: 'The cold water dispenser in the central dining hall was tripping the circuit breaker and emitting a burning smell. Students have no chilled water during peak lunch hours.',
      category: 'Electrical',
      location: {
        block: 'Central Cafeteria',
        floor: 'Ground Floor',
        area: 'Dining Hall Station 2',
      },
      images: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      ],
      reportedBy: student._id,
      upvotes: [student._id, faculty._id],
      upvotesCount: 35,
      severity: 'HIGH',
      status: 'RESOLVED',
      assignedWorker: worker1._id,
      assignedAt: new Date(Date.now() - 48 * 3600000),
      acknowledgedAt: new Date(Date.now() - 46 * 3600000),
      inProgressAt: new Date(Date.now() - 30 * 3600000),
      resolvedAt: new Date(Date.now() - 3 * 3600000),
      proof: {
        beforeMedia: [
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        ],
        afterMedia: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        ],
        workNotes: 'Replaced faulty compressor relay switch, flushed condenser coils, and tested temperature sensor. Unit cooled water to 8°C successfully with zero electrical leakage.',
        completedAt: new Date(Date.now() - 3 * 3600000),
      },
      timeline: [
        {
          status: 'REPORTED',
          changedBy: student._id,
          note: 'Reported by Aryan Sharma',
          timestamp: new Date(Date.now() - 50 * 3600000),
        },
        {
          status: 'ASSIGNED',
          changedBy: admin._id,
          note: 'Assigned to Electrical maintenance team',
          timestamp: new Date(Date.now() - 48 * 3600000),
        },
        {
          status: 'RESOLVED',
          changedBy: worker1._id,
          note: 'Compressor relay replaced and temperature calibrated. Proof uploaded.',
          timestamp: new Date(Date.now() - 3 * 3600000),
        },
      ],
    };
    const { score: score2, priority: prio2 } = calculatePriorityScore(issue2Data);
    issue2Data.priorityScore = score2;
    issue2Data.priority = prio2;
    const issue2 = await Issue.create(issue2Data);

    // Issue 3: CLOSED (Successfully completed, verified with 5-star rating)
    const issue3Data = {
      title: 'High-Speed Wi-Fi Access Point Offline in Girls Hostel 2',
      description: 'The Cisco Aruba access point mounted on the 2nd floor ceiling was completely dark with no LED activity. Entire wing of 40 students was disconnected before midterm submissions.',
      category: 'Internet/Wi-Fi',
      location: {
        block: 'Girls Hostel Block 2',
        floor: '2nd Floor',
        area: 'Corridor Wing B, Outside Room 218',
      },
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
      ],
      reportedBy: faculty._id,
      upvotes: [faculty._id, student._id],
      upvotesCount: 52,
      severity: 'CRITICAL',
      status: 'CLOSED',
      assignedWorker: worker2._id,
      assignedAt: new Date(Date.now() - 72 * 3600000),
      resolvedAt: new Date(Date.now() - 24 * 3600000),
      closedAt: new Date(Date.now() - 20 * 3600000),
      proof: {
        beforeMedia: [
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
        ],
        afterMedia: [
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        ],
        workNotes: 'Replaced crimped PoE RJ45 connector in switch cabinet and restored Gigabit PoE power. Ping latency < 2ms.',
        completedAt: new Date(Date.now() - 24 * 3600000),
      },
      verification: {
        verifiedBy: faculty._id,
        verifiedAt: new Date(Date.now() - 20 * 3600000),
        isSatisfied: true,
        reopenReason: '',
      },
      timeline: [
        {
          status: 'REPORTED',
          changedBy: faculty._id,
          note: 'Reported by Prof. Ananya Sen',
          timestamp: new Date(Date.now() - 75 * 3600000),
        },
        {
          status: 'RESOLVED',
          changedBy: worker2._id,
          note: 'PoE power and cabling restored.',
          timestamp: new Date(Date.now() - 24 * 3600000),
        },
        {
          status: 'CLOSED',
          changedBy: faculty._id,
          note: 'User verified fix: Network is blazing fast now!',
          timestamp: new Date(Date.now() - 20 * 3600000),
        },
      ],
    };
    const { score: score3, priority: prio3 } = calculatePriorityScore(issue3Data);
    issue3Data.priorityScore = score3;
    issue3Data.priority = prio3;
    const issue3 = await Issue.create(issue3Data);

    // Create 5-star Rating for Issue 3
    await Rating.create({
      issueId: issue3._id,
      userId: faculty._id,
      workerId: worker2._id,
      rating: 5,
      review: 'Sunil fixed the PoE connection within hours before our online evaluation session. Outstanding speed and communication!',
    });

    // Issue 4: REPORTED (New issue, open for upvotes)
    const issue4Data = {
      title: 'Four Broken Ergonomic Chairs with Snapped Gas Lifts in Computer Lab 4',
      description: 'The hydraulic gas-lift cylinders on chairs 12, 14, 18, and 23 collapsed completely, making them hazardous and unusable during our 3-hour lab sessions.',
      category: 'Furniture',
      location: {
        block: 'Academic Block 3',
        floor: '2nd Floor',
        area: 'Lab 402 - Systems Architecture Lab',
      },
      images: [
        'https://images.unsplash.com/photo-1580481077195-c22ae2499d3e?w=800&auto=format&fit=crop&q=80',
      ],
      reportedBy: student._id,
      upvotes: [student._id],
      upvotesCount: 9,
      severity: 'MEDIUM',
      status: 'REPORTED',
      timeline: [
        {
          status: 'REPORTED',
          changedBy: student._id,
          note: 'Reported by Aryan Sharma',
          timestamp: new Date(Date.now() - 10 * 3600000),
        },
      ],
    };
    const { score: score4, priority: prio4 } = calculatePriorityScore(issue4Data);
    issue4Data.priorityScore = score4;
    issue4Data.priority = prio4;
    await Issue.create(issue4Data);

    // Issue 5: ASSIGNED (Street lights along main library walkway)
    const issue5Data = {
      title: 'Corridor & Street Lights Flickering Dangerously along Library Pathway',
      description: 'Three consecutive high-mast LED fixtures along the central tree-lined walkway to the library are completely unlit after 7:30 PM, creating a dark safety hazard for late-night students.',
      category: 'Lighting',
      location: {
        block: 'Central Library',
        floor: 'Outdoor',
        area: 'East Pathway between Library and Admin Lawn',
      },
      images: [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
      ],
      reportedBy: student._id,
      upvotes: [student._id, faculty._id],
      upvotesCount: 29,
      severity: 'HIGH',
      status: 'ASSIGNED',
      assignedWorker: worker1._id,
      assignedAt: new Date(Date.now() - 15 * 3600000),
      timeline: [
        {
          status: 'REPORTED',
          changedBy: student._id,
          note: 'Night safety issue submitted',
          timestamp: new Date(Date.now() - 25 * 3600000),
        },
        {
          status: 'ASSIGNED',
          changedBy: admin._id,
          note: 'Scheduled Ramesh Kumar with mobile boom lift',
          timestamp: new Date(Date.now() - 15 * 3600000),
        },
      ],
    };
    const { score: score5, priority: prio5 } = calculatePriorityScore(issue5Data);
    issue5Data.priorityScore = score5;
    issue5Data.priority = prio5;
    await Issue.create(issue5Data);

    // Create Initial Notifications
    console.log('[Seed] Creating demo notifications...');
    await Notification.create({
      recipient: student._id,
      sender: worker1._id,
      issueId: issue2._id,
      title: '🎉 Issue Marked Resolved! Please Verify',
      message: 'Technician Ramesh Kumar resolved the Cafeteria Water Cooler issue. Please verify and leave your review!',
      type: 'VERIFICATION_REQUEST',
    });

    await Notification.create({
      recipient: worker1._id,
      sender: admin._id,
      issueId: issue1._id,
      title: '🚨 High Priority Task Assigned',
      message: 'You have been assigned to: "Water Leakage near Hostel Block A Entrance". Please prioritize.',
      type: 'ASSIGNMENT',
    });

    await Notification.create({
      recipient: admin._id,
      sender: student._id,
      issueId: issue1._id,
      title: '🔥 High Community Support (43 +1s)',
      message: 'Hostel Block A water leakage complaint now affects 43 users.',
      type: 'HIGH_PRIORITY_ALERT',
    });

    console.log('========================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('DEMO ACCOUNTS READY TO TEST:');
    console.log('1. Admin:   admin@campusfix.edu   / Admin@123');
    console.log('2. Worker:  worker@campusfix.edu  / Worker@123');
    console.log('3. Student: student@campusfix.edu / Student@123');
    console.log('4. Faculty: faculty@campusfix.edu / Faculty@123');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
