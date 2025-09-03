import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface Stat {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix: string;
  color: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
                     <h2 className="text-4xl font-bold text-gray-900 mb-6">إحصائيات النظام</h2>
           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
             أرقام تعكس نجاح نظام إدارة التدريب والتكوين المهني في خدمة المجتمع التعليمي
           </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              {/* Floating Background Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                className={`absolute -top-4 -right-4 w-8 h-8 ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
              />
              
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5 + 2
                }}
                className={`absolute -bottom-4 -left-4 w-6 h-6 ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
              />
              
              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <div className={`w-20 h-20 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={2000 + index * 500}
                    />
                  </div>
                  <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
                </div>
                
                {/* Hover Effect Glow */}
                <div className={`absolute inset-0 ${stat.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
      </div>
    </section>
  );
};

export default StatsSection;
