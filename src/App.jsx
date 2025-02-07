import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
const NotFoundPage = lazy(() => import("./404"));
const WebsiteRoute = lazy(() => import("./site-route/WebsiteRoute"));
const AdminRoute = lazy(() => import("./site-route/AdminRoute"));
const StudentRoute = lazy(() => import("./site-route/StudentRoute"));
const ParentRoute = lazy(() => import("./site-route/ParentRoute"));
const StudentAssignmentRoute = lazy(() => import("./site-route/StudentAssignmentRoute"));
const StudentQuizRoute = lazy(() => import("./site-route/StudentQuizRoute"));
const ForBidden = lazy(() => import("./ForBidden.jsx"));
function App() {
  const [expand, setExpand] = useState(false);
  const [folded, setFolded] = useState(false);

  function toggleExpand(data) {
    setExpand(data);
  }
  function toggleFolded(data) {
    setFolded(data);
  }
  return (
    <Suspense fallback={"....."}>
      <Router>
        <Routes>
          <Route path="/*" element={<WebsiteRoute />}></Route>
          <Route
            path="/admin/*"
            element={
              <div
                className={`${expand ? "is-expand" : ""} ${folded ? "is-folded" : ""
                  }`}
              >
                <AdminRoute
                  toggleExpand={toggleExpand}
                  toggleFolded={toggleFolded}
                />
              </div>
            }
          ></Route>
          <Route
            path="/student/*"
            element={
              <div
                className={`${expand ? "is-expand" : ""} ${folded ? "is-folded" : ""
                  }`}
              >
                <StudentRoute
                  toggleExpand={toggleExpand}
                  toggleFolded={toggleFolded}
                />
              </div>
            }
          ></Route>
          <Route
            path="/assignment/*"
            element={<StudentAssignmentRoute />}
          ></Route>
          <Route path="/quiz/*" element={<StudentQuizRoute />}></Route>
          <Route path="/parent/*" element={<ParentRoute />}></Route>
          <Route path="/page-not-found" element={<NotFoundPage />} />
          <Route path="/forbidden" element={<ForBidden />} />
          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
export default App;