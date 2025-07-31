'use client';
import { FaSpinner, FaRocket } from 'react-icons/fa';

interface LoadingProps {
  message?: string;
  progress?: number;
}

export default function Loading({ message = "Sedang crawling website...", progress }: LoadingProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 border border-purple-500/30 shadow-2xl">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
              <FaRocket className="text-white text-2xl animate-bounce" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
          </div>

          {/* Loading Text */}
          <h3 className="text-xl font-semibold text-white mb-3">
            Crawling Website
          </h3>
          <p className="text-gray-300 mb-4 text-sm">
            {message}
          </p>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          )}

          {/* Spinner */}
          <div className="flex items-center justify-center space-x-2 text-purple-300">
            <FaSpinner className="animate-spin" />
            <span className="text-sm">Mohon tunggu sebentar...</span>
          </div>

          {/* Tips */}
          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 Tip: Website dengan banyak halaman membutuhkan waktu lebih lama
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
