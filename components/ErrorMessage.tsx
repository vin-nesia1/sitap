import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ message, onClose, type = 'error' }: ErrorMessageProps) {
  const getConfig = () => {
    switch (type) {
      case 'warning':
        return {
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          textColor: 'text-yellow-300',
          icon: FaExclamationTriangle,
          iconColor: 'text-yellow-400'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-300',
          icon: FaInfoCircle,
          iconColor: 'text-blue-400'
        };
      default:
        return {
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          textColor: 'text-red-300',
          icon: FaExclamationTriangle,
          iconColor: 'text-red-400'
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-4 animate-in slide-in-from-top duration-300`}>
      <div className="flex items-start space-x-3">
        <IconComponent className={`${config.iconColor} text-lg mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <p className={`${config.textColor} text-sm leading-relaxed`}>
            {message}
          </p>
          
          {type === 'error' && (
            <div className="mt-3 text-xs text-gray-400">
              <p>💡 Tips untuk mengatasi error:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Pastikan URL menggunakan https:// atau http://</li>
                <li>Cek apakah website dapat diakses dari browser</li>
                <li>Beberapa website memblokir bot crawler</li>
              </ul>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
}
