import React from 'react';
import { motion } from 'framer-motion';

const Settings = ({ theme, taskList, isDark, setIsDark, setTaskList, onBack }) => {
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
            ⚙️ Settings
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
        {/* Dark Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: theme.cardBackground,
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
            border: `1px solid ${theme.border}`,
            boxShadow: theme.isDark 
              ? "0 8px 32px rgba(0,0,0,0.3)" 
              : "0 4px 20px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center"
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
                backgroundColor: isDark ? "#FF950020" : "#007AFF20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
              }}>
                {isDark ? "🌙" : "☀️"}
              </div>
              <div>
                <h3 style={{ 
                  fontSize: "18px", 
                  fontWeight: "600", 
                  color: theme.text,
                  margin: 0,
                  marginBottom: "2px"
                }}>
                  Dark Mode
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: theme.textSecondary,
                  margin: 0
                }}>
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: "60px",
                height: "32px",
                borderRadius: "16px",
                border: "none",
                background: isDark 
                  ? "linear-gradient(135deg, #34C759, #30D158)" 
                  : "linear-gradient(135deg, #E5E7EB, #D1D5DB)",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: isDark 
                  ? "0 2px 8px rgba(52, 199, 89, 0.3)"
                  : "0 2px 4px rgba(0,0,0,0.1)"
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
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease"
                }}
              />
            </button>
          </div>
        </motion.div>

        {/* Storage Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: theme.cardBackground,
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
            border: `1px solid ${theme.border}`,
            boxShadow: theme.isDark 
              ? "0 8px 32px rgba(0,0,0,0.3)" 
              : "0 4px 20px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#007AFF20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}>
              💾
            </div>
            <div>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                color: theme.text,
                margin: 0,
                marginBottom: "2px"
              }}>
                Storage Information
              </h3>
              <p style={{
                fontSize: "14px",
                color: theme.textSecondary,
                margin: 0
              }}>
                Your app data overview
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px"
          }}>
            <div style={{
              padding: "12px",
              backgroundColor: "#007AFF10",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#007AFF",
                marginBottom: "4px"
              }}>
                {taskList.length}
              </div>
              <div style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontWeight: "500"
              }}>
                Tasks saved
              </div>
            </div>
            <div style={{
              padding: "12px",
              backgroundColor: "#34C75910",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#34C759",
                marginBottom: "4px"
              }}>
                {taskList.filter(t => t.done).length}
              </div>
              <div style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontWeight: "500"
              }}>
                Completed
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: theme.isDark ? "#2C2C2E" : "#F5F5F5",
            borderRadius: "12px",
            marginBottom: "12px"
          }}>
            <span style={{ fontSize: "14px", color: theme.textSecondary }}>Theme mode:</span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#007AFF" }}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: theme.isDark ? "#2C2C2E" : "#F5F5F5",
            borderRadius: "12px"
          }}>
            <span style={{ fontSize: "14px", color: theme.textSecondary }}>Last updated:</span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: theme.text }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Storage Note */}
          <div style={{
            textAlign: "center",
            padding: "12px 16px",
            backgroundColor: theme.isDark ? "#007AFF15" : "#007AFF10",
            borderRadius: "12px",
            border: `1px solid #007AFF30`,
            marginTop: "16px"
          }}>
            <p style={{
              fontSize: "13px",
              color: "#007AFF",
              margin: 0,
              fontWeight: "500"
            }}>
              📱 Data stored locally in your browser
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Export Backup */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontWeight: "600",
              boxShadow: "0 8px 32px rgba(52, 199, 89, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.3s ease",
              fontSize: "16px"
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              📤
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "4px" }}>Export Backup</div>
              <div style={{ fontSize: "14px", opacity: 0.9, fontWeight: "400" }}>
                Download your tasks as JSON file
              </div>
            </div>
          </motion.button>

          {/* Clear All Data */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontWeight: "600",
              boxShadow: "0 8px 32px rgba(255, 59, 48, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.3s ease",
              fontSize: "16px"
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🗑️
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "4px" }}>Clear All Data</div>
              <div style={{ fontSize: "14px", opacity: 0.9, fontWeight: "400" }}>
                Remove all tasks and reset app
              </div>
            </div>
          </motion.button>
        </div>
        
        {/* App Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "24px",
            background: theme.cardBackground,
            borderRadius: "20px",
            padding: "24px",
            border: `1px solid ${theme.border}`,
            boxShadow: theme.isDark 
              ? "0 8px 32px rgba(0,0,0,0.3)" 
              : "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Background decoration */}
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #007AFF15, #34C75915)",
            filter: "blur(30px)",
            zIndex: 0
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              fontSize: "64px", 
              // marginBottom: "16px",
              // background: "linear-gradient(135deg, #007AFF, #34C759)",
              // backgroundClip: "text",
              // WebkitBackgroundClip: "text",
              // WebkitTextFillColor: "transparent"
            }}>
              👩‍⚕️
            </div>
            <div style={{ 
              fontWeight: "700", 
              marginBottom: "8px",
              fontSize: "20px",
              color: theme.text
            }}>
              Todo App v2.0
            </div>
            <div style={{ 
              fontSize: "14px", 
              color: theme.textSecondary, 
              lineHeight: "1.6",
              maxWidth: "280px",
              margin: "0 auto"
            }}>
              Just A Beginning<br/>
              Auto-save enabled • {taskList.length} tasks stored
            </div>
            <div style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: theme.isDark ? "#2C2C2E" : "#F5F5F5",
              borderRadius: "12px",
              fontSize: "12px",
              color: theme.textSecondary,
              fontWeight: "500"
            }}>
              <b>From Rivera & Atreus To Help U Increasin Ur Dr Schedule</b>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;