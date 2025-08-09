'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Doctor } from '../../types/medical';
import { DoctorService } from '../../services/doctorService';
import { departmentNames } from '../../data/departments';
import { DataTransformers } from '../../utils/dataTransformers';

export default function DoctorList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'wait' | 'experience'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalId = searchParams.get('hospitalId') || '1';

  useEffect(() => {
    setMounted(true);
    // Load doctors data
    const doctorsData = DoctorService.getAllDoctors().map(DataTransformers.transformDoctorForDisplay);
    setDoctors(doctorsData);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const filteredDoctors = DoctorService.searchDoctors({
    department: selectedDepartment === 'All Departments' ? undefined : selectedDepartment
  });
  
  const filteredAndSortedDoctors = DoctorService.sortDoctors(filteredDoctors, sortBy).map(DataTransformers.transformDoctorForDisplay);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    // Navigate to appointment booking
    const params = new URLSearchParams({
      hospitalId,
      hospitalName,
      doctorId: doctor.id.toString(),
      doctorName: doctor.name,
      specialty: doctor.specialty
    });
    router.push(`/appointment-booking?${params.toString()}`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Doctor Selection</h1>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Hospital Info */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">{hospitalName}</h2>
          <p className="text-gray-600">Outram Road</p>
        </div>
      </div>

      {/* Filters & Sorting - Collapsible */}
      <div className={`bg-white border-b border-gray-100 transition-all duration-300 overflow-hidden ${
        showFilters ? 'max-h-96 opacity-100' : 'max-h-20 opacity-100'
      }`}>
        {/* Department Filter */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">Available Doctors</h3>
          <button
            onClick={() => setSelectedDepartment('All Departments')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Change Department
          </button>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 space-y-4 animate-slideDown">
            {/* Department Tabs */}
            <div className="flex overflow-x-auto pb-2">
              {departmentNames.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full mr-3 transition-all duration-200 font-medium whitespace-nowrap text-sm ${
                    selectedDepartment === dept
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex space-x-3">
              <span className="text-sm font-medium text-gray-700 py-2">Sort by:</span>
              {[
                { key: 'rating', label: 'Rating' },
                { key: 'wait', label: 'Wait Time' },
                { key: 'experience', label: 'Experience' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as typeof sortBy)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortBy === option.key
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Doctor Cards */}
      <div className="px-4 py-6 space-y-4">
        {filteredAndSortedDoctors.map((doctor, index) => (
          <div
            key={doctor.id}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-slideUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              {/* Doctor Header */}
              <div className="flex items-start space-x-4 mb-4">
                {/* Doctor Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Doctor Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{DataTransformers.standardizeExperience(doctor.experience)}</span>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectDoctor(doctor)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Select
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900">{doctor.patientsInQueue}</span>
                  </div>
                  <div className="text-xs text-gray-500">In Queue</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">{DataTransformers.standardizeWaitTime(doctor.estimatedWait)}</span>
                  </div>
                  <div className="text-xs text-gray-500">Est. Wait</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">{doctor.availableSlots.length}</span>
                  </div>
                  <div className="text-xs text-gray-500">Slots Available</div>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
                <div className="flex flex-wrap gap-1">
                  {doctor.languages.map((lang, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Time Slots */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Next Available Slots:</p>
                <div className="flex space-x-2">
                  {doctor.availableSlots.slice(0, 3).map((slot, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}