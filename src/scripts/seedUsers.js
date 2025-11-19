const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');
const User = require('../models/user');
const Project = require('../models/project');
const Complaint = require('../models/complaint');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...\n');

    // Clear existing seed data
    console.log('🧹 Cleaning existing seed data...');
    await User.deleteMany({ 
      email: { 
        $in: [
          'admin@test.com',
          'contractor@test.com',
          'user@test.com',
          'govt@test.com',
          'contractor1@test.com',
          'contractor2@test.com',
          'contractor3@test.com',
          'contractor4@test.com',
          'contractor5@test.com',
          'contractor6@test.com',
          'contractor7@test.com'
        ] 
      } 
    });
    await Project.deleteMany({});
    await Complaint.deleteMany({});
    console.log('✅ Cleaned existing data\n');

    // ============================================
    // CREATE USERS
    // ============================================
    console.log('👥 Creating users...');
    
    // Test users with hardcoded credentials
    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'admin123',
        role: 'Government Official',
        legalName: 'Admin User',
        dob: new Date('1990-01-01'),
        phoneNumber: '1234567890',
        aadharNumber: '123456789012',
        address: 'Government Office, New Delhi'
      },
      {
        email: 'contractor@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Test Contractor',
        dob: new Date('1985-05-15'),
        phoneNumber: '9876543210',
        aadharNumber: '987654321098',
        address: 'Mumbai, Maharashtra'
      },
      {
        email: 'user@test.com',
        password: 'user123',
        role: 'General User',
        legalName: 'Test User',
        dob: new Date('1995-03-20'),
        phoneNumber: '5555555555',
        aadharNumber: '555555555555',
        address: 'Bangalore, Karnataka'
      },
      {
        email: 'govt@test.com',
        password: 'govt123',
        role: 'Government Official',
        legalName: 'Government Official',
        dob: new Date('1988-07-10'),
        phoneNumber: '1111111111',
        aadharNumber: '111111111111',
        address: 'Pune, Maharashtra'
      }
    ];

    // Additional contractors (5-7 contractors total including the one above)
    const contractors = [
      {
        email: 'contractor1@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Rajesh Construction Co.',
        dob: new Date('1980-03-12'),
        phoneNumber: '9123456789',
        aadharNumber: '123412341234',
        address: 'Ahmedabad, Gujarat',
        faithScore: 85
      },
      {
        email: 'contractor2@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Sharma Builders Pvt Ltd',
        dob: new Date('1975-08-25'),
        phoneNumber: '9234567890',
        aadharNumber: '234523452345',
        address: 'Jaipur, Rajasthan',
        faithScore: 72
      },
      {
        email: 'contractor3@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Kumar Infrastructure',
        dob: new Date('1982-11-05'),
        phoneNumber: '9345678901',
        aadharNumber: '345634563456',
        address: 'Chennai, Tamil Nadu',
        faithScore: 90
      },
      {
        email: 'contractor4@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Patel Engineering Works',
        dob: new Date('1978-06-18'),
        phoneNumber: '9456789012',
        aadharNumber: '456745674567',
        address: 'Surat, Gujarat',
        faithScore: 68
      },
      {
        email: 'contractor5@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Singh Construction Group',
        dob: new Date('1983-09-30'),
        phoneNumber: '9567890123',
        aadharNumber: '567856785678',
        address: 'Lucknow, Uttar Pradesh',
        faithScore: 78
      },
      {
        email: 'contractor6@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Reddy Builders & Associates',
        dob: new Date('1976-04-22'),
        phoneNumber: '9678901234',
        aadharNumber: '678967896789',
        address: 'Hyderabad, Telangana',
        faithScore: 82
      },
      {
        email: 'contractor7@test.com',
        password: 'contractor123',
        role: 'Contractor',
        legalName: 'Verma Construction Services',
        dob: new Date('1981-12-15'),
        phoneNumber: '9789012345',
        aadharNumber: '789078907890',
        address: 'Kolkata, West Bengal',
        faithScore: 75
      }
    ];

    const allUsers = [...testUsers, ...contractors];
    const createdUsers = [];

    // Hash passwords and create users
    for (const userData of allUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      createdUsers.push(user);
      console.log(`  ✅ Created user: ${user.email} (${user.role})`);
    }

    // Get government officials and contractors for project/complaint creation
    const govtOfficials = createdUsers.filter(u => u.role === 'Government Official');
    const allContractors = createdUsers.filter(u => u.role === 'Contractor');
    
    console.log(`\n✅ Created ${createdUsers.length} users (${govtOfficials.length} Govt Officials, ${allContractors.length} Contractors, ${createdUsers.length - govtOfficials.length - allContractors.length} General Users)\n`);

    // ============================================
    // CREATE PROJECTS
    // ============================================
    console.log('🏗️  Creating projects...');
    
    const projectsData = [
      {
        name: 'Highway Construction - NH-48',
        region: 'Mumbai-Pune Expressway',
        description: 'Construction of 6-lane highway connecting Mumbai to Pune with modern infrastructure',
        tenderDetails: 'Tender ID: TND-2024-001, Budget: ₹500 Crores',
        deadline: new Date('2024-12-31'),
        status: 'In Progress',
        materialCost: 250000000,
        laborCost: 150000000,
        constructionCost: 100000000,
        createdBy: govtOfficials[0]._id,
        contractorId: allContractors[0]._id
      },
      {
        name: 'Residential Complex - Phase 2',
        region: 'Bangalore Urban',
        description: 'Construction of 500 affordable housing units with modern amenities',
        tenderDetails: 'Tender ID: TND-2024-002, Budget: ₹200 Crores',
        deadline: new Date('2025-06-30'),
        status: 'Open',
        materialCost: 100000000,
        laborCost: 60000000,
        constructionCost: 40000000,
        createdBy: govtOfficials[0]._id
      },
      {
        name: 'Bridge Construction - River Ganga',
        region: 'Varanasi, Uttar Pradesh',
        description: 'Construction of 2.5km bridge over River Ganga with modern engineering',
        tenderDetails: 'Tender ID: TND-2024-003, Budget: ₹350 Crores',
        deadline: new Date('2025-03-15'),
        status: 'In Progress',
        materialCost: 180000000,
        laborCost: 100000000,
        constructionCost: 70000000,
        createdBy: govtOfficials[1]._id,
        contractorId: allContractors[2]._id
      },
      {
        name: 'School Building Renovation',
        region: 'Rural Maharashtra',
        description: 'Renovation and expansion of 10 government schools in rural areas',
        tenderDetails: 'Tender ID: TND-2024-004, Budget: ₹50 Crores',
        deadline: new Date('2024-11-30'),
        status: 'In Progress',
        materialCost: 25000000,
        laborCost: 15000000,
        constructionCost: 10000000,
        createdBy: govtOfficials[0]._id,
        contractorId: allContractors[3]._id
      },
      {
        name: 'Metro Rail Extension - Line 3',
        region: 'Delhi NCR',
        description: 'Extension of metro rail line covering 15km with 8 new stations',
        tenderDetails: 'Tender ID: TND-2024-005, Budget: ₹800 Crores',
        deadline: new Date('2026-12-31'),
        status: 'Open',
        materialCost: 400000000,
        laborCost: 250000000,
        constructionCost: 150000000,
        createdBy: govtOfficials[1]._id
      },
      {
        name: 'Water Treatment Plant',
        region: 'Chennai, Tamil Nadu',
        description: 'Construction of modern water treatment plant with 50 MLD capacity',
        tenderDetails: 'Tender ID: TND-2024-006, Budget: ₹150 Crores',
        deadline: new Date('2025-08-31'),
        status: 'In Progress',
        materialCost: 75000000,
        laborCost: 45000000,
        constructionCost: 30000000,
        createdBy: govtOfficials[0]._id,
        contractorId: allContractors[4]._id
      },
      {
        name: 'Road Widening Project - Ring Road',
        region: 'Hyderabad, Telangana',
        description: 'Widening of 20km ring road from 4 lanes to 8 lanes',
        tenderDetails: 'Tender ID: TND-2024-007, Budget: ₹300 Crores',
        deadline: new Date('2025-05-20'),
        status: 'In Progress',
        materialCost: 150000000,
        laborCost: 90000000,
        constructionCost: 60000000,
        createdBy: govtOfficials[1]._id,
        contractorId: allContractors[5]._id
      },
      {
        name: 'Hospital Building Construction',
        region: 'Kolkata, West Bengal',
        description: 'Construction of 500-bed multi-specialty hospital',
        tenderDetails: 'Tender ID: TND-2024-008, Budget: ₹400 Crores',
        deadline: new Date('2026-03-31'),
        status: 'Open',
        materialCost: 200000000,
        laborCost: 120000000,
        constructionCost: 80000000,
        createdBy: govtOfficials[0]._id
      }
    ];

    const createdProjects = [];
    for (const projectData of projectsData) {
      const project = await Project.create(projectData);
      createdProjects.push(project);
      console.log(`  ✅ Created project: ${project.name}`);
    }
    console.log(`\n✅ Created ${createdProjects.length} projects\n`);

    // ============================================
    // CREATE COMPLAINTS
    // ============================================
    console.log('📝 Creating complaints...');
    
    const complaintSubjects = [
      'Poor Quality Materials Used',
      'Delayed Project Completion',
      'Safety Violations on Site',
      'Environmental Damage',
      'Worker Exploitation',
      'Substandard Construction Work',
      'Unauthorized Changes to Design',
      'Noise Pollution',
      'Dust and Air Pollution',
      'Water Contamination',
      'Traffic Disruption',
      'Damage to Adjacent Properties',
      'Inadequate Safety Measures',
      'Corruption Allegations',
      'Financial Irregularities'
    ];

    const complaintDescriptions = [
      'The contractor is using substandard materials that do not meet the specifications mentioned in the tender. This compromises the structural integrity of the project.',
      'The project deadline has been extended multiple times without proper justification. The contractor is not adhering to the agreed timeline.',
      'Multiple safety violations have been observed on the construction site. Workers are not provided with proper safety equipment.',
      'The construction activities are causing significant environmental damage to the surrounding area, including deforestation and soil erosion.',
      'There are reports of workers being exploited with low wages and poor working conditions. Labor laws are being violated.',
      'The construction work does not meet the quality standards. Multiple defects have been identified in the completed sections.',
      'The contractor has made unauthorized changes to the approved design without seeking proper permissions from the authorities.',
      'Construction activities are causing excessive noise pollution, especially during night hours, disturbing nearby residents.',
      'The construction site is generating excessive dust and air pollution, affecting the health of nearby residents.',
      'Construction waste is contaminating nearby water sources, posing a threat to the environment and public health.',
      'Construction activities are causing severe traffic disruptions, affecting daily commuters and local businesses.',
      'Adjacent properties are being damaged due to construction activities, including cracks in buildings and damage to infrastructure.',
      'The construction site lacks adequate safety measures. Multiple accidents have been reported, and safety protocols are not being followed.',
      'There are allegations of corruption and bribery involving the contractor and government officials in the project execution.',
      'Financial irregularities have been detected in the project accounts. Funds are being misused and not properly accounted for.'
    ];

    const statuses = ['Pending', 'Pending', 'Pending', 'Under Investigation', 'Under Investigation', 'Resolved', 'Rejected'];
    
    const createdComplaints = [];
    const projectsWithComplaints = createdProjects.slice(0, 7); // Use first 7 projects for complaints
    
    // Create 12 complaints (within 10-15 range)
    for (let i = 0; i < 12; i++) {
      const project = projectsWithComplaints[i % projectsWithComplaints.length];
      const complaintId = crypto.randomBytes(6).toString('hex');
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const status = statuses[statusIndex];
      
      const complaint = await Complaint.create({
        complaintId,
        projectId: project._id,
        subject: complaintSubjects[i % complaintSubjects.length],
        description: complaintDescriptions[i % complaintDescriptions.length],
        status: status,
        response: status === 'Resolved' ? 'The complaint has been investigated and necessary actions have been taken. The contractor has been instructed to rectify the issues.' : 
                 status === 'Rejected' ? 'After thorough investigation, the complaint was found to be unsubstantiated.' : '',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updatedAt: status !== 'Pending' ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : new Date()
      });
      
      createdComplaints.push(complaint);
      console.log(`  ✅ Created complaint: ${complaint.complaintId} - ${complaint.subject.substring(0, 40)}...`);
    }
    console.log(`\n✅ Created ${createdComplaints.length} complaints\n`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📊 Summary:');
    console.log(`  👥 Users: ${createdUsers.length}`);
    console.log(`     - Government Officials: ${govtOfficials.length}`);
    console.log(`     - Contractors: ${allContractors.length}`);
    console.log(`     - General Users: ${createdUsers.length - govtOfficials.length - allContractors.length}`);
    console.log(`  🏗️  Projects: ${createdProjects.length}`);
    console.log(`  📝 Complaints: ${createdComplaints.length}\n`);

    console.log('📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Government Official:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');
    console.log('\nContractor (All contractors use same password):');
    console.log('  Email: contractor@test.com, contractor1@test.com, ... contractor7@test.com');
    console.log('  Password: contractor123');
    console.log('\nGeneral User:');
    console.log('  Email: user@test.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

