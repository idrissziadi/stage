import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Download, Play, FileText } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'guide';
  icon?: LucideIcon;
  downloadUrl?: string;
  onClick?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  type,
  icon: Icon,
  downloadUrl,
  onClick
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6" />;
      case 'video':
        return <Play className="w-6 h-6" />;
      case 'guide':
        return <FileText className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'pdf':
        return 'from-rose-500 to-pink-600';
      case 'video':
        return 'from-emerald-500 to-teal-600';
      case 'guide':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-violet-500 to-purple-600';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'فيديو';
      case 'guide':
        return 'دليل';
      default:
        return 'ملف';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
    >
      {/* Header with Icon */}
      <div className={`bg-gradient-to-r ${getTypeColor()} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            {Icon ? <Icon className="w-8 h-8" /> : getTypeIcon()}
            <div>
              <div className="text-sm font-medium opacity-90">{getTypeLabel()}</div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          </div>
          <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
            {getTypeIcon()}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
        
        {/* Action Buttons */}
        <div className="flex space-x-3 space-x-reverse">
          {downloadUrl && (
            <motion.a
              href={downloadUrl}
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Download className="w-4 h-4" />
              <span>تحميل</span>
            </motion.a>
          )}
          
          {onClick && (
            <motion.button
              onClick={onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Play className="w-4 h-4" />
              <span>عرض</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor()} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
    </motion.div>
  );
};

export default ResourceCard;
