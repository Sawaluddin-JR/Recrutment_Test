// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeUser from './pages/HomeUser'
import HomeAdmin from './pages/HomeAdmin'
import HomeModerator from './pages/HomeModerator'
import AdminProfile from './admin/AdminProfile'
import AdminDashboard from './admin/AdminDashboard' // Halaman default admin
import CandidateList from './admin/CandidateList'
import QuestionCodeAdd from './admin/QuestionCodeAdd'
import CandidateAdd from './admin/CandidateAdd'
import QuestionForm from './admin/QuestionForm'
import QuestionBank from './admin/QuestionBank'
import TestScheduleForm from './admin/TestScheduleForm'
import TestScheduleList from './admin/TestScheduleList'
import AdminProfileEdit from './admin/AdminProfileEdit'
import AdminProfilePassword from './admin/AdminProfilePassword'
import UserDashboard from './user/UserDashboard'
import UserProfile from './user/UserProfile'
import UserTakeTest from './user/UserTakeTest'
import UserTestHistory from './user/UserTestHistory'
import AdminCompany from './admin/AdminCompany'
import UserProfileEdit from './user/UserProfileEdit'
import UserProfilePassword from './user/UserProfilePassword'
import UserNotification from './user/UserNotification'
import AdminNotification from './admin/AdminNotification'
import EditQuestionFormEdit from './admin/QuestionFormEdit'
import TestForm from './user/TestForm'
import FormPenilaianJawaban from './admin/FormPenilaianJawaban'
import FormHasilSeleksi from './admin/FormHasilSeleksi'
import FormManajemenUser from './admin/FormManajemenUser'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home/moderator" element={<HomeModerator />} />

      {/* Nested route for Admin */}
      <Route path="/home/admin" element={<HomeAdmin />}>
        <Route index element={<AdminDashboard />} /> {/* default page */}
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profile/edit" element={<AdminProfileEdit />} />
        <Route path="profile/changepass" element={<AdminProfilePassword />} />
        <Route path="company" element={<AdminCompany />} />
        <Route path="candidates" element={<CandidateList />} />
        <Route path="candidates/add" element={<CandidateAdd />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="questions/add" element={<QuestionForm />} />
        {/* <Route path="questions/edit" element={<EditQuestionFormEdit />} /> */}
        <Route path="questionscode/add" element={<QuestionCodeAdd />} />
        <Route path="schedule" element={<TestScheduleList />} />
        <Route path="schedule/add" element={<TestScheduleForm />} />
        <Route path="notification" element={<AdminNotification />} />
        <Route path="penilaianjawaban/:id" element={<FormPenilaianJawaban />} />
        <Route path="hasilseleksi" element={<FormHasilSeleksi />} />
        <Route path="manajementuser" element={<FormManajemenUser />} />
      </Route>

      {/* Nested route for User */}
      <Route path="/home/user" element={<HomeUser />}>
        <Route index element={<UserDashboard />} /> {/* default page */}
        <Route path="take-test" element={<UserTakeTest />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/edit" element={<UserProfileEdit />} />
        <Route path="profile/changepass" element={<UserProfilePassword />} />
        <Route path="notifications" element={<UserNotification />} />
        <Route path="history" element={<UserTestHistory />} />
        <Route path="test" element={<TestForm />} />
      </Route>
    </Routes>
  );
}
