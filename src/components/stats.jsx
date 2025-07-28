  import React from 'react';
  import { motion } from 'framer-motion';

  const Stats = ({ theme, taskList, categories, getTasksByCategory, onBack }) => {
    return (
      <div style={{ 
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px",
          backgroundColor: theme.background,
          borderBottom: `1px solid ${theme.border}20`,
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center"
          }}>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: "700", 
              color: theme.text,
              margin: 0
            }}>
              📊 Statistics
            </h1>
            <button
              onClick={onBack}
              style={{
                background: "linear-gradient(135deg, #007AFF, #0051D2)",
                border: "none",
                fontSize: "16px",
                color: "white",
                cursor: "pointer",
                padding: "10px 20px",
                borderRadius: "20px",
                fontWeight: "600",
                boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)"
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 20px 120px 20px" }}>
          {/* Category Progress Cards */}
          <div style={{ marginBottom: "30px" }}>
            {Object.entries(categories).map(([category, config], index) => {
              const categoryTasks = getTasksByCategory(category);
              const completed = categoryTasks.filter(t => t.done).length;
              const total = categoryTasks.length;
              const percentage = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    marginBottom: "16px",
                    background: theme.cardBackground,
                    borderRadius: "20px",
                    padding: "20px",
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.isDark 
                      ? "0 8px 32px rgba(0,0,0,0.3)" 
                      : "0 4px 20px rgba(0,0,0,0.08)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Category Header */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "16px" 
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: `${config.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px"
                      }}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 style={{ 
                          fontSize: "18px", 
                          fontWeight: "600", 
                          color: theme.text,
                          margin: 0,
                          marginBottom: "2px"
                        }}>
                          {category}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          color: theme.textSecondary,
                          margin: 0
                        }}>
                          {total} {total === 1 ? 'task' : 'tasks'}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      textAlign: "right"
                    }}>
                      <div style={{ 
                        fontSize: "24px", 
                        fontWeight: "700",
                        color: config.color,
                        marginBottom: "2px"
                      }}>
                        {Math.round(percentage)}%
                      </div>
                      <div style={{ 
                        fontSize: "14px", 
                        color: theme.textSecondary,
                        fontWeight: "500"
                      }}>
                        {completed}/{total}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: theme.isDark ? "#2C2C2E" : "#F0F0F0",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${config.color}, ${config.color}DD)`,
                        borderRadius: "4px"
                      }}
                    />
                  </div>

                  {/* Task Details */}
                  {total > 0 && (
                    <div style={{
                      marginTop: "16px",
                      display: "flex",
                      gap: "12px"
                    }}>
                      <div style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: `${config.color}10`,
                        borderRadius: "8px"
                      }}>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: config.color
                        }}>
                          {completed}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: theme.textSecondary,
                          fontWeight: "500"
                        }}>
                          Done
                        </div>
                      </div>
                      <div style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: theme.isDark ? "#2C2C2E" : "#F5F5F5",
                        borderRadius: "8px"
                      }}>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: theme.textSecondary
                        }}>
                          {total - completed}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: theme.textSecondary,
                          fontWeight: "500"
                        }}>
                          Pending
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {total === 0 && (
                    <div style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: theme.textSecondary
                    }}>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        {config.icon}
                      </div>
                      <p style={{ 
                        fontSize: "14px", 
                        margin: 0,
                        fontStyle: "italic"
                      }}>
                        No tasks in this category yet
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
{/* Overall Summary Card */}
<motion.div 
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
  style={{
    background: theme.cardBackground, // Sama kayak temen-temennya
    borderRadius: "20px", // Sama kayak temen-temennya  
    padding: "20px", // Sama kayak temen-temennya
    border: `1px solid ${theme.border}`, // Sama kayak temen-temennya
    boxShadow: theme.isDark 
      ? "0 8px 32px rgba(0,0,0,0.3)" // Sama kayak temen-temennya
      : "0 4px 20px rgba(0,0,0,0.08)", // Sama kayak temen-temennya
    position: "relative",
    overflow: "hidden"
  }}
>
  <div>
    <h3 style={{ 
      fontSize: "22px", 
      fontWeight: "700", 
      marginBottom: "24px", 
      color: theme.text,
      textAlign: "center"
    }}>
      🏆 Overall Progress
    </h3>
    
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr 1fr", 
      gap: "20px",
      marginBottom: "24px"
    }}>
      <div style={{ textAlign: "center" }}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#007AFF",
            marginBottom: "4px"
          }}
        >
          {taskList.length}
        </motion.div>
        <div style={{ 
          fontSize: "14px", 
          color: theme.textSecondary, 
          fontWeight: "500"
        }}>
          Total Tasks
        </div>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#34C759",
            marginBottom: "4px"
          }}
        >
          {taskList.filter(t => t.done).length}
        </motion.div>
        <div style={{ 
          fontSize: "14px", 
          color: theme.textSecondary, 
          fontWeight: "500"
        }}>
          Completed
        </div>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#FF9500",
            marginBottom: "4px"
          }}
        >
          {Math.round(taskList.length > 0 ? (taskList.filter(t => t.done).length / taskList.length) * 100 : 0)}%
        </motion.div>
        <div style={{ 
          fontSize: "14px", 
          color: theme.textSecondary, 
          fontWeight: "500"
        }}>
          Success Rate
        </div>
      </div>
    </div>

    {/* Motivational Message */}
    <div style={{
      textAlign: "center",
      padding: "16px 20px",
      backgroundColor: theme.isDark ? "#007AFF15" : "#007AFF10",
      borderRadius: "16px",
      border: `1px solid #007AFF30`
    }}>
      <p style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#007AFF",
        margin: 0,
        marginBottom: "4px"
      }}>
        {taskList.length === 0 
          ? "Ready to start your journey!" 
          : taskList.filter(t => t.done).length === taskList.length
            ? "🎉 All tasks completed!"
            : `${taskList.filter(t => !t.done).length} tasks to go!`
        }
      </p>
      <p style={{
        fontSize: "14px",
        color: theme.textSecondary,
        margin: 0
      }}>
        {taskList.length === 0
          ? "Add your first task to get started"
          : taskList.filter(t => t.done).length === taskList.length
            ? "Great job on staying productive!"
            : "Keep up the great work!"
        }
      </p>
    </div>
  </div>
</motion.div>
        </div>
      </div>
    );
  };

  export default Stats;