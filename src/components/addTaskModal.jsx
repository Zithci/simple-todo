import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddTaskModal = ({ 
  showAddTask, 
  setShowAddTask, 
  task, 
  setTask, 
  handleAdd, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  theme, 
  isDark 
}) => {
  return (
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
              ✨ Add New Task
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
  );
};

export default AddTaskModal;