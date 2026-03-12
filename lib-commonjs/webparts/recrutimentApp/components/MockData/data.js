"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANDIDATE_SELECTION_DATA = exports.EVALUATION_DATA = exports.ADVERT_REVIEW_DATA = exports.URGENT_TASKS = exports.PRIORITY_DATA = exports.TRACKER_DATA = void 0;
// export const METRIC_CONFIG = [
//   { id: 'hod-review', label: 'Pending Advert Review', status: 'ACTIVE', icon: UserCheck, color: 'text-orange-500', bgColor: 'bg-orange-50' },
//   { id: 'pending-evaluation', label: 'Pending Evaluation', status: 'PENDING', icon: Activity, color: 'text-amber-500', bgColor: 'bg-amber-50' },
//   { id: 'pos-mapping', label: 'Pending Position ID', status: 'CRITICAL', icon: ClipboardList, color: 'text-red-500', bgColor: 'bg-red-50' },
//   { id: 'interviews', label: 'Interviews Scheduled', status: 'SCHEDULED', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50' },
//   { id: 'tracking', label: 'Interview Tracking', status: 'ON-GOING', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
//   { id: 'offers-released', label: 'Offer Letters Released', status: 'OUTBOUND', icon: FileText, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
//   { id: 'offers-accepted', label: 'Offers Accepted', status: 'SUCCESS', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50' },
//   { id: 'offers-rejected', label: 'Offers Rejected', status: 'LOST', icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-50' },
//   { id: 'onboarded', label: 'Candidates Onboarded', status: 'WELCOME', icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-50' }
// ];
exports.TRACKER_DATA = [
    { id: '1', jobCode: 'SEN-100', title: 'Senior Mining Engineer - Mining', vacancies: 1, date: '2024-05-01', status: 'Pending Advert Review', buCode: 'A1011103000', posRequest: 'New Position Request', nationality: 'Expatriate' },
    { id: '2', jobCode: 'UND-101', title: 'Underground Shift Supervisor - Engineering', vacancies: 2, date: '2024-05-02', status: 'Pending Advert Review', buCode: 'A1011104406', posRequest: 'New Position Request', nationality: 'Local' },
    { id: '3', jobCode: 'GEO-102', title: 'Geotechnical Technician - SHEQ', vacancies: 3, date: '2024-05-03', status: 'Pending Advert Review', buCode: 'A1011104407', posRequest: 'New Position Request', nationality: 'Expatriate' },
    { id: '4', jobCode: 'PRO-103', title: 'Mechanical Foreman - Processing', vacancies: 4, date: '2024-05-04', status: 'Pending Advert Review', buCode: 'A1011104408', posRequest: 'New Position Request', nationality: 'Local' },
    { id: '5', jobCode: 'HUM-104', title: 'Safety Officer - Human Resources', vacancies: 5, date: '2024-05-05', status: 'Pending Advert Review', buCode: 'A1011104409', posRequest: 'New Position Request', nationality: 'Expatriate' },
    { id: '6', jobCode: 'SUP-105', title: 'Plant Electrician - Supply Chain', vacancies: 1, date: '2024-05-06', status: 'Pending Advert Review', buCode: 'A1011104410', posRequest: 'New Position Request', nationality: 'Local' },
    { id: '7', jobCode: 'ICT-106', title: 'HR Coordinator - ICT', vacancies: 2, date: '2024-05-07', status: 'Pending Advert Review', buCode: 'A1011104411', posRequest: 'New Position Request', nationality: 'Expatriate' },
];
exports.PRIORITY_DATA = [
    { name: 'HOD Reviews', value: 12, color: '#3B82F6' },
    { name: 'Position Mapping', value: 8, color: '#F59E0B' },
];
exports.URGENT_TASKS = [
    { title: 'Mining Engineering', subtitle: 'Advert Review Pending', overdue: '5D OVERDUE', type: 'error' },
    { title: 'Mining Supervisor', subtitle: 'Position Mapping', overdue: '3D OVERDUE', type: 'warning' },
];
exports.ADVERT_REVIEW_DATA = [
    {
        jobCode: 'SEN-100',
        jobTitle: 'Senior Mining Engineer - Mining',
        buCode: 'A1011103000',
        buName: '1 - Mining',
        buDescription: 'M-CT-C-SV-Eng-Mgmt',
        department: '03 - Engineering',
        subDepartment: 'Kakula Concentrator & Backfill',
        section: 'Concentrator Engineering',
        deptCode: '5700',
        nationality: 'Expatriate',
        patersonGrade: 'A1',
        drcGrade: 'I-1',
        employmentCategory: 'KCSA Employee',
        contractType: 'Fixed Term',
        areaOfWork: 'Concentrator',
        noOfPersons: '12',
        dateRequired: '26-02-2026',
        posRequest: 'New Position Request',
        status: 'Pending with HOD to review Adv',
        grade: 'G12',
        reportsTo: 'Mining Manager',
        description: 'The Senior Mining Engineer will be responsible for short and medium-term mine planning, ensuring optimal extraction and safety standards are met. This role involves leading a team of junior engineers and coordinating with geology and processing departments.',
        descriptionFr: "L'ingénieur principal des mines sera responsable de la planification minière à court et moyen terme, garantissant le respect des normes d'extraction et de sécurité optimales.",
        responsibilities: [
            'Develop and maintain short-term mine plans (weekly/monthly).',
            'Optimize drill and blast patterns for cost-effective fragmentation.',
            'Monitor and report on mine performance against budget.',
            'Ensure compliance with all safety and environmental regulations.'
        ],
        responsibilitiesFr: [
            'Développer et maintenir des plans de mine à court terme (hebdomadaires/mensuels).',
            'Optimiser les schémas de forage et de minage pour une fragmentation rentable.',
            'Surveiller et rapporter les performances de la mine par rapport au budget.',
            "Assurer la conformité avec toutes les réglementations de sécurité et d'environnement."
        ],
        qualifications: [
            'B.Sc. in Mining Engineering or equivalent.',
            'Professional Engineer certification (P.Eng or equivalent).',
            'Valid blasting certificate (preferred).'
        ],
        qualificationsFr: [
            'B.Sc. en génie minier ou équivalent.',
            "Certification d'ingénieur professionnel (P.Eng ou équivalent).",
            'Certificat de minage valide (préféré).'
        ],
        experience: [
            'Minimum 8-10 years of experience in open-pit or underground mining.',
            'Proficiency in mine planning software (e.g., Deswik, Surpac).',
            'Proven leadership experience in a multicultural environment.'
        ],
        experienceFr: [
            "Minimum 8 à 10 ans d'expérience dans l'exploitation minière à ciel ouvert ou souterraine.",
            'Maîtrise des logiciels de planification minière (ex: Deswik, Surpac).',
            'Expérience de leadership éprouvée dans un environnement multiculturel.'
        ],
        attachments: [
            { title: 'Role Profile', type: 'PDF', versions: [{ lang: 'EN', size: '1.2 MB', label: 'English Version' }, { lang: 'FR', size: '1.1 MB', label: 'French Version' }] },
            { title: 'Grading Report', type: 'PDF', versions: [{ lang: 'EN', size: '0.8 MB', label: 'English Version' }, { lang: 'FR', size: '0.9 MB', label: 'French Version' }] },
            { title: 'Draft ONEM Document', type: 'DOCX', versions: [{ lang: 'ALL', size: '2.4 MB', label: 'Standard Document' }] }
        ]
    },
    {
        jobCode: 'UND-101',
        jobTitle: 'Underground Shift Supervisor - Engineering',
        buCode: 'A1011104406',
        buName: '1 - Engineering',
        buDescription: 'E-CT-C-SV-Eng-Mgmt',
        department: '03 - Engineering',
        subDepartment: 'Underground Maintenance',
        section: 'Mechanical Engineering',
        deptCode: '5800',
        nationality: 'Local',
        patersonGrade: 'B2',
        drcGrade: 'J-2',
        employmentCategory: 'KCSA Employee',
        contractType: 'Permanent',
        areaOfWork: 'Underground',
        noOfPersons: '1',
        dateRequired: '15-03-2026',
        posRequest: 'New Position Request',
        status: 'Pending with HOD to review Adv',
        grade: 'G10',
        reportsTo: 'Engineering Superintendent',
        description: 'Oversee underground engineering shifts, ensuring all maintenance and repair activities are completed safely and efficiently.',
        descriptionFr: "Superviser les quarts de travail d'ingénierie souterraine, en veillant à ce que toutes les activités de maintenance et de réparation soient effectuées de manière sûre et efficace.",
        responsibilities: [
            'Supervise shift activities for underground maintenance teams.',
            'Coordinate emergency repairs to minimize production delays.',
            'Conduct daily safety briefings and tool-box talks.',
            'Manage spare parts inventory for the shift.'
        ],
        responsibilitiesFr: [
            "Superviser les activités de quart pour les équipes de maintenance souterraine.",
            "Coordonner les réparations d'urgence pour minimiser les retards de production.",
            "Mener des séances d'information quotidiennes sur la sécurité.",
            "Gérer l'inventaire des pièces de rechange pour le quart."
        ],
        qualifications: [
            'Diploma or Degree in Mechanical/Electrical Engineering.',
            'Supervisor certification for underground operations.'
        ],
        qualificationsFr: [
            'Diplôme ou diplôme en génie mécanique/électrique.',
            'Certification de superviseur pour les opérations souterraines.'
        ],
        experience: [
            '5+ years of experience in underground mining maintenance.',
            'Strong knowledge of hydraulic and electrical systems.',
            'Previous supervisory experience required.'
        ],
        experienceFr: [
            "Plus de 5 ans d'expérience dans la maintenance minière souterraine.",
            'Solide connaissance des systèmes hydrauliques et électriques.',
            'Expérience de supervision préalable requise.'
        ],
        attachments: [
            { title: 'Role Profile', type: 'PDF', versions: [{ lang: 'EN', size: '1.2 MB', label: 'English Version' }, { lang: 'FR', size: '1.1 MB', label: 'French Version' }] },
            { title: 'Grading Report', type: 'PDF', versions: [{ lang: 'EN', size: '0.8 MB', label: 'English Version' }, { lang: 'FR', size: '0.9 MB', label: 'French Version' }] },
            { title: 'Draft ONEM Document', type: 'DOCX', versions: [{ lang: 'ALL', size: '2.4 MB', label: 'Standard Document' }] }
        ]
    },
    {
        jobCode: 'GEO-102',
        jobTitle: 'Geotechnical Technician - SHEQ',
        buCode: 'A1011104407',
        buName: '1 - SHEQ',
        buDescription: 'S-CT-C-SV-Eng-Mgmt',
        department: '04 - SHEQ',
        subDepartment: 'Technical Services',
        section: 'Geotechnical',
        deptCode: '5900',
        nationality: 'Expatriate',
        patersonGrade: 'C1',
        drcGrade: 'K-1',
        employmentCategory: 'KCSA Employee',
        contractType: 'Fixed Term',
        areaOfWork: 'Surface',
        noOfPersons: '2',
        dateRequired: '01-04-2026',
        posRequest: 'New Position Request',
        status: 'Pending with HOD to review Adv',
        grade: 'G08',
        reportsTo: 'Senior Geotechnical Engineer',
        description: 'Provide technical support for geotechnical monitoring and data collection.',
        descriptionFr: "Fournir un soutien technique pour la surveillance géotechnique et la collecte de données.",
        responsibilities: [
            'Install and monitor geotechnical instrumentation (extensometers, piezometers).',
            'Collect and process geotechnical data for analysis.',
            'Conduct regular inspections of mine workings for stability issues.',
            'Assist in the preparation of geotechnical reports.'
        ],
        responsibilitiesFr: [
            "Installer et surveiller l'instrumentation géotechnique (extensomètres, piézomètres).",
            'Collecter et traiter les données géotechniques pour analyse.',
            'Effectuer des inspections régulières des travaux miniers pour les problèmes de stabilité.',
            'Aider à la préparation de rapports géotechniques.'
        ],
        qualifications: [
            'Technical Diploma in Geology, Mining, or Geotechnical Engineering.',
            'First Aid certification.'
        ],
        qualificationsFr: [
            'Diplôme technique en géologie, mines ou génie géotechnique.',
            'Certification de secourisme.'
        ],
        experience: [
            '2-4 years of experience in a geotechnical or geological role.',
            'Familiarity with geotechnical monitoring equipment.',
            'Ability to work in challenging field environments.'
        ],
        experienceFr: [
            "2 à 4 ans d'expérience dans un rôle géotechnique ou géologique.",
            "Connaissance de l'équipement de surveillance géotechnique.",
            'Capacité à travailler dans des environnements de terrain difficiles.'
        ],
        attachments: [
            { title: 'Role Profile', type: 'PDF', versions: [{ lang: 'EN', size: '1.2 MB', label: 'English Version' }, { lang: 'FR', size: '1.1 MB', label: 'French Version' }] },
            { title: 'Grading Report', type: 'PDF', versions: [{ lang: 'EN', size: '0.8 MB', label: 'English Version' }, { lang: 'FR', size: '0.9 MB', label: 'French Version' }] },
            { title: 'Draft ONEM Document', type: 'DOCX', versions: [{ lang: 'ALL', size: '2.4 MB', label: 'Standard Document' }] }
        ]
    },
];
exports.EVALUATION_DATA = [
    { id: 1, applicantName: 'Jean-Pierre Kabila', positionTitle: 'Senior Mining Engineer', interviewDate: '2026-05-20 10:00 AM', interviewLevels: 'Level 1', grade: 'C3 Lower', status: 'Interview Scheduled' },
    { id: 2, applicantName: 'Marie-Claire Mwamba', positionTitle: 'Underground Shift Supervisor', interviewDate: '2026-05-21 02:30 PM', interviewLevels: 'Level 1', grade: 'A2', status: 'Interview Scheduled' },
    { id: 3, applicantName: 'Alphonse Tshisekedi', positionTitle: 'Geotechnical Technician', interviewDate: '2026-05-22 09:00 AM', interviewLevels: 'Level 1', grade: 'A3', status: 'Interview Scheduled' },
];
exports.CANDIDATE_SELECTION_DATA = [
    {
        id: 1, applicantName: 'Alyse E', positionTitle: 'Senior Mining Engineer', interviewLevels: 'Level 1',
        grade: 'C3 Lower', gpa: 5.0, status: 'Pending with HOD to select the candidate',
        avatar: 'https://i.pravatar.cc/150?u=alyse', nationality: 'Malian (Mali)', classification: 'Expat',
        gender: 'Female', qualification: 'BSc Mining Engineering', miningExp: '8 Years', relatedExp: '5-10 Years',
        interviewDate: '2026-03-05', conflicts: 'No', disability: 'No',
        panel: ['V-Altrocks01', 'V-Altrocks20', 'V- Altrocks 4'],
        questionnaires: [
            { id: 'Q1', q: "What are the three main financial statements, and how are they connected?", rating: '3 - Excellent', score: 3, guide: "Candidate should identify Income Statement, Balance Sheet, and Cash Flow Statement." },
            { id: 'Q2', q: "How would you evaluate a company's financial health using financial ratios?", rating: '3 - Excellent', score: 3, guide: "Look for mentions of liquidity, profitability, and leverage." }
        ],
        scores: { qualifications: '5', experience: '5', knowledge: '5', energy: '5', requirements: '5', culture: '5', expat: '5', other: '5' },
        recommendation: 'Yes', panelFeedback: 'Exceptional candidate with deep technical knowledge and strong leadership potential.'
    },
    {
        id: 2, applicantName: 'John Smith', positionTitle: 'Senior Mining Engineer', interviewLevels: 'Level 1',
        grade: 'C3 Upper', gpa: 4.8, status: 'Pending with HOD to select the candidate',
        avatar: 'https://i.pravatar.cc/150?u=john', nationality: 'South African', classification: 'Expat',
        gender: 'Male', qualification: 'BTech Mining', miningExp: '10 Years', relatedExp: '10+ Years',
        interviewDate: '2026-03-04', conflicts: 'No', disability: 'No',
        panel: ['V-Altrocks01', 'V-Altrocks20'],
        questionnaires: [
            { id: 'Q1', q: "What are the three main financial statements, and how are they connected?", rating: '3 - Excellent', score: 3, guide: "Candidate should identify Income Statement, Balance Sheet, and Cash Flow Statement." },
            { id: 'Q2', q: "How would you evaluate a company's financial health using financial ratios?", rating: '2 - Acceptable', score: 2, guide: "Look for mentions of liquidity, profitability, and leverage." }
        ],
        scores: { qualifications: '5', experience: '5', knowledge: '4', energy: '5', requirements: '5', culture: '4', expat: '5', other: '4' },
        recommendation: 'Yes', panelFeedback: 'Very strong technical background, good fit for the current team structure.'
    },
    {
        id: 3, applicantName: 'Sarah Johnson', positionTitle: 'Senior Mining Engineer', interviewLevels: 'Level 1',
        grade: 'B4', gpa: 4.5, status: 'Pending with HOD to select the candidate',
        avatar: 'https://i.pravatar.cc/150?u=sarah', nationality: 'Australian', classification: 'Expat',
        gender: 'Female', qualification: 'MSc Mining Engineering', miningExp: '6 Years', relatedExp: '5-8 Years',
        interviewDate: '2026-03-03', conflicts: 'No', disability: 'No',
        panel: ['V-Altrocks01', 'V-Altrocks04'],
        questionnaires: [
            { id: 'Q1', q: "What are the three main financial statements, and how are they connected?", rating: '2 - Acceptable', score: 2, guide: "Candidate should identify Income Statement, Balance Sheet, and Cash Flow Statement." },
            { id: 'Q2', q: "How would you evaluate a company's financial health using financial ratios?", rating: '3 - Excellent', score: 3, guide: "Look for mentions of liquidity, profitability, and leverage." }
        ],
        scores: { qualifications: '4', experience: '4', knowledge: '5', energy: '4', requirements: '5', culture: '5', expat: '4', other: '4' },
        recommendation: 'Yes', panelFeedback: 'Highly analytical and detail-oriented. Excellent communication skills.'
    },
    {
        id: 4, applicantName: 'Michael Chen', positionTitle: 'Senior Mining Engineer', interviewLevels: 'Level 1',
        grade: 'C2', gpa: 4.2, status: 'Pending with HOD to select the candidate',
        avatar: 'https://i.pravatar.cc/150?u=michael', nationality: 'Democratic Republic of the Congo', classification: 'Congolese',
        gender: 'Male', qualification: 'BSc Mining', miningExp: '5 Years', relatedExp: '3-5 Years',
        interviewDate: '2026-03-02', conflicts: 'No', disability: 'No',
        panel: ['V-Altrocks20', 'V- Altrocks 4'],
        questionnaires: [
            { id: 'Q1', q: "What are the three main financial statements, and how are they connected?", rating: '2 - Acceptable', score: 2, guide: "Candidate should identify Income Statement, Balance Sheet, and Cash Flow Statement." },
            { id: 'Q2', q: "How would you evaluate a company's financial health using financial ratios?", rating: '2 - Acceptable', score: 2, guide: "Look for mentions of liquidity, profitability, and leverage." }
        ],
        scores: { qualifications: '4', experience: '4', knowledge: '4', energy: '4', requirements: '4', culture: '4', expat: '4', other: '4' },
        recommendation: 'Yes', panelFeedback: 'Solid performer with good potential. Needs some mentoring on strategic planning.'
    }
];
//# sourceMappingURL=data.js.map