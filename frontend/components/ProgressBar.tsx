interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  const steps = [
    { num: 1, label: 'نوع الحساب' },
    { num: 2, label: 'البيانات الشخصية' },
    { num: 3, label: 'كلمة المرور' },
    { num: 4, label: 'التسديد' },
    { num: 5, label: 'توثيق رقم الهاتف' },
    { num: 6, label: 'إتمام التسجيل' },
  ];

  return (
    <div className="mb-8">
      {/* Step circles */}
      <div className="flex justify-between items-start mb-8 relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 -z-10" />
        <div 
          className="absolute top-6 left-0 h-0.5 bg-[#0876b1] -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                step.num === currentStep
                  ? 'bg-[#0876b1] text-white ring-4 ring-blue-200'
                  : step.num < currentStep
                  ? 'bg-[#0876b1] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.num}
            </div>
            <span className={`text-xs text-center ${
              step.num === currentStep ? 'font-bold text-gray-800' : 'text-gray-600'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
