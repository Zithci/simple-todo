// App.jsx - Main Component
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Components
import Stats from './components/stats';
import Calendar from './components/calendar';
import Settings from './components/settings';
import Confetti from './components/confetti';
import AddTaskModal from './components/addTaskModal';
import Timer from './components/Timer';

function TodoiOSStyleComplete() {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [swipedTask, setSwipedTask] = useState(null);
  
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
    
    // Show confetti when task is completed
    if (!taskObj.done) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
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

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(taskList));
  }, [taskList]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('todoTheme', JSON.stringify(isDark));
  }, [isDark]);

  const getTasksByCategory = (category) => {
    return taskList.filter(task => task.category === category);
  };

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

  // Render tab content
  const renderTabContent = () => {
    switch(activeFooterTab) {
      case 'stats': 
        return (
          <Stats 
            theme={theme}
            taskList={taskList}
            categories={categories}
            getTasksByCategory={getTasksByCategory}
            onBack={() => setActiveFooterTab('today')}
          />
        );
      case 'calendar': 
        return (
          <Calendar 
            theme={theme}
            currentTime={currentTime}
            taskList={taskList}
            categories={categories}
            onBack={() => setActiveFooterTab('today')}
            handleAddTask={(newTask) => setTaskList([...taskList, newTask])}
            toggleTaskDone={toggleDone}
          />
        );
      case 'settings': 
        return (
          <Settings 
            theme={theme}
            taskList={taskList}
            isDark={isDark}
            setIsDark={setIsDark}
            setTaskList={setTaskList}
            onBack={() => setActiveFooterTab('today')}
          />
        );
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
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Status Bar */}
      <div style={{
        padding: "8px 20px 0 20px",
        fontSize: "17px",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: theme.statusBar,
        backgroundColor: theme.background
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
      <h2 style={{ 
        marginLeft: "20px",
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "1.2",
        marginBottom: "8px",
        marginTop: "16px",
        color: isDark ? "#FFFFFF" : "#1a1a1a"
      }}>
        Hi Ella(Dr.) 👋👩‍⚕️
      </h2>

      {/* Header */}
      <div style={{
        padding: "20px 20px 0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }}>
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
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        padding: "24px 20px"
      }}>
        {Object.entries(categories).map(([category, config]) => {
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
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>
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
      <div style={{ padding: "0 20px" }} onClick={() => setSwipedTask(null)}>
        <AnimatePresence>
          {taskList.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: theme.textSecondary,
              background: isDark 
                ? "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
              borderRadius: "24px",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📝</div>
              <p style={{ fontSize: "20px", margin: "0", fontWeight: "600" }}>No tasks yet</p>
              <p style={{ fontSize: "16px", margin: "12px 0 0 0", opacity: 0.7 }}>
                Tap the + button to add your first task
              </p>
            </div>
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
                  drag="x"
                  dragConstraints={{ left: -80, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(event, info) => {
                    if (info.offset.x < -60) {
                      setSwipedTask(task.id);
                    } else {
                      setSwipedTask(null);
                    }
                  }}
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
                    overflow: "visible",
                    cursor: "grab",
                    zIndex: 1
                  }}
                  whileDrag={{ cursor: "grabbing", scale: 1.02, zIndex: 10 }}
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

                  {/* Swipe Delete Button */}
                  <AnimatePresence>
                    {swipedTask === task.id && (
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        style={{
                          position: "absolute",
                          right: "-80px",
                          top: 0,
                          bottom: 0,
                          width: "80px",
                          background: "linear-gradient(135deg, #FF3B30, #FF6B6B)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0 16px 16px 0",
                          cursor: "pointer",
                          boxShadow: "-2px 0 8px rgba(255, 59, 48, 0.3)"
                        }}
                        onClick={() => {
                          handleDelete(task);
                          setSwipedTask(null);
                        }}
                      >
                        <div style={{
                          color: "white",
                          fontSize: "24px",
                          fontWeight: "600"
                        }}>
                          🗑️
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                          onClick={() => {
                            setActiveTask(task);
                            setShowTimer(true);
                          }}
                          style={{
                            background: "linear-gradient(135deg, #FF9500, #FFB340)",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "8px",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(255, 149, 0, 0.3)"
                          }}
                        >
                          ⏰
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
      <AddTaskModal
        showAddTask={showAddTask}
        setShowAddTask={setShowAddTask}
        task={task}
        setTask={setTask}
        handleAdd={handleAdd}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        theme={theme}
        isDark={isDark}
      />

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
          zIndex: 1001,
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        +
      </button>

      {/* Footer Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: isDark 
          ? "#000000" 
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${theme.border}`,
        padding: "12px 0 28px 0",
        zIndex: 50
      }}>
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
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Timer Modal */}
      <AnimatePresence>
        {showTimer && (
          <Timer 
            theme={theme}
            taskName={activeTask?.text}
            onClose={() => {
              setShowTimer(false);
              setActiveTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TodoiOSStyleComplete;