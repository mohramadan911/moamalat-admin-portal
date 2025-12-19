interface QuickActionsProps {
  instanceUrl: string;
}

export default function QuickActions({ instanceUrl }: QuickActionsProps) {
  const handleOpenMoamalat = () => {
    window.open(instanceUrl, '_blank', 'noopener,noreferrer');
  };

  const actions = [
    {
      name: 'Open MOAMALAT',
      description: 'Access your MOAMALAT business application',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      action: handleOpenMoamalat,
      primary: true
    },
    {
      name: 'Manage Users',
      description: 'Add or remove team members',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      action: () => alert('User management coming soon!'),
      primary: false
    },
    {
      name: 'View Usage',
      description: 'Detailed usage analytics and reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => alert('Detailed usage analytics coming soon!'),
      primary: false
    },
    {
      name: 'Upgrade Plan',
      description: 'Upgrade to unlock more features',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      action: () => alert('Plan upgrade coming soon!'),
      primary: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
              action.primary
                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                action.primary ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${
                  action.primary ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
