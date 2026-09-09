/**
 * The one source of truth for job listings.
 *
 * careers-list.html and job-details.html each used to carry their own copy of
 * this array, which had already drifted: every posted date and every prose
 * field disagreed between the two. Both pages now read from here, so a listing
 * is edited once.
 *
 * Set isActive to false to retire a role. The list page hides it, and the detail
 * page still resolves the id but swaps the apply section for a closed-role
 * banner, so an old link explains itself instead of 404ing or taking
 * applications nobody will read.
 */
window.DLIGHTNING_JOBS = [
    {
        id: 1,
        title: "Experience Designer Intern",
        department: "Design",
        employmentType: "Internship",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Join our product development team and contribute to features that enhance user experience. Gain hands-on startup experience from ideation to execution.",
        description: "At Dlightning⚡ we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This part-time remote role for an Intern at Dlightning. The Intern will be responsible for assisting with various day-to-day tasks and projects to support the team's objectives. As an intern at Dlightning, you'll have the unique opportunity to work closely with our product development team, contributing to the design and implementation of features that enhance the user experience. You'll gain hands-on experience in the startup environment, learning about the full cycle of product development—from ideation to execution.",
        responsibilities: [
            "Design thinking and user research",
            "Visual design and user experience (UX) design",
            "Prototyping and wireframing",
            "Collaborating with product development team",
            "Contributing to feature design and implementation",
            "Learning the full product development cycle"
        ],
        qualifications: [
            "Design Thinking and User Research skills",
            "Visual Design and User Experience (UX) skills",
            "Prototyping skills",
            "Strong creativity and problem-solving abilities",
            "Excellent communication and collaboration skills",
            "Ability to work independently and as part of a team",
            "Pursuing a degree in Design, Human-Computer Interaction, or related field",
            "Passionate about startups, innovation, and user experience design",
            "Eagerness to learn and take on new challenges"
        ],
        benefits: [
            "Work directly with experienced entrepreneurs and product developers",
            "Gain valuable experience in a fast-paced, innovative environment",
            "Flexible working hours and remote work options",
            "Opportunity to make a tangible impact on the success of a growing startup",
            "Potential for full-time opportunities after the internship"
        ],
        salaryRange: "Unpaid (Academic Credit Available)",
        applicationDeadline: "2026-12-31",
        contactEmail: "dlightningexperience@gmail.com",
        datePosted: "2026-06-09",
        isActive: true
    },
    {
        id: 2,
        title: "Senior Product Designer",
        department: "Design",
        employmentType: "Full-time",
        location: "Remote",
        experienceLevel: "Senior Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Lead the design vision for our platform and mentor junior designers. Drive user-centered design across all product touchpoints.",
        description: "Lead the design vision for our platform and shape the future of innovation tools. Drive user-centered design across all product touchpoints while mentoring the next generation of designers.",
        roleDescription: "As a Senior Product Designer at Dlightning, you'll be responsible for leading the design strategy and execution for our core platform. You'll work closely with product managers, engineers, and stakeholders to create intuitive, beautiful experiences that help entrepreneurs validate and develop their ideas. This role combines strategic thinking with hands-on design work.",
        responsibilities: [
            "Lead design strategy and vision for core platform features",
            "Conduct user research and usability testing",
            "Create wireframes, prototypes, and high-fidelity designs",
            "Collaborate with engineering teams on implementation",
            "Mentor junior designers and interns",
            "Develop and maintain design systems",
            "Present design concepts to stakeholders"
        ],
        qualifications: [
            "5+ years of product design experience",
            "Strong portfolio showcasing successful digital products",
            "Expertise in design tools (Figma, Sketch, etc.)",
            "Experience with design systems and component libraries",
            "Understanding of front-end development constraints",
            "Excellent communication and presentation skills",
            "Experience in startup or fast-paced environments",
            "Bachelor's degree in Design, HCI, or related field"
        ],
        benefits: [
            "Competitive salary ($90,000 - $120,000)",
            "Equity compensation",
            "Full health, dental, and vision insurance",
            "Flexible PTO in a fully remote, remote-first team",
            "Professional development budget ($2,000/year)",
            "Latest design tools and equipment provided"
        ],
        salaryRange: "$90,000 - $120,000",
        applicationDeadline: "2026-12-31",
        contactEmail: "dlightningexperience@gmail.com",
        datePosted: "2026-06-04",
        isActive: true
    },
    {
        id: 3,
        title: "Frontend Developer",
        department: "Engineering",
        employmentType: "Full-time",
        location: "Remote",
        experienceLevel: "Mid Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Build and maintain our web platform using modern JavaScript frameworks. Collaborate closely with designers to create exceptional user experiences.",
        description: "Build and maintain our web platform using modern JavaScript frameworks. Work closely with designers to create exceptional user experiences that help entrepreneurs succeed.",
        roleDescription: "As a Frontend Developer at Dlightning, you'll be responsible for implementing user-facing features and ensuring our platform delivers a smooth, responsive experience. You'll work in a collaborative environment with designers, backend developers, and product managers to bring innovative ideas to life.",
        responsibilities: [
            "Develop responsive web applications using React/Vue.js",
            "Collaborate with designers to implement pixel-perfect UIs",
            "Optimize application performance and user experience",
            "Write clean, maintainable, and well-tested code",
            "Participate in code reviews and technical discussions",
            "Stay current with frontend technologies and best practices",
            "Contribute to technical architecture decisions"
        ],
        qualifications: [
            "3+ years of frontend development experience",
            "Strong proficiency in JavaScript (ES6+), HTML5, CSS3",
            "Experience with React, Vue.js, or similar frameworks",
            "Knowledge of responsive design and cross-browser compatibility",
            "Experience with version control (Git) and CI/CD",
            "Understanding of web performance optimization",
            "Strong problem-solving and debugging skills",
            "Bachelor's degree in Computer Science or equivalent experience"
        ],
        benefits: [
            "Remote-first culture with flexible hours",
            "Competitive salary ($70,000 - $95,000)",
            "Equity participation",
            "Health insurance and wellness benefits",
            "Learning and development budget",
            "Latest development tools and equipment"
        ],
        salaryRange: "$70,000 - $95,000",
        applicationDeadline: "2026-12-31",
        contactEmail: "dlightningexperience@gmail.com",
        datePosted: "2026-06-02",
        isActive: true
    },
    {
        id: 4,
        title: "Marketing Communications Intern",
        department: "Marketing",
        employmentType: "Internship",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Join our marketing team to help amplify Dlightning's mission and connect with innovators worldwide. Craft compelling narratives and develop content strategies.",
        description: "Join our marketing team to help amplify Dlightning's mission and connect with innovators worldwide. You'll craft compelling narratives, develop content strategies, and learn the fundamentals of startup marketing in a fast-paced environment.",
        roleDescription: "This part-time remote internship offers hands-on experience in marketing communications at a growing startup. You'll work closely with our marketing team to develop and execute campaigns that showcase how Dlightning empowers entrepreneurs to validate ideas and achieve product-market fit. From content creation to social media strategy, you'll gain exposure to all aspects of marketing communications while contributing to our mission of supporting innovation worldwide.",
        responsibilities: [
            "Create engaging content for social media, blog posts, and marketing materials",
            "Assist in developing and executing email marketing campaigns",
            "Support content strategy development and editorial calendar planning",
            "Conduct research on target audiences and market trends",
            "Help manage social media presence across multiple platforms",
            "Assist with event planning and promotional activities",
            "Collaborate with design team on visual marketing assets",
            "Monitor and analyze marketing campaign performance metrics"
        ],
        qualifications: [
            "Pursuing a degree in Marketing, Communications, Journalism, or related field",
            "Strong writing and communication skills with attention to detail",
            "Basic understanding of social media platforms and digital marketing",
            "Creative mindset with ability to think outside the box",
            "Familiarity with content management systems and basic design tools",
            "Analytical skills to interpret marketing metrics and data",
            "Passionate about startups, entrepreneurship, and innovation",
            "Self-motivated with ability to work independently in remote environment",
            "Eagerness to learn and adapt in a fast-paced startup setting"
        ],
        benefits: [
            "Gain hands-on experience in all aspects of startup marketing",
            "Work directly with experienced marketing professionals and entrepreneurs",
            "Flexible working hours that accommodate academic schedule",
            "Remote work environment with collaborative team culture",
            "Opportunity to see direct impact of your work on company growth",
            "Professional development and mentorship opportunities",
            "Potential for full-time position upon graduation",
            "Build portfolio of real marketing campaigns and content"
        ],
        salaryRange: "Academic Credit Available / Stipend Considered",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-14",
        isActive: true
    },
    {
        id: 5,
        title: "Product Development Apprentice",
        department: "Operations",
        employmentType: "Full-time",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Launch your career in product development with a comprehensive apprenticeship program. Rotate through teams and learn from experienced professionals.",
        description: "Launch your career in product development with a comprehensive apprenticeship program. You'll rotate through different teams, learn from experienced professionals, and contribute to building tools that help entrepreneurs succeed.",
        roleDescription: "This full-time remote apprenticeship is designed for recent graduates or career changers who want to break into product development. Over 12 months, you'll work alongside our product team, engineering team, and design team to understand the complete product lifecycle. You'll contribute to meaningful projects while receiving structured mentorship and professional development opportunities that prepare you for a successful career in tech.",
        responsibilities: [
            "Rotate through product, engineering, and design teams to gain comprehensive experience",
            "Collaborate with product managers to conduct user research and competitive analysis",
            "Assist in feature development from conception through implementation",
            "Support quality assurance testing and user acceptance testing processes",
            "Help maintain product documentation and user guides",
            "Participate in daily standups, sprint planning, and retrospective meetings",
            "Contribute to product roadmap discussions and strategic planning sessions",
            "Assist with customer feedback analysis and feature prioritization",
            "Support data analysis initiatives to inform product decisions"
        ],
        qualifications: [
            "Bachelor's degree in Computer Science, Design, Business, or related field (or equivalent experience)",
            "Strong analytical and problem-solving abilities",
            "Basic understanding of product development methodologies (Agile/Scrum preferred)",
            "Excellent written and verbal communication skills",
            "Demonstrated interest in startups, technology, and innovation",
            "Ability to work effectively in cross-functional teams",
            "Detail-oriented with strong organizational skills",
            "Adaptability and eagerness to learn new technologies and processes",
            "Self-motivated with ability to take initiative in remote work environment"
        ],
        benefits: [
            "Comprehensive 12-month structured learning program",
            "Direct mentorship from senior product and engineering professionals",
            "Competitive salary with performance-based increases",
            "Full health, dental, and vision insurance coverage",
            "Professional development budget for courses and conferences",
            "Flexible PTO and work-from-home setup allowance",
            "Clear path to full-time product role upon successful completion",
            "Opportunity to work on products used by entrepreneurs worldwide",
            "Exposure to all aspects of startup operations and growth"
        ],
        salaryRange: "$45,000 - $55,000 (with progression potential)",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-12",
        isActive: true
    },
    {
        id: 6,
        title: "User Research Intern",
        department: "Design",
        employmentType: "Internship",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Help us understand our users better by conducting research that directly informs product decisions. Learn user research methodologies while contributing to product improvements.",
        description: "At Dlightning⚡, we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative at each stage, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This part-time remote internship offers hands-on experience in user research at a growing startup focused on innovation and entrepreneurship. You'll work directly with our product and design teams to understand how entrepreneurs use our platform, what challenges they face, and how we can better serve their needs. This role provides comprehensive exposure to user research methodologies while contributing to real product decisions that impact thousands of innovators worldwide.",
        responsibilities: [
            "Conduct user interviews with entrepreneurs to understand their validation challenges",
            "Design and distribute surveys to gather quantitative user feedback",
            "Assist in planning and executing usability testing sessions for new features",
            "Analyze user behavior data and identify patterns in platform usage",
            "Create detailed user personas based on research findings",
            "Develop user journey maps highlighting pain points and opportunities",
            "Compile research insights into clear, actionable reports for product team",
            "Support A/B testing initiatives and analyze results for statistical significance",
            "Maintain organized repository of user research findings and methodologies"
        ],
        qualifications: [
            "Currently pursuing degree in Psychology, Human-Computer Interaction, Design, or related field",
            "Basic understanding of qualitative and quantitative research methodologies",
            "Strong analytical skills with attention to detail and pattern recognition",
            "Excellent written and verbal communication skills for presenting findings",
            "Genuine curiosity about user behavior, motivations, and decision-making processes",
            "Experience with survey tools (Google Forms, Typeform, etc.) preferred",
            "Basic knowledge of statistical analysis and data interpretation",
            "Empathy and ability to build rapport with interview participants",
            "Self-directed learning ability and eagerness to master new research tools"
        ],
        benefits: [
            "Academic credit available through university partnership programs",
            "Direct mentorship from experienced UX researchers and product team",
            "Hands-on experience with research that directly influences product decisions",
            "Flexible schedule designed to accommodate academic commitments",
            "Portfolio-building opportunities with real user research projects",
            "Professional development through exposure to startup product development",
            "Potential for extended internship and full-time offer upon graduation",
            "Access to premium research tools and platforms for learning",
            "Networking opportunities within design and research community"
        ],
        salaryRange: "Academic Credit + Potential Stipend",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-16",
        isActive: true
    },
    {
        id: 7,
        title: "Video Content Creator",
        department: "Marketing",
        employmentType: "Contract",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Create engaging video content that educates entrepreneurs and demonstrates our platform's value. From tutorials to success stories, help bring our mission to life through compelling visuals.",
        description: "At Dlightning⚡, we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative at each stage, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This contract position focuses on creating compelling video content that educates entrepreneurs and showcases the power of proper idea validation. You'll work closely with our marketing team to develop a comprehensive video content strategy, from educational tutorials to inspiring customer success stories. This role offers creative freedom to build our video marketing program from the ground up while helping entrepreneurs worldwide understand the value of validating their ideas before building.",
        responsibilities: [
            "Produce educational video tutorials demonstrating platform features and best practices",
            "Create engaging social media video content optimized for different platforms",
            "Film and edit customer success stories and case study videos",
            "Develop video content strategy aligned with marketing goals and user needs",
            "Collaborate with marketing team on promotional campaign videos",
            "Optimize video content for YouTube, LinkedIn, TikTok, and other social platforms",
            "Create animated explainer videos for complex validation concepts",
            "Manage video content calendar and ensure consistent publishing schedule",
            "Analyze video performance metrics and optimize content based on data"
        ],
        qualifications: [
            "1-2 years of video production experience with portfolio of completed projects",
            "Proficiency with video editing software (Adobe Premiere, Final Cut Pro, or similar)",
            "Understanding of social media video best practices and platform requirements",
            "Creative storytelling abilities with focus on educational and inspirational content",
            "Basic motion graphics and animation skills (After Effects preferred)",
            "Experience with video SEO and YouTube optimization",
            "Self-directed project management skills with ability to meet deadlines",
            "Understanding of entrepreneur and startup ecosystem preferred",
            "Ability to translate complex concepts into accessible visual content"
        ],
        benefits: [
            "Project-based compensation with potential for ongoing partnership",
            "Complete creative control over video strategy and content development",
            "Flexible schedule and fully remote work arrangement",
            "Opportunity to build video marketing program from the ground up",
            "Portfolio development with diverse, high-impact content types",
            "Potential equity participation with sustained high-quality contribution",
            "Professional development through exposure to startup marketing",
            "Access to premium video tools and software licensing",
            "Credit and recognition for building successful video marketing channel"
        ],
        salaryRange: "Project-Based + Performance Bonuses",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-17",
        isActive: true
    },
    {
        id: 8,
        title: "People & Culture Specialist",
        department: "Operations",
        employmentType: "Part-time",
        location: "Remote",
        experienceLevel: "Mid Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Help us build an amazing team culture and streamline our hiring process. Balance HR fundamentals with startup agility to support our growing team.",
        description: "At Dlightning⚡, we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative at each stage, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This part-time remote role combines HR fundamentals with startup agility to help us build an amazing team culture while streamlining our hiring process. As our People & Culture Specialist, you'll be instrumental in shaping how we attract, hire, and support our growing team. You'll balance the practical needs of HR administration with the cultural mission of creating an environment where innovative, passionate people can do their best work while helping entrepreneurs worldwide succeed.",
        responsibilities: [
            "Manage end-to-end recruitment process from job posting to onboarding",
            "Develop comprehensive onboarding programs for new team members",
            "Create and maintain HR policies, procedures, and employee handbook",
            "Coordinate team building activities and culture initiatives for remote team",
            "Handle employee relations, conflict resolution, and performance discussions",
            "Manage benefits administration and ensure compliance with employment regulations",
            "Support performance review processes and professional development planning",
            "Develop employer branding strategy to attract top talent",
            "Create systems for tracking team satisfaction and engagement metrics"
        ],
        qualifications: [
            "2+ years of HR or recruiting experience, preferably in startup environments",
            "Understanding of employment law basics and compliance requirements",
            "Experience with recruiting platforms and applicant tracking systems",
            "Strong interpersonal and communication skills with conflict resolution experience",
            "Ability to thrive in ambiguous, fast-changing startup environment",
            "Genuine passion for building positive, inclusive team culture",
            "Experience with remote team management and virtual culture building",
            "Problem-solving mindset with ability to create processes from scratch",
            "Discretion and professionalism in handling sensitive employee matters"
        ],
        benefits: [
            "Equity compensation package with opportunity for increased ownership",
            "Flexible part-time schedule (20-25 hours/week) with core collaboration hours",
            "Opportunity to build HR function and culture from the ground up",
            "Complete remote work flexibility with home office setup support",
            "Direct collaboration with founders on strategic people decisions",
            "Potential for full-time Chief People Officer role as team grows",
            "Professional development budget for HR certifications and training",
            "Significant impact on company culture and team member experience",
            "Access to HR tools and platforms for professional skill building"
        ],
        salaryRange: "Equity + Part-time Compensation",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-15",
        isActive: true
    },
    {
        id: 9,
        title: "Content Marketing Manager",
        department: "Marketing",
        employmentType: "Contract",
        location: "Remote",
        experienceLevel: "Mid Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Drive customer acquisition through compelling content that educates entrepreneurs and showcases the value of idea validation. Build our thought leadership in the innovation space.",
        description: "At Dlightning⚡, we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative at each stage, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This contract role focuses on driving customer acquisition through strategic content that educates entrepreneurs about the importance of idea validation. You'll develop and execute a comprehensive content marketing strategy that positions Dlightning as the go-to resource for entrepreneurs looking to validate their ideas and achieve product-market fit. Working closely with our founders and product team, you'll create content that not only drives traffic and leads but genuinely helps entrepreneurs succeed in their validation journey.",
        responsibilities: [
            "Develop and execute comprehensive content marketing strategy aligned with business goals",
            "Create high-quality, educational blog posts and in-depth guides for entrepreneurs",
            "Manage editorial calendar and ensure consistent, valuable content publication",
            "Optimize all content for SEO to drive organic traffic and lead generation",
            "Collaborate with product team to create user-focused content and case studies",
            "Analyze content performance metrics and optimize strategy based on data insights",
            "Develop and manage email marketing campaigns to nurture leads and users",
            "Create content frameworks and templates for other team members",
            "Research and develop thought leadership content on innovation and validation trends"
        ],
        qualifications: [
            "3+ years of content marketing experience, preferably in B2B SaaS or startup environment",
            "Exceptional writing skills with ability to explain complex concepts simply",
            "Strong understanding of SEO best practices and content optimization",
            "Experience with email marketing platforms and marketing automation",
            "Deep knowledge of entrepreneur and startup ecosystem challenges",
            "Proven track record of content that drives measurable business results",
            "Self-directed with ability to work independently and manage priorities",
            "Experience with content analytics tools (Google Analytics, SEMrush, etc.)",
            "Understanding of content distribution and promotion strategies"
        ],
        benefits: [
            "Significant equity compensation package with growth potential",
            "Complete flexibility in schedule and work arrangement",
            "Opportunity to build content marketing program from ground up",
            "Direct collaboration with founders on strategic content initiatives",
            "Potential for full-time role as company scales and revenue grows",
            "Professional development budget for marketing courses and conferences",
            "Credit and ownership of content marketing success and growth",
            "Access to premium marketing tools and content creation resources",
            "Networking opportunities within startup and marketing communities"
        ],
        salaryRange: "Equity Package + Performance Incentives",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-19",
        isActive: true
    },
    {
        id: 10,
        title: "Community Builder",
        department: "Marketing",
        employmentType: "Part-time",
        location: "Remote",
        experienceLevel: "Entry Level",
        // Card blurb on careers-list.html. Kept separate from description,
        // which opens the detail page and leads with the company, not the role.
        summary: "Foster a thriving community of entrepreneurs and innovators around Dlightning. Engage with users, facilitate discussions, and help build the support network that drives customer success.",
        description: "At Dlightning⚡, we're on a mission to empower innovators by helping them quickly validate business ideas and achieve product-market fit. Our platform guides users through refining their product narrative at each stage, ensuring that great ideas turn into successful ventures. We're passionate about creativity, innovation, and making an impact on the world through social-entrepreneurship.",
        roleDescription: "This part-time remote role for a Community Builder at Dlightning focuses on fostering a thriving ecosystem of entrepreneurs and innovators. You'll be the voice and heart of our community, engaging with users across various platforms and creating meaningful connections that drive both user success and business growth. As our Community Builder, you'll have the opportunity to shape how thousands of entrepreneurs interact with our platform and with each other, building the supportive network that's essential for startup success.",
        responsibilities: [
            "Engage authentically with users across social media platforms, forums, and community spaces",
            "Facilitate meaningful online discussions and moderate community conversations",
            "Organize and host virtual events, workshops, and networking sessions for entrepreneurs",
            "Create and maintain community guidelines that foster positive, productive interactions",
            "Gather user feedback, success stories, and feature requests from community interactions",
            "Support new user onboarding through community channels and peer connections",
            "Collaborate with content team to amplify user-generated content and success stories",
            "Monitor community health metrics and report on engagement trends",
            "Identify and nurture community champions and brand advocates"
        ],
        qualifications: [
            "1-2 years of community building, social media, or customer engagement experience",
            "Excellent written and verbal communication skills with authentic, engaging voice",
            "Deep understanding of entrepreneur mindset, challenges, and motivations",
            "Experience with community platforms (Discord, Slack, Reddit, LinkedIn groups)",
            "Creative event planning and facilitation abilities for virtual environments",
            "Strong empathy and ability to build genuine relationships with diverse users",
            "Self-motivated with ability to work independently in remote environment",
            "Passion for helping entrepreneurs and small business owners succeed",
            "Basic understanding of startup ecosystem and product development"
        ],
        benefits: [
            "Flexible part-time schedule (15-20 hours/week) with core collaboration hours",
            "Equity participation with opportunity to grow stake as company expands",
            "Complete remote work flexibility with home office setup support",
            "Direct mentorship from marketing team and founders",
            "Opportunity to build and shape community strategy from the ground up",
            "Professional development budget for community management courses",
            "Access to startup events and networking opportunities",
            "Clear path to full-time Community Lead role as we scale",
            "Build extensive network within entrepreneur and startup community"
        ],
        salaryRange: "Equity + Performance Bonuses",
        applicationDeadline: "2026-12-31",
        contactEmail: "careers@dlightning.org",
        datePosted: "2026-06-18",
        isActive: true
    }
];
