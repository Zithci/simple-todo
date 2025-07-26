import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TodoiOSStyleComplete() {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
      }
    }
    return [];
  });
  
  const [selectedCategory, setSelectedCategory] = useState("Health");
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFooterTab, setActiveFooterTab] = useState('today');
  const [showContent, setShowContent] = useState(false);
  
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('todoTheme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

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

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(taskList));
  }, [taskList]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('todoTheme', JSON.stringify(isDark));
  }, [isDark]);

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

  // Render tab content with full functionality
  const renderTabContent = () => {
    switch(activeFooterTab) {
      case 'stats':
        return (
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
              marginBottom: "20px"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
                📊 Statistics
              </h2>
              <button
                onClick={() => setActiveFooterTab('today')}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: theme.accent,
                  cursor: "pointer"
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
                <div key={category} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "500", color: theme.text }}>
                      {config.icon} {category}
                    </span>
                    <span style={{ fontSize: "14px", color: theme.textSecondary }}>
                      {completed}/{total}
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: theme.border,
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: "100%",
                      backgroundColor: config.color,
                      borderRadius: "4px",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>
              );
            })}
            
            {/* Overall Stats */}
            <div style={{
              backgroundColor: theme.cardBackground,
              borderRadius: "12px",
              padding: "16px",
              marginTop: "20px",
              border: `1px solid ${theme.border}`
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: theme.text }}>
                Overall Progress
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#007AFF" }}>
                    {taskList.length}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textSecondary }}>Total</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#34C759" }}>
                    {taskList.filter(t => t.done).length}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textSecondary }}>Completed</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#FF9500" }}>
                    {Math.round(taskList.length > 0 ? (taskList.filter(t => t.done).length / taskList.length) * 100 : 0)}%
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textSecondary }}>Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
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
              marginBottom: "20px"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
                📆 Calendar View
              </h2>
              <button
                onClick={() => setActiveFooterTab('today')}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: theme.accent,
                  cursor: "pointer"
                }}
              >
                ← Back
              </button>
            </div>
            
            {/* Calendar Header */}
            <div style={{
              backgroundColor: theme.cardBackground,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: theme.text }}>
                  {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: "14px", color: theme.textSecondary, marginTop: "4px" }}>
                  Today: {currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                </div>
              </div>
              
              {/* Tasks by Date */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: theme.text }}>
                  Recent Activity
                </h3>
                {taskList.length === 0 ? (
                  <p style={{ color: theme.textSecondary, textAlign: "center", padding: "20px" }}>
                    No tasks yet
                  </p>
                ) : (
                  taskList.slice(0, 5).map(task => (
                    <div key={task.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ 
                          fontSize: "12px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: categories[task.category]?.color,
                          color: "white"
                        }}>
                          {categories[task.category]?.icon}
                        </span>
                        <span style={{ fontSize: "14px", color: theme.text }}>{task.text}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: theme.textSecondary }}>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
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
              marginBottom: "20px"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
                ⚙️ Settings
              </h2>
              <button
                onClick={() => setActiveFooterTab('today')}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: theme.accent,
                  cursor: "pointer"
                }}
              >
                ← Back
              </button>
            </div>
            
            {/* Storage Info */}
            <div style={{
              backgroundColor: theme.cardBackground,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              border: `1px solid ${theme.border}`
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: theme.text }}>
                💾 Storage Info
              </h3>
              <div style={{ fontSize: "14px", color: theme.textSecondary }}>
                <div>Tasks saved: {taskList.length}</div>
                <div>Theme: {isDark ? 'Dark' : 'Light'} mode</div>
                <div>Last updated: {new Date().toLocaleString()}</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  Data automatically saved to browser
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Export Data */}
              <button 
                onClick={() => {
                  const data = {
                    tasks: taskList,
                    theme: isDark,
                    exportDate: new Date().toISOString()
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
                  padding: "16px",
                  backgroundColor: theme.cardBackground,
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  textAlign: "left",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#34C759"
                }}
              >
                📤 Export Backup
              </button>

              {/* Clear All Data */}
              <button 
                onClick={() => {
                  const confirmed = window.confirm("Clear all tasks and reset settings? This cannot be undone!");
                  if (confirmed) {
                    setTaskList([]);
                    localStorage.removeItem('todoTasks');
                    localStorage.removeItem('todoTheme');
                    setIsDark(false);
                  }
                }}
                style={{
                  padding: "16px",
                  backgroundColor: theme.cardBackground,
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  textAlign: "left",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#FF3B30"
                }}
              >
                🗑️ Clear All Data
              </button>
              
              <div style={{
                padding: "16px",
                backgroundColor: theme.cardBackground,
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                textAlign: "center",
                fontSize: "14px",
                color: theme.textSecondary
              }}>
                Todo App v1.0.0<br/>
                <span style={{ fontSize: "12px" }}>
                  Auto-save enabled • {taskList.length} tasks stored
                </span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show tab content if not on today tab
  if (activeFooterTab !== 'today') {
    return renderTabContent();
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.background,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
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
          {/* <div style={{ fontSize: "14px" }}>📶 📶 🔋</div> */}
        </div>
      </div>
<h2 style={{ 
  marginLeft: "20px",
  fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif", // Fallback fonts
  fontSize: "25px",        // Bigger for greeting
  fontWeight: "700",       // Bold for hierarchy  
  lineHeight: "2.5",       // Tight line spacing
  marginBottom: "4px",     // Space to next element
  marginTop: "0",          // Remove default margin
  color: "#1a1a1a"         // Dark color (adjust for theme)
}}>
  Hi Ella
</h2>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.cardBackground,
            color: theme.text,
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: isDark ? "0 2px 8px rgba(255,255,255,0.1)" : "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </motion.button>
      </motion.div>

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "24px 20px"
        }}
      >
        {Object.entries(categories).map(([category, config]) => {
          const categoryTasks = getTasksByCategory(category);
          const count = categoryTasks.length;
          
          return (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: isDark 
                  ? `${config.color}20`
                  : config.bgColor,
                borderRadius: "16px",
                padding: "16px",
                minHeight: "80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                border: isDark ? `1px solid ${config.color}40` : "none",
                boxShadow: isDark 
                  ? "0 4px 16px rgba(0,0,0,0.3)" 
                  : "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                fontSize: "28px",
                marginBottom: "8px"
              }}>
                {config.icon}
              </div>
              <div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "2px"
                }}>
                  {count}
                </div>
                <div style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  color: theme.textSecondary
                }}>
                  {category}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Task List */}
      <div style={{ padding: "0 20px" }}>
        <AnimatePresence>
          {taskList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: theme.textSecondary
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <p style={{ fontSize: "17px", margin: "0" }}>No tasks yet</p>
              <p style={{ fontSize: "15px", margin: "8px 0 0 0" }}>Tap + to add your first task</p>
            </motion.div>
          ) : (
            taskList
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task) => (
                <motion.div
                  key={task.id}
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  style={{
                    backgroundColor: theme.cardBackground,
                    borderRadius: "12px",
                    marginBottom: "8px",
                    padding: "16px",
                    boxShadow: isDark 
                      ? "0 2px 8px rgba(0,0,0,0.3)" 
                      : "0 1px 3px rgba(0,0,0,0.1)",
                    border: `1px solid ${theme.border}`
                  }}
                >
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
                          padding: "12px",
                          borderRadius: "8px",
                          border: "2px solid #007AFF",
                          background: theme.background,
                          color: theme.text,
                          fontSize: "16px",
                          outline: "none",
                          fontFamily: "inherit"
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdate}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#34C759",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditTask(null)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#FF3B30",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleDone(task)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: task.done ? "none" : `2px solid ${theme.border}`,
                          background: task.done ? "#34C759" : "transparent",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "12px",
                          marginTop: "1px",
                          flexShrink: 0
                        }}
                      >
                        {task.done && "✓"}
                      </motion.button>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "17px",
                          fontWeight: "400",
                          lineHeight: "1.4",
                          textDecoration: task.done ? "line-through" : "none",
                          opacity: task.done ? 0.5 : 1,
                          color: theme.text,
                          marginBottom: "6px"
                        }}>
                          {task.text}
                        </div>
                        
                        <div style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor: categories[task.category]?.color || "#6B7280",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          {task.category}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
                        <button
                          onClick={() => handleEdit(task)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "16px",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#007AFF"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "16px",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#FF3B30"
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
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "flex-end",
              zIndex: 1000
            }}
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.cardBackground,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                padding: "24px 20px 40px 20px",
                width: "100%",
                maxHeight: "70vh"
              }}
            >
              <div style={{
                width: "36px",
                height: "4px",
                backgroundColor: theme.border,
                borderRadius: "2px",
                margin: "0 auto 24px auto"
              }} />

              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 0 20px 0",
                color: theme.text
              }}>
                Add New Task
              </h2>

              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Enter task description..."
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: "17px",
                  outline: "none",
                  marginBottom: "20px",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
                autoFocus
              />

              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: theme.text
                }}>
                  Category
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px"
                }}>
                  {Object.entries(categories).map(([category, config]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        border: selectedCategory === category 
                          ? `2px solid ${config.color}` 
                          : `1px solid ${theme.border}`,
                        background: selectedCategory === category 
                          ? (isDark ? `${config.color}20` : config.bgColor)
                          : theme.cardBackground,
                        color: theme.text,
                        fontSize: "15px",
                        fontWeight: selectedCategory === category ? "600" : "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{config.icon}</span>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowAddTask(false)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBackground,
                    color: theme.text,
                    fontSize: "17px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!task.trim()}
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "12px",
                    border: "none",
                    background: task.trim() ? "#007AFF" : "#C7C7CC",
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "600",
                    cursor: task.trim() ? "pointer" : "not-allowed"
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddTask(true)}
        style={{
          position: "fixed",
          bottom: "120px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "28px",
          border: "none",
          background: "#007AFF",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,122,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}
      >
        +
      </motion.button>

      {/* Footer Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark 
            ? "rgba(28, 28, 30, 0.95)" 
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${theme.border}`,
          padding: "8px 0 24px 0",
          zIndex: 50
        }}
      >
        {/* Quick Stats */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 20px",
          fontSize: "13px",
          color: theme.textSecondary,
          borderBottom: `1px solid ${theme.border}`,
          marginBottom: "8px"
        }}>
          <span style={{ marginRight: "16px" }}>
            📊 {taskList.length} total
          </span>
          <span style={{ marginRight: "16px" }}>
            ✅ {taskList.filter(t => t.done).length} done
          </span>
          <span>
            ⏳ {taskList.filter(t => !t.done).length} pending
          </span>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "0 20px"
        }}>
          {[
            { id: 'today', icon: '📅', label: 'Today' },
            { id: 'stats', icon: '📊', label: 'Stats' },
            { id: 'add', icon: '+', label: 'Add', isSpecial: true },
            { id: 'calendar', icon: '📆', label: 'Calendar' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
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
                gap: "4px",
                padding: tab.isSpecial ? "8px" : "4px 8px",
                borderRadius: tab.isSpecial ? "20px" : "8px",
                border: "none",
                background: tab.isSpecial 
                  ? "#007AFF" 
                  : (activeFooterTab === tab.id 
                      ? (isDark ? "#2C2C2E" : "#E3F2FD") 
                      : "transparent"),
                color: tab.isSpecial 
                  ? "white" 
                  : (activeFooterTab === tab.id 
                      ? "#007AFF" 
                      : theme.textSecondary),
                cursor: "pointer",
                minWidth: tab.isSpecial ? "40px" : "auto",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ 
                fontSize: tab.isSpecial ? "20px" : "16px",
                fontWeight: tab.isSpecial ? "600" : "400"
              }}>
                {tab.icon}
              </span>
              {!tab.isSpecial && (
                <span style={{ 
                  fontSize: "11px", 
                  fontWeight: activeFooterTab === tab.id ? "600" : "400"
                }}>
                  {tab.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom Padding */}
      <div style={{ height: "120px" }} />
    </div>
  );
}

export default TodoiOSStyleComplete;