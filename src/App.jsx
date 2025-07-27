import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TodoiOSStyleComplete() {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  
  const [taskList, setTaskList] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("Health");
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFooterTab, setActiveFooterTab] = useState('today');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [isDark, setIsDark] = useState(false);

  // Categories with colors and icons
  const categories = {
    "Health": { color: "#A855F7", bgColor: "#E0E7FF", icon: "💜" },
    "Work": { color: "#10B981", bgColor: "#D1FAE5", icon: "💼" },
    "Mental Health": { color: "#EC4899", bgColor: "#FCE7F3", icon: "🧠" },
    "Others": { color: "#6B7280", bgColor: "#F3F4F6", icon: "📁" }
  };

  const theme = {
    background: isDark ? "#000000" : "#F8F9FA",
    cardBackground: isDark ? "#1C1C1E" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#8E8E93" : "#666666",
    border: isDark ? "#2C2C2E" : "#E5E7EB",
    accent: "#007AFF",
    statusBar: isDark ? "#FFFFFF" : "#000000"
  };

  const handleAdd = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now() + Math.random(),
      text: task.trim(),
      done: false,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    setTaskList([...taskList, newTask]);
    setTask("");
    setShowAddTask(false);
  };

  const handleDelete = (taskObj) => {
    setTaskList(taskList.filter(task => task.id !== taskObj.id));
  };

  const toggleDone = (taskObj) => {
    setTaskList(taskList.map(task => 
      task.id === taskObj.id 
        ? { ...task, done: !task.done }
        : task
    ));
    
    // Show confetti when task is completed
    if (!taskObj.done) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleEdit = (taskObj) => {
    setEditTask(taskObj);
    setEditText(taskObj.text);
  };

  const handleUpdate = () => {
    if (editText.trim() === "") return;
    
    setTaskList(taskList.map(task =>
      task.id === editTask.id
        ? { ...task, text: editText.trim() }
        : task
    ));
    setEditTask(null);
    setEditText("");
  };

  // Fix body background for full dark theme
useEffect(() => {
  if (isDark) {
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
  } else {
    document.body.style.backgroundColor = '#F8F9FA';
    document.documentElement.style.backgroundColor = '#F8F9FA';
  }
  
  return () => {
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';
  };
}, [isDark]);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get tasks by category
  const getTasksByCategory = (category) => {
    return taskList.filter(task => task.category === category);
  };

  // Get current date
  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  const taskVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  // Confetti Component
  const ConfettiEffect = () => {
    const confettiPieces = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)],
      shape: Math.random() > 0.6 ? 'star' : Math.random() > 0.4 ? 'circle' : Math.random() > 0.2 ? 'square' : 'heart',
      size : 10 + Math.random() * 12
    }));

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden"
      }}>
        {confettiPieces.map(piece => (
          <motion.div
            key={piece.id}
            initial={{ 
              y: -10, 
              x: `${piece.left}vw`, 
              rotate: 0,
              scale: 0
            }}
            animate={{ 
              y: "100vh", 
              rotate: 360,
              scale: [0, 1, 1, 0]
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px"
            }}
          />
        ))}
      </div>
    );
  };

  // Stats Component
  const StatsView = () => (
    <div style={{ 
      padding: "20px", 
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          margin: 0,
          color: theme.text
        }}>
          📊 Statistics
        </h2>
        <button
          onClick={() => setActiveFooterTab('today')}
          style={{
            background: "linear-gradient(135deg, #007AFF, #0051D2)",
            border: "none",
            fontSize: "16px",
            color: "white",
            cursor: "pointer",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "600"
          }}
        >
          ← Back
        </button>
      </div>
      
      {/* Progress Bars */}
      {Object.entries(categories).map(([category, config]) => {
        const categoryTasks = getTasksByCategory(category);
        const completed = categoryTasks.filter(t => t.done).length;
        const total = categoryTasks.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        return (
          <div 
            key={category} 
            style={{ 
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: theme.cardBackground,
              borderRadius: "16px",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                color: theme.text,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{ fontSize: "24px" }}>{config.icon}</span>
                {category}
              </span>
              <span style={{ 
                fontSize: "16px", 
                color: theme.textSecondary,
                fontWeight: "600"
              }}>
                {completed}/{total}
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "12px",
              backgroundColor: isDark ? "#2C2C2E" : "#F0F0F0",
              borderRadius: "6px",
              overflow: "hidden",
              position: "relative"
            }}>
              <div 
                style={{
                  width: `${percentage}%`,
                  height: "100%",   
                  background: `linear-gradient(90deg, ${config.color}, ${config.color}CC)`,
                  borderRadius: "6px",
                  position: "relative",
                  transition: "width 0.5s ease"
                }}
              />
              <span style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "10px",
                fontWeight: "700",
                color: percentage > 50 ? "white" : theme.text
              }}>
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        );
      })}
      
      {/* Overall Stats */}
      <div 
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
          borderRadius: "20px",
          padding: "24px",
          marginTop: "30px",
          border: `1px solid ${theme.border}`,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h3 style={{ 
          fontSize: "24px", 
          fontWeight: "700", 
          marginBottom: "20px", 
          color: theme.text,
          textAlign: "center"
        }}>
          🏆 Overall Progress
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <div 
              style={{ 
                fontSize: "36px", 
                fontWeight: "700", 
                color: "#007AFF",
                marginBottom: "8px"
              }}
            >
              {taskList.length}
            </div>
            <div style={{ fontSize: "14px", color: theme.textSecondary, fontWeight: "500" }}>Total Tasks</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div 
              style={{ 
                fontSize: "36px", 
                fontWeight: "700", 
                color: "#34C759",
                marginBottom: "8px"
              }}
            >
              {taskList.filter(t => t.done).length}
            </div>
            <div style={{ fontSize: "14px", color: theme.textSecondary, fontWeight: "500" }}>Completed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div 
              style={{ 
                fontSize: "36px", 
                fontWeight: "700", 
                color: "#FF9500",
                marginBottom: "8px"
              }}
            >
              {Math.round(taskList.length > 0 ? (taskList.filter(t => t.done).length / taskList.length) * 100 : 0)}%
            </div>
            <div style={{ fontSize: "14px", color: theme.textSecondary, fontWeight: "500" }}>Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Calendar View
  const CalendarView = () => (
    <div style={{ 
      padding: "20px", 
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          margin: 0,
          color: theme.text
        }}>
          📆 Calendar
        </h2>
        <button
          onClick={() => setActiveFooterTab('today')}
          style={{
            background: "linear-gradient(135deg, #007AFF, #0051D2)",
            border: "none",
            fontSize: "16px",
            color: "white",
            cursor: "pointer",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "600"
          }}
        >
          ← Back
        </button>
      </div>
      
      {/* Calendar Header */}
      <div 
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "25px",
          border: `1px solid ${theme.border}`,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ 
            fontSize: "28px", 
            fontWeight: "700", 
            color: theme.text,
            marginBottom: "8px"
          }}>
            {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ 
            fontSize: "16px", 
            color: theme.textSecondary,
            fontWeight: "500"
          }}>
            Today: {currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#007AFF",
            marginTop: "8px"
          }}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
        
        {/* Task Timeline */}
        <div>
          <h3 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            marginBottom: "16px", 
            color: theme.text,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ⏰ Recent Activity
          </h3>
          {taskList.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px 20px",
              color: theme.textSecondary 
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
              <p style={{ fontSize: "18px", margin: "0", fontWeight: "500" }}>No tasks yet</p>
              <p style={{ fontSize: "14px", margin: "8px 0 0 0" }}>Start creating tasks to see your activity</p>
            </div>
          ) : (
            taskList.slice(0, 8).map((task, index) => (
              <div 
                key={task.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < Math.min(taskList.length, 8) - 1 ? `1px solid ${theme.border}` : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <span style={{ 
                    fontSize: "16px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    backgroundColor: categories[task.category]?.color,
                    color: "white",
                    fontWeight: "600",
                    minWidth: "32px",
                    textAlign: "center"
                  }}>
                    {categories[task.category]?.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: "16px", 
                      color: theme.text,
                      fontWeight: "500",
                      textDecoration: task.done ? "line-through" : "none",
                      opacity: task.done ? 0.6 : 1
                    }}>
                      {task.text}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: theme.textSecondary,
                      marginTop: "2px"
                    }}>
                      {task.category} • {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  backgroundColor: task.done ? "#34C759" : theme.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "700"
                }}>
                  {task.done && "✓"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div style={{ 
      padding: "20px", 
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          margin: 0,
          color: theme.text
        }}>
          ⚙️ Settings
        </h2>
        <button
          onClick={() => setActiveFooterTab('today')}
          style={{
            background: "linear-gradient(135deg, #007AFF, #0051D2)",
            border: "none",
            fontSize: "16px",
            color: "white",
            cursor: "pointer",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "600"
          }}
        >
          ← Back
        </button>
      </div>
      
      {/* Theme Toggle */}
      <div 
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: `1px solid ${theme.border}`,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <div>
            <h3 style={{ 
              fontSize: "18px", 
              fontWeight: "600", 
              marginBottom: "4px", 
              color: theme.text 
            }}>
              🌙 Dark Mode
            </h3>
            <p style={{ 
              fontSize: "14px", 
              color: theme.textSecondary, 
              margin: 0 
            }}>
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              width: "60px",
              height: "32px",
              borderRadius: "16px",
              border: "none",
              background: isDark ? "#34C759" : "#E5E7EB",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "14px",
                backgroundColor: "white",
                position: "absolute",
                top: "2px",
                left: isDark ? "30px" : "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease"
              }}
            />
          </button>
        </div>
      </div>

      {/* Storage Info */}
      <div 
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: `1px solid ${theme.border}`,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h3 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          marginBottom: "16px", 
          color: theme.text,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          💾 Storage Information
        </h3>
        <div style={{ fontSize: "15px", color: theme.textSecondary, lineHeight: "1.6" }}>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <span>Tasks saved:</span>
            <span style={{ fontWeight: "600", color: "#007AFF" }}>{taskList.length}</span>
          </div>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <span>Theme mode:</span>
            <span style={{ fontWeight: "600", color: "#007AFF" }}>{isDark ? 'Dark' : 'Light'}</span>
          </div>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <span>Completed tasks:</span>
            <span style={{ fontWeight: "600", color: "#34C759" }}>{taskList.filter(t => t.done).length}</span>
          </div>
          <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
            <span>Last updated:</span>
            <span style={{ fontWeight: "600", color: theme.text }}>{new Date().toLocaleTimeString()}</span>
          </div>
          <div style={{ 
            fontSize: "13px", 
            padding: "8px 12px", 
            backgroundColor: isDark ? "#2C2C2E" : "#F0F0F0",
            borderRadius: "8px",
            textAlign: "center",
            color: theme.textSecondary
          }}>
            📱 Data stored locally in your browser
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Export Data */}
        <button 
          onClick={() => {
            const data = {
              tasks: taskList,
              theme: isDark,
              exportDate: new Date().toISOString(),
              totalTasks: taskList.length,
              completedTasks: taskList.filter(t => t.done).length
            };
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type:'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #34C759, #30D158)",
            borderRadius: "16px",
            border: "none",
            textAlign: "left",
            fontSize: "16px",
            cursor: "pointer",
            color: "white",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(52, 199, 89, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "24px" }}>📤</span>
          <div>
            <div>Export Backup</div>
            <div style={{ fontSize: "14px", opacity: 0.9, fontWeight: "400" }}>
              Download your tasks as JSON file
            </div>
          </div>
        </button>

        {/* Clear All Data */}
        <button 
          onClick={() => {
            const confirmed = window.confirm("⚠️ Clear all tasks and reset settings?\n\nThis action cannot be undone!");
            if (confirmed) {
              setTaskList([]);
              setIsDark(false);
            }
          }}
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #FF3B30, #FF6B6B)",
            borderRadius: "16px",
            border: "none",
            textAlign: "left",
            fontSize: "16px",
            cursor: "pointer",
            color: "white",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(255, 59, 48, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "24px" }}>🗑️</span>
          <div>
            <div>Clear All Data</div>
            <div style={{ fontSize: "14px", opacity: 0.9, fontWeight: "400" }}>
              Remove all tasks and reset app
            </div>
          </div>
        </button>
        
        {/* App Info */}
        <div 
          style={{
            padding: "20px",
            background: isDark 
              ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            textAlign: "center",
            fontSize: "16px",
            color: theme.text,
            boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>✨</div>
          <div style={{ fontWeight: "700", marginBottom: "8px" }}>Todo App v2.0.0</div>
          <div style={{ fontSize: "14px", color: theme.textSecondary, lineHeight: "1.5" }}>
            Enhanced iOS-style design<br/>
            Auto-save enabled • {taskList.length} tasks stored<br/>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              Built with React & Framer Motion
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch(activeFooterTab) {
      case 'stats': return <StatsView />;
      case 'calendar': return <CalendarView />;
      case 'settings': return <SettingsView />;
      default: return null;
    }
  };

  // Show tab content if not on today tab
  if (activeFooterTab !== 'today') {
    return renderTabContent();
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: isDark 
        ? "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
        : "linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 100%)",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "0",
      position: "relative"
    }}>
      {/* Status Bar */}
      <div style={{
        padding: "8px 20px 0 20px",
        fontSize: "17px",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: theme.statusBar
      }}>
        <span>
          {currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
          })}
        </span>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                width: "3px",
                height: "4px",
                backgroundColor: theme.statusBar,
                borderRadius: "1px"
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Greeting */}
      <h2 
        style={{ 
          marginLeft: "20px",
          fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "28px",
          fontWeight: "700",
          lineHeight: "1.2",
          marginBottom: "8px",
          marginTop: "16px",
          color: isDark ? "#FFFFFF" : "#1a1a1a"
        }}
      >
        Hi Ella 👋
      </h2>

      {/* Header */}
      <div
        style={{
          padding: "20px 20px 0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <div>
          <h1 style={{
            fontSize: "34px",
            fontWeight: "700",
            margin: "0 0 4px 0",
            color: theme.text
          }}>
            Today <span style={{ color: theme.textSecondary, fontWeight: "400" }}>
              {getCurrentDate().split(' ').slice(1).join(' ')}
            </span>
          </h1>
        </div>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: "12px 16px",
            borderRadius: "16px",
            border: "none",
            background: isDark 
              ? "linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
            color: theme.text,
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease"
          }}
        >
          <span>{isDark ? "☀️" : "🌙"}</span>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </div>

      {/* Category Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          padding: "24px 20px"
        }}
      >
        {Object.entries(categories).map(([category, config], index) => {
          const categoryTasks = getTasksByCategory(category);
          const count = categoryTasks.length;
          const completed = categoryTasks.filter(t => t.done).length;
          const percentage = count > 0 ? Math.round((completed / count) * 100) : 0;
          
          return (
            <div
              key={category}
              style={{
                background: isDark 
                  ? `linear-gradient(135deg, ${config.color}30 0%, ${config.color}10 100%)`
                  : `linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%)`,
                borderRadius: "20px",
                padding: "20px",
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                border: isDark ? `1px solid ${config.color}40` : `1px solid ${config.color}30`,
                boxShadow: isDark 
                  ? `0 8px 32px ${config.color}20` 
                  : `0 4px 20px ${config.color}30`,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02) translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1) translateY(0px)"}
            >
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "12px",
                fontWeight: "700",
                color: config.color,
                background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)",
                padding: "4px 8px",
                borderRadius: "8px"
              }}>
                {percentage}%
              </div>
              <div style={{
                fontSize: "32px",
                marginBottom: "8px"
              }}>
                {config.icon}
              </div>
              <div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "4px"
                }}>
                  {count}
                </div>
                <div style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: theme.textSecondary,
                  marginBottom: "4px"
                }}>
                  {category}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: config.color,
                  fontWeight: "600"
                }}>
                  {completed} completed
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div style={{ padding: "0 20px" }}>
        <AnimatePresence>
          {taskList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: theme.textSecondary,
                background: isDark 
                  ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📝</div>
              <p style={{ fontSize: "20px", margin: "0", fontWeight: "600" }}>No tasks yet</p>
              <p style={{ fontSize: "16px", margin: "12px 0 0 0", opacity: 0.7 }}>
                Tap the + button to add your first task
              </p>
            </div>
          ) : (
            taskList
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  style={{
                    background: isDark 
                      ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
                      : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
                    borderRadius: "16px",
                    marginBottom: "12px",
                    padding: "20px",
                    boxShadow: isDark 
                      ? "0 4px 20px rgba(0,0,0,0.4)" 
                      : "0 2px 12px rgba(0,0,0,0.1)",
                    border: `1px solid ${theme.border}`,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Category color strip */}
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: `linear-gradient(to bottom, ${categories[task.category]?.color}, ${categories[task.category]?.color}80)`
                  }} />

                  {editTask?.id === task.id ? (
                    /* Edit Mode */
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate();
                          if (e.key === "Escape") setEditTask(null);
                        }}
                        style={{
                          flex: 1,
                          padding: "16px",
                          borderRadius: "12px",
                          border: "2px solid #007AFF",
                          background: theme.background,
                          color: theme.text,
                          fontSize: "16px",
                          outline: "none",
                          fontFamily: "inherit",
                          boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)"
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdate}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border: "none",
                          background: "linear-gradient(135deg, #34C759, #30D158)",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(52, 199, 89, 0.3)"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditTask(null)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border: "none",
                          background: "linear-gradient(135deg, #FF3B30, #FF6B6B)",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(255, 59, 48, 0.3)"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <button
                        onClick={() => toggleDone(task)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          border: task.done ? "none" : `2px solid ${categories[task.category]?.color || theme.border}`,
                          background: task.done 
                            ? `linear-gradient(135deg, #34C759, #30D158)`
                            : "transparent",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginTop: "2px",
                          flexShrink: 0,
                          transition: "all 0.3s ease",
                          boxShadow: task.done ? "0 2px 8px rgba(52, 199, 89, 0.3)" : "none"
                        }}
                      >
                        {task.done && "✓"}
                      </button>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          lineHeight: "1.4",
                          textDecoration: task.done ? "line-through" : "none",
                          opacity: task.done ? 0.6 : 1,
                          color: theme.text,
                          marginBottom: "8px"
                        }}>
                          {task.text}
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: `linear-gradient(135deg, ${categories[task.category]?.color}, ${categories[task.category]?.color}CC)`,
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {categories[task.category]?.icon} {task.category}
                          </div>
                          <div style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                            fontWeight: "500"
                          }}>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <button
                          onClick={() => handleEdit(task)}
                          style={{
                            background: "linear-gradient(135deg, #007AFF, #0051D2)",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "8px",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          style={{
                            background: "linear-gradient(135deg, #FF3B30, #FF6B6B)",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "8px",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(255, 59, 48, 0.3)"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "flex-end",
              zIndex: 1000,
              backdropFilter: "blur(10px)"
            }}
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: isDark 
                  ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
                borderTopLeftRadius: "28px",
                borderTopRightRadius: "28px",
                padding: "28px 24px 40px 24px",
                width: "100%",
                maxHeight: "75vh",
                boxShadow: isDark ? "0 -8px 32px rgba(0,0,0,0.4)" : "0 -4px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div 
                style={{
                  width: "40px",
                  height: "4px",
                  background: theme.border,
                  borderRadius: "2px",
                  margin: "0 auto 28px auto"
                }} 
              />

              <h2 style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0 0 24px 0",
                color: theme.text,
                textAlign: "center"
              }}>
                 Add New Task
              </h2>

              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="What needs to be done?"
                style={{
                  width: "100%",
                  padding: "20px",
                  borderRadius: "16px",
                  border: `2px solid ${theme.border}`,
                  background: isDark ? "#2C2C2E" : "#F8F9FA",
                  color: theme.text,
                  fontSize: "18px",
                  outline: "none",
                  marginBottom: "24px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease"
                }}
                autoFocus
              />

              <div style={{ marginBottom: "28px" }}>
                <div 
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: theme.text
                  }}
                >
                  🏷️ Choose Category
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  {Object.entries(categories).map(([category, config]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: "16px",
                        borderRadius: "16px",
                        border: selectedCategory === category 
                          ? `2px solid ${config.color}` 
                          : `1px solid ${theme.border}`,
                        background: selectedCategory === category 
                          ? (isDark ? `${config.color}20` : config.bgColor)
                          : (isDark ? "#2C2C2E" : "#FFFFFF"),
                        color: theme.text,
                        fontSize: "16px",
                        fontWeight: selectedCategory === category ? "600" : "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        transition: "all 0.3s ease",
                        boxShadow: selectedCategory === category 
                          ? `0 4px 16px ${config.color}30`
                          : "none"
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{config.icon}</span>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() => setShowAddTask(false)}
                  style={{
                    flex: 1,
                    padding: "18px",
                    borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                    background: isDark ? "#2C2C2E" : "#F8F9FA",
                    color: theme.text,
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!task.trim()}
                  style={{
                    flex: 1,
                    padding: "18px",
                    borderRadius: "16px",
                    border: "none",
                    background: task.trim() 
                      ? "linear-gradient(135deg, #007AFF, #0051D2)"
                      : "#C7C7CC",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: task.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    boxShadow: task.trim() ? "0 4px 16px rgba(0, 122, 255, 0.3)" : "none"
                  }}
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddTask(true)}
        style={{
          position: "fixed",
          bottom: "130px",
          right: "24px",
          width: "64px",
          height: "64px",
          borderRadius: "32px",
          border: "none",
          background: "linear-gradient(135deg, #007AFF, #0051D2)",
          color: "white",
          fontSize: "28px",
          fontWeight: "300",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0, 122, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        +
      </button>

      {/* Footer Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: isDark 
            ? "rgba(28, 28, 30, 0.95)" 
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${theme.border}`,
          padding: "12px 0 28px 0",
          zIndex: 50
        }}
      >
        {/* Quick Stats */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px 24px",
          fontSize: "14px",
          color: theme.textSecondary,
          borderBottom: `1px solid ${theme.border}`,
          marginBottom: "12px",
          gap: "20px"
        }}>
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px",
            fontWeight: "600"
          }}>
            📊 <span style={{ color: "#007AFF" }}>{taskList.length}</span> total
          </span>
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px",
            fontWeight: "600"
          }}>
            ✅ <span style={{ color: "#34C759" }}>{taskList.filter(t => t.done).length}</span> done
          </span>
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px",
            fontWeight: "600"
          }}>
            ⏳ <span style={{ color: "#FF9500" }}>{taskList.filter(t => !t.done).length}</span> pending
          </span>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "0 24px"
        }}>
          {[
            { id: 'today', icon: '📅', label: 'Today' },
            { id: 'stats', icon: '📊', label: 'Stats' },
            { id: 'add', icon: '+', label: 'Add', isSpecial: true },
            { id: 'calendar', icon: '📆', label: 'Calendar' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add') {
                  setShowAddTask(true);
                } else {
                  setActiveFooterTab(tab.id);
                }
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: tab.isSpecial ? "12px" : "8px 12px",
                borderRadius: tab.isSpecial ? "24px" : "12px",
                border: "none",
                background: tab.isSpecial 
                  ? "linear-gradient(135deg, #007AFF, #0051D2)" 
                  : (activeFooterTab === tab.id 
                      ? (isDark ? "linear-gradient(135deg, #2C2C2E, #3A3A3C)" : "linear-gradient(135deg, #E3F2FD, #BBDEFB)") 
                      : "transparent"),
                color: tab.isSpecial 
                  ? "white" 
                  : (activeFooterTab === tab.id 
                      ? "#007AFF" 
                      : theme.textSecondary),
                cursor: "pointer",
                minWidth: tab.isSpecial ? "48px" : "auto",
                transition: "all 0.3s ease",
                boxShadow: tab.isSpecial 
                  ? "0 4px 16px rgba(0, 122, 255, 0.3)"
                  : (activeFooterTab === tab.id ? "0 2px 8px rgba(0, 122, 255, 0.2)" : "none")
              }}
            >
              <span style={{ 
                fontSize: tab.isSpecial ? "24px" : "18px",
                fontWeight: tab.isSpecial ? "300" : "400"
              }}>
                {tab.icon}
              </span>
              {!tab.isSpecial && (
                <span style={{ 
                  fontSize: "12px", 
                  fontWeight: activeFooterTab === tab.id ? "600" : "500"
                }}>
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Padding */}
      <div style={{ height: "140px" }} />

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
      </AnimatePresence>
    </div>
  );
}

export default TodoiOSStyleComplete;