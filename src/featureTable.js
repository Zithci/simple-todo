import React from "react";

const features = [
  { feature: "Sort by Newest Date", status: "✅ Done", updated: "2025-07-20" },
  { feature: "Enter to Add Task", status: "✅ Done", updated: "2025-07-20" },
  { feature: "Animated Feedback + Task Added Message", status: "✅ Done", updated: "2025-07-20" },
  { feature: "Dark Mode Toggle", status: "✅ Done", updated: "2025-07-19" },
  { feature: "Edit Task", status: "✅ Done", updated: "2025-07-18" },
  { feature: "Delete Task", status: "✅ Done", updated: "2025-07-18" },
  { feature: "LocalStorage Persistence", status: "✅ Done", updated: "2025-07-17" },
  { feature: "Timestamp CreatedAt", status: "✅ Done", updated: "2025-07-17" },
  { feature: "UI Animation FadeIn", status: "✅ Done", updated: "2025-07-17" },
];

function FeatureTable() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🚀 Feature Tracker</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            <th className="text-left p-2">Feature</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, idx) => (
            <tr keyx={idx} className="border-t border-gray-300">
              <td className="p-2">{item.feature}</td>
              <td className="p-2">{item.status}</td>
              <td className="p-2">{item.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export {features};
export default FeatureTable;
