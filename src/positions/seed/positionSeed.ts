export const seedPositions = [
    {
        name: 'CEO',
        description: 'Chief Executive Officer',
        children: [
            {
                name: 'CTO',
                description: 'Chief Technology Officer',
                children: [
                    {
                        name: 'Project Manager',
                        description: 'Manages projects',
                        children: [
                            { name: 'Frontend Developer', description: 'Develops front-end' },
                            { name: 'Backend Developer', description: 'Develops back-end' },
                            { name: 'UI/UX Developer', description: 'Develops UI/UX' },
                        ]
                    }
                ]
            },
            {
                name: 'CFO',
                description: 'Chief Financial Officer',
                children: [
                    {
                        name: 'Chef Accountant',
                        description: 'Head of accounting',
                        children: [
                            { name: 'Financial Analyst', description: 'Analyzes finance' },
                            { name: 'Account and Payable', description: 'Handles payments' }
                        ]
                    },
                    { name: 'Internal Audit', description: 'Audits finance' }
                ]
            }
        ]
    }
];
