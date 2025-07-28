import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = ({ theme, currentTime, taskList, categories, onBack, handleAddTask, toggleTaskDone }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Health');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Get current date info
  const today = new Date();
  
  // Get month name
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  // Get days of current week based on selected date
  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }
    return weekDays;
  };

  // Generate calendar days for date picker
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.getDate(),
        fullDate: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString()
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const calendarDays = getCalendarDays();

  // Get tasks for specific date
  const getTasksForDate = (date) => {
    return taskList.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Add task with specific date
  const handleAdd = () => {
    if (newTask.trim() === '') return;
    
    const taskDate = new Date(selectedDate);
    taskDate.setHours(selectedTimeSlot || 9, 0, 0, 0); // Default to 9 AM if no time selected
    
    const task = {
      id: Date.now() + Math.random(),
      text: newTask.trim(),
      done: false,
      category: selectedCategory,
      createdAt: taskDate.toISOString(),
    };
    
    handleAddTask(task);
    setNewTask('');
    setShowAddModal(false);
    setSelectedTimeSlot(null);
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeSlots.push({
      time: `${hour}:00`,
      hour: hour
    });
  }

  // Get tasks for specific hour on selected date
  const getTasksForHour = (hour) => {
    const selectedDateTasks = getTasksForDate(selectedDate);
    return selectedDateTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getHours() === hour;
    });
  };

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
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: theme.text,
            margin: 0,
            cursor: "pointer"
          }}
          onClick={() => setShowDatePicker(true)}
          >
            Calendar <span style={{ 
              fontSize: "24px", 
              fontWeight: "400", 
              color: theme.textSecondary 
            }}>
              {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].slice(0, 3)}
            </span>
          </h1>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              fontSize: "32px",
              color: theme.textSecondary,
              cursor: "pointer",
              padding: "0"
            }}
          >
            ✕
          </button>
        </div>

        {/* Week View */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          marginBottom: "20px"
        }}>
          {weekDays.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(day.fullDate)}
              style={{
                textAlign: "center",
                padding: "12px 8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "12px",
                backgroundColor: selectedDate.toDateString() === day.fullDate.toDateString() 
                  ? "#007AFF20" 
                  : "transparent"
              }}
            >
              <div style={{
                fontSize: "12px",
                fontWeight: "500",
                color: theme.textSecondary,
                marginBottom: "8px"
              }}>
                {day.day}
              </div>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                backgroundColor: day.isToday ? "#007AFF" : "transparent",
                color: day.isToday ? "white" : theme.text,
                fontSize: "16px",
                fontWeight: day.isToday ? "600" : "400",
                border: selectedDate.toDateString() === day.fullDate.toDateString() && !day.isToday
                  ? "2px solid #007AFF"
                  : "none"
              }}>
                {day.date}
              </div>
              {/* Task indicator */}
              {getTasksForDate(day.fullDate).length > 0 && (
                <div style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "#FF3B30",
                  margin: "4px auto 0"
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule View */}
      <div style={{
        padding: "0 20px 100px 20px",
        backgroundColor: theme.background
      }}>
        {timeSlots.map((slot, index) => {
          const hourTasks = getTasksForHour(slot.hour);
          
          return (
            <div
              key={index}
              style={{
                display: "flex",
                minHeight: "60px",
                borderBottom: index === timeSlots.length - 1 ? "none" : `1px solid ${theme.border}20`,
                paddingBottom: "8px",
                marginBottom: "8px"
              }}
            >
              {/* Time */}
              <div style={{
                width: "60px",
                flexShrink: 0,
                paddingTop: "8px"
              }}>
                <span style={{
                  fontSize: "14px",
                  color: theme.textSecondary,
                  fontWeight: "400"
                }}>
                  {slot.time}
                </span>
              </div>

              {/* Tasks */}
              <div style={{
                flex: 1,
                marginLeft: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                {hourTasks.map((task, taskIndex) => {
                  const category = categories[task.category];
                  const duration = Math.floor(Math.random() * 3) + 1; // Random 1-3h duration
                  
                  return (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor: category?.color + "20",
                        borderLeft: `4px solid ${category?.color}`,
                        borderRadius: "8px",
                        padding: "12px 16px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = category?.color + "30";
                        e.target.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = category?.color + "20";
                        e.target.style.transform = "translateX(0px)";
                      }}
                    >
                      {/* Task content */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px"
                      }}>
                        <button
                          onClick={() => toggleTaskDone(task)}
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "6px",
                            border: task.done ? "none" : `2px solid ${category?.color}`,
                            backgroundColor: task.done ? "#34C759" : "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "8px",
                            color: "white",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {task.done && "✓"}
                        </button>
                        <span style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: theme.text,
                          textDecoration: task.done ? "line-through" : "none",
                          opacity: task.done ? 0.6 : 1,
                          cursor: "pointer"
                        }}
                        onClick={() => toggleTaskDone(task)}
                        >
                          {task.text}
                        </span>
                      </div>
                      
                      {/* Duration and category */}
                      <div style={{
                        fontSize: "12px",
                        color: theme.textSecondary,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{duration}h</span>
                        <span>•</span>
                        <span>{category?.icon} {task.category}</span>
                      </div>

                      {/* Completion status */}
                      {task.done && (
                        <div style={{
                          position: "absolute",
                          top: "8px",
                          right: "12px",
                          fontSize: "16px"
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Task Button for empty time slots */}
                {hourTasks.length === 0 && (
                  <button
                    onClick={() => {
                      setSelectedTimeSlot(slot.hour);
                      setShowAddModal(true);
                    }}
                    style={{
                      backgroundColor: theme.border + "15",
                      border: `2px dashed ${theme.border}`,
                      borderRadius: "8px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: theme.textSecondary
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#007AFF15";
                      e.target.style.borderColor = "#007AFF";
                      e.target.style.color = "#007AFF";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = theme.border + "15";
                      e.target.style.borderColor = theme.border;
                      e.target.style.color = theme.textSecondary;
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>+</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      Add task at {slot.time}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Summary */}
      <div style={{
        position: "fixed",
        bottom: "100px",
        left: "20px",
        right: "20px",
        backgroundColor: theme.cardBackground,
        borderRadius: "16px",
        padding: "16px",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.15)",
        backdropFilter: "blur(20px)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "4px"
            }}>
              {selectedDate.toDateString() === today.toDateString() 
                ? "Today's Progress" 
                : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div style={{
              fontSize: "12px",
              color: theme.textSecondary
            }}>
              {getTasksForDate(selectedDate).filter(t => t.done).length} of {getTasksForDate(selectedDate).length} tasks completed
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                backgroundColor: "#007AFF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "20px",
                fontWeight: "300"
              }}
            >
              +
            </button>
            <div style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#007AFF"
            }}>
              {Math.round(getTasksForDate(selectedDate).length > 0 ? (getTasksForDate(selectedDate).filter(t => t.done).length / getTasksForDate(selectedDate).length) * 100 : 0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {showDatePicker && (
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
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(10px)",
              padding: "20px"
            }}
            onClick={() => setShowDatePicker(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme.cardBackground,
                borderRadius: "20px",
                padding: "24px",
                width: "100%",
                maxWidth: "360px",
                border: `1px solid ${theme.border}`,
                boxShadow: theme.isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.15)"
              }}
            >
              {/* Month Navigation */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}>
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setCurrentMonth(newMonth);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    color: theme.text,
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px"
                  }}
                >
                  ‹
                </button>
                
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: theme.text,
                  margin: 0
                }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setCurrentMonth(newMonth);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    color: theme.text,
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px"
                  }}
                >
                  ›
                </button>
              </div>

              {/* Day Headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
                marginBottom: "8px"
              }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: theme.textSecondary
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
                marginBottom: "20px"
              }}>
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(day.fullDate);
                      setShowDatePicker(false);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      border: "none",
                      background: day.isSelected 
                        ? "#007AFF" 
                        : day.isToday 
                          ? "#007AFF20" 
                          : "transparent",
                      color: day.isSelected 
                        ? "white" 
                        : day.isToday 
                          ? "#007AFF" 
                          : day.isCurrentMonth 
                            ? theme.text 
                            : theme.textSecondary,
                      fontSize: "16px",
                      fontWeight: day.isSelected || day.isToday ? "600" : "400",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: day.isCurrentMonth ? 1 : 0.5,
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!day.isSelected) {
                        e.target.style.backgroundColor = "#007AFF20";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!day.isSelected && !day.isToday) {
                        e.target.style.backgroundColor = "transparent";
                      } else if (day.isToday && !day.isSelected) {
                        e.target.style.backgroundColor = "#007AFF20";
                      }
                    }}
                  >
                    {day.date}
                    {/* Task indicator */}
                    {getTasksForDate(day.fullDate).length > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: "2px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "2px",
                        backgroundColor: day.isSelected ? "white" : "#FF3B30"
                      }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{
                display: "flex",
                gap: "12px"
              }}>
                <button
                  onClick={() => {
                    setSelectedDate(today);
                    setShowDatePicker(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBackground,
                    color: theme.text,
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #007AFF, #0051D2)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
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
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme.cardBackground,
                borderTopLeftRadius: "28px",
                borderTopRightRadius: "28px",
                padding: "28px 24px 40px 24px",
                width: "100%",
                maxHeight: "70vh"
              }}
            >
              <div 
                style={{
                  width: "40px",
                  height: "4px",
                  background: theme.border,
                  borderRadius: "2px",
                  margin: "0 auto 24px auto"
                }} 
              />

              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 0 8px 0",
                color: theme.text,
                textAlign: "center"
              }}>
                Add Task
              </h2>
              
              <p style={{
                fontSize: "16px",
                color: theme.textSecondary,
                textAlign: "center",
                margin: "0 0 24px 0"
              }}>
                📅 {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
                {selectedTimeSlot && ` ⏰ ${selectedTimeSlot}:00`}
              </p>

              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="What needs to be done?"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: `2px solid ${theme.border}`,
                  background: theme.background,
                  color: theme.text,
                  fontSize: "16px",
                  outline: "none",
                  marginBottom: "20px",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
                autoFocus
              />

              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  fontSize: "16px",
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
                          ? `${config.color}20`
                          : theme.cardBackground,
                        color: theme.text,
                        fontSize: "14px",
                        fontWeight: selectedCategory === category ? "600" : "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{config.icon}</span>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBackground,
                    color: theme.text,
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newTask.trim()}
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "12px",
                    border: "none",
                    background: newTask.trim() 
                      ? "linear-gradient(135deg, #007AFF, #0051D2)"
                      : "#C7C7CC",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: newTask.trim() ? "pointer" : "not-allowed"
                  }}
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;