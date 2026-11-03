import { Check, Plus, Minus, X } from 'lucide-react';
import { useState } from 'react';
import { PublicLayout } from "@/components/marketing/layout/public-layout";

const PricingCard = ({ plan, price, features, description, isPremium = false }) => (
    <div
        className={`plan-card relative flex flex-col p-8 rounded-2xl transition-all duration-300 w-full max-w-sm border
      ${isPremium
            ? 'bg-[#1a2332] text-white border-[#1a2332] shadow-xl z-10'
            : 'bg-white text-gray-900 border-gray-100 shadow-sm'
        }`}
    >
        <div className="mb-6">
            <h3 className="text-xl font-bold">{plan}</h3>
            <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">₦{price}</span>
                <span className={`ml-1 text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>/term</span>
            </div>
            <p className={`mt-2 text-sm leading-6 ${isPremium ? 'text-gray-300' : 'text-gray-500'}`}>
                {description}
            </p>
        </div>

        <div className={`h-px w-full mb-8 ${isPremium ? 'bg-gray-700' : 'bg-gray-100'}`} />

        <ul className="space-y-4 mb-10 flex-1">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm gap-3">
                    <Check aria-label="Included" role="img" className={`h-4 w-4 flex-shrink-0 mt-0.5 $text-[#0a61a4]`} />
                    <span className={isPremium ? 'text-gray-200' : 'text-gray-600'}>{feature}</span>
                </li>
            ))}
        </ul>


    </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-6">
            <button
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center gap-4 text-left hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                {isOpen ? <Minus className="h-6 w-6 text-gray-500" /> : <Plus className="h-6 w-6 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const ComparisonSection = ({ title, items }) => (
    <div className="mb-0">
        <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 px-6 items-center hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="flex justify-center md:justify-center">
                        {item.basic === true ? (
                            <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4]" />
                        ) : item.basic === false ? (
                            <X aria-label="Not included" role="img" className="h-5 w-5 text-gray-300" />
                        ) : (
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.basic}</span>
                        )}
                    </div>
                    <div className="flex justify-center md:justify-center">
                        {item.premium === true ? (
                            <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4]" />
                        ) : item.premium === false ? (
                            <X aria-label="Not included" role="img" className="h-5 w-5 text-gray-300" />
                        ) : (
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.premium}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TabComparisonView = () => {
    const [activeTab, setActiveTab] = useState('basic');

    const comparisonData = [
        {
            title: "User Management & Access Control",
            items: [
                { name: "Admin Dashboard & User Accounts", basic: true, premium: true },
                { name: "Secure Registration & Authentication", basic: true, premium: true },
                { name: "Role-Based Access Control", basic: true, premium: true }
            ]
        },
        {
            title: "Student & Parent Portals",
            items: [
                { name: "Student Profile Management", basic: true, premium: true },
                { name: "Parent Dashboard", basic: true, premium: true },
                { name: "Multi-Child Access", basic: true, premium: true }
            ]
        },
        {
            title: "Academic Management",
            items: [
                { name: "Class & Subject Management", basic: true, premium: true },
                { name: "Basic Gradebook", basic: true, premium: "Advanced with Weighted Grading" },
                { name: "Attendance Tracking", basic: "Manual", premium: "Manual" },
                { name: "Automated Report Card Generation", basic: false, premium: true },
                { name: "Online Assignments & Submissions", basic: false, premium: true },
                { name: "Exam & Timetable Management", basic: false, premium: true },
                { name: "Transcript Generation", basic: false, premium: true }
            ]
        },
        {
            title: "Teacher Dashboard",
            items: [
                { name: "Class & Student Lists", basic: true, premium: true },
                { name: "Profile Management", basic: true, premium: true }
            ]
        },
        {
            title: "Communication & Collaboration",
            items: [
                { name: "Internal Messaging System", basic: false, premium: true },
                { name: "School-wide Announcements (Portal, Email, SMS)", basic: false, premium: true },
                { name: "Parent-Teacher Meeting Scheduler", basic: false, premium: true },
                { name: "Digital Notice Board", basic: false, premium: true }
            ]
        },
        {
            title: "Analytics & Insights",
            items: [
                { name: "Basic Analytics (Accounts, Activity, Enrollment)", basic: true, premium: true },
                { name: "Student Performance Analytics", basic: false, premium: true },
                { name: "Teacher Performance Review", basic: false, premium: true },
                { name: "Enrollment & Admissions Analytics", basic: false, premium: true },
                { name: "Predictive Analytics (AI-Driven)", basic: false, premium: true }
            ]
        },
        {
            title: "Customization & Data",
            items: [
                { name: "Custom Branding (Logo, Colors, Domain)", basic: false, premium: true },
                { name: "Data Import/Export", basic: false, premium: true }
            ]
        },
        {
            title: "Support & Onboarding",
            items: [
                { name: "Onboarding & Training", basic: true, premium: true },
                { name: "Dedicated Account Manager", basic: false, premium: true },
                { name: "Priority Support", basic: false, premium: true }
            ]
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Detailed Feature Comparison</h2>
                <p className="text-gray-600">Everything you need to choose the right plan for your school</p>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className="grid grid-cols-3 gap-4 py-4 px-6 bg-[#1a2332] text-white font-semibold border-b border-gray-200 sticky top-0">
                    <div>Feature</div>
                    <div className="text-center">Basic</div>
                    <div className="text-center">Premium</div>
                </div>
                <div>
                    {comparisonData.map((section, idx) => (
                        <ComparisonSection
                            key={idx}
                            title={section.title}
                            items={section.items}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile View with Tabs */}
            <div className="md:hidden">
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        aria-pressed={activeTab === 'basic'}
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 py-4 px-6 text-center font-semibold text-sm transition-colors ${
                            activeTab === 'basic'
                                ? 'text-[#1a2332] border-b-2 border-[#1a2332] bg-white'
                                : 'text-gray-600 border-b-2 border-transparent'
                        }`}
                    >
                        Basic Plan
                    </button>
                    <button
                        aria-pressed={activeTab === 'premium'}
                        onClick={() => setActiveTab('premium')}
                        className={`flex-1 py-4 px-6 text-center font-semibold text-sm transition-colors ${
                            activeTab === 'premium'
                                ? 'text-[#104889] border-b-2 border-[#104889] bg-white'
                                : 'text-gray-600 border-b-2 border-transparent'
                        }`}
                    >
                        Premium Plan
                    </button>
                </div>

                <div className="divide-y divide-gray-200">
                    {comparisonData.map((section, idx) => (
                        <div key={idx} className="mb-0">
                            <div className="bg-gray-50 py-3 px-6 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                            </div>
                            <div>
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="border-b border-gray-200 py-4 px-6">
                                        <div className="font-medium text-gray-900 mb-3 text-sm">{item.name}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-600 text-xs font-semibold uppercase w-20">
                                                Included
                                            </span>
                                            <div className="flex-1 flex justify-start">
                                                {activeTab === 'basic' ? (
                                                    item.basic === true ? (
                                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4]" />
                                                    ) : item.basic === false ? (
                                                        <X aria-label="Not included" role="img" className="h-5 w-5 text-gray-300" />
                                                    ) : (
                                                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-xs">{item.basic}</span>
                                                    )
                                                ) : (
                                                    item.premium === true ? (
                                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4]" />
                                                    ) : item.premium === false ? (
                                                        <X aria-label="Not included" role="img" className="h-5 w-5 text-gray-300" />
                                                    ) : (
                                                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-xs">{item.premium}</span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PricingPage = () => {
    return (
        <PublicLayout title="Pricing" className="pricing-site">

            <div className="pricing-page section">
                <div className="container">
                    {/* Hero Section */}
                    <div className="pricing-intro text-center mb-20">
                        <h1 className="text-4xl md:text-5xl font-black text-[#1a2332] mb-4 leading-tight">
                            The Right Plan for Your School
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                            EduConnect offers powerful, easy-to-use tools to streamline your school's administration, enhance communication, and improve learning outcomes. Choose the plan that best fits your institution's needs and budget.
                        </p>
                    </div>

                    {/* Key Differentiators */}
                    <div className="mb-20 grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="text-2xl font-bold text-[#1a2332] mb-2">Fast Implementation</div>
                            <p className="text-gray-600 text-sm leading-relaxed">Get your school up and running with our comprehensive onboarding and training support</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="text-2xl font-bold text-[#1a2332] mb-2">Role-Based Security</div>
                            <p className="text-gray-600 text-sm leading-relaxed">Control who sees what with granular role-based access control across all user types</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="text-2xl font-bold text-[#1a2332] mb-2">Scalable Solution</div>
                            <p className="text-gray-600 text-sm leading-relaxed">Start with Basic and grow into Premium as your school's needs evolve</p>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mb-20">
                        <PricingCard
                            plan="Basic"
                            price="150,000"
                            description="For schools needing core digital tools"
                            features={basicHighlights}
                        />
                        <PricingCard
                            plan="Premium"
                            price="350,000"
                            description="Complete solution with automation and analytics"
                            features={premiumHighlights}
                            isPremium={true}
                        />
                    </div>

                    {/* Detailed Comparison with Responsive Design */}
                    <div className="mb-20">
                        <TabComparisonView />
                    </div>

                    {/* Plan Selection Guide */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Choose Your Plan</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-sm font-bold">B</div>
                                    Choose Basic If...
                                </h3>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>You're transitioning from paper-based or spreadsheet management</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>Your school has fewer than 500 students</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>You need core features without advanced automation</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>Affordability is a primary consideration</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-[#1a2332] text-white p-8 rounded-xl border border-[#1a2332]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-[#104889] flex items-center justify-center text-sm font-bold">P</div>
                                    Choose Premium If...
                                </h3>
                                <ul className="space-y-3 text-gray-300 text-sm">
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>You want full automation of academic processes</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>You need advanced analytics to drive decisions</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>Parent-teacher communication is a priority</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check aria-label="Included" role="img" className="h-5 w-5 text-[#0a61a4] flex-shrink-0 mt-0.5" />
                                        <span>You want a dedicated account manager and priority support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
                        <div className="max-w-4xl mx-auto space-y-0">
                            <FaqItem
                                question="Can I change my plan later?"
                                answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll pay a prorated amount for the remainder of the term. If you downgrade, the changes will take effect at the beginning of the next term. Our team can walk you through the transition process."
                            />
                            <FaqItem
                                question="Is there a discount for annual billing?"
                                answer="We currently offer billing on a per-term basis. However, schools that commit to annual contracts may be eligible for special pricing. Please contact our sales team to discuss volume discounts and multi-year agreements that might benefit your institution."
                            />
                            <FaqItem
                                question="Can we get a demo of both plans?"
                                answer="Absolutely! We would be happy to provide a personalized demo tailored to your school's specific needs. Our product team can showcase features most relevant to your administrative workflows. Please contact us to schedule a session at a time that works for you."
                            />
                            <FaqItem
                                question="How long does implementation take?"
                                answer="Most schools are up and running within 2-4 weeks depending on data volume and customization needs. We handle the complete onboarding process and provide comprehensive training to ensure your team is confident using the platform."
                            />
                            <FaqItem
                                question="Can parents and teachers access their portals on mobile?"
                                answer="Yes, both the Basic and Premium plans include fully responsive portals that work seamlessly on smartphones, tablets, and desktop computers. Teachers and parents can access their accounts anytime, anywhere."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const basicHighlights = [
    "Admin Dashboard & User Management",
    "Student & Parent Portals",
    "Class & Subject Management",
    "Basic Gradebook & Attendance",
    "Teacher Dashboard",
    "School Profile Management",
    "Basic Analytics",
    "Comprehensive Onboarding & Training"
];

const premiumHighlights = [
    "All Basic Plan Features",
    "Automated Report Cards & Transcripts",
    "Advanced Gradebook with Weighted Grading",
    "Online Assignments & Submissions",
    "Exam & Timetable Management",
    "Internal Messaging & Announcements",
    "Parent-Teacher Meeting Scheduler",
    "Advanced Analytics & Predictive Insights",
    "Custom Branding & Data Import/Export",
    "Dedicated Account Manager & Priority Support"
];