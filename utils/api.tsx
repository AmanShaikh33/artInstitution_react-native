import axios from "axios";

const BASE_URL = "https://kedarbhame.pythonanywhere.com";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ STUDENT REGISTRATION (Teacher creates student)
export const createStudentByTeacher = async (studentData: {
  name: string;
  email: string;
  password: string;
  j_date: string; // format: YYYY-MM-DD
  phone_no: number;
  total_fees: number;
}) => {
  try {
    const response = await api.post("/student/register_api/", studentData);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to create student:", error);
    throw error.response?.data || { message: "Failed to create student" };
  }
};

// ✅ LOGIN (Auto-detect admin vs student)
export const loginStudent = async (email: string, password: string) => {
  const isAdmin = email.trim().toLowerCase() === "aman@gmail.com";
  const type = isAdmin ? "admin" : "student";

  try {
    const response = await api.post("/student/login_api/", {
      email,
      password,
      type,
    });

    return { ...response.data, type };
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ✅ FETCH ALL STUDENTS
export const fetchAllStudents = async () => {
  try {
    const response = await api.get("/student/student/student_api/");
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchAllStudents error:", error.message, error);
    throw error;
  }
};

// ✅ DELETE STUDENT
export const deleteStudent = async (id: string) => {
  try {
    const res = await api.delete(`/student/student/student_api/${id}/`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to delete student:", err);
    throw err;
  }
};

// ✅ ATTENDANCE - ADD
export const addAttendance = async (attendanceData: {
  date: string;
  present: boolean;
  student: number;
}) => {
  const res = await api.post("/main_admin/attendance/add/", attendanceData);
  return res.data;
};

// ✅ ATTENDANCE - FETCH ALL
export const fetchAllAttendance = async () => {
  try {
    const response = await api.get("/main_admin/attendance/all/");
    return response.data.all_attendance;
  } catch (err) {
    console.error("❌ Failed to fetch attendance:", err);
    throw err;
  }
};

// ✅ ATTENDANCE - UPDATE
export const updateAttendance = async (
  id: number,
  data: { date: string; present: boolean; student: number }
) => {
  try {
    const res = await api.put(`/main_admin/attendance/update/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update attendance:", err);
    throw err;
  }
};

// ✅ ATTENDANCE - DELETE
export const deleteAttendance = async (id: number) => {
  try {
    const response = await api.delete(`/main_admin/attendance/delete/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to delete attendance:", error);
    throw error.response?.data || { message: "Delete failed" };
  }
};

// ✅ NOTICE - ADD
export const addNotice = async (noticeData: {
  title: string;
  description: string;
}) => {
  const response = await api.post("/main_admin/notice/add/", noticeData);
  return response.data.notice;
};

// ✅ NOTICE - FETCH ALL
export const fetchAllNotices = async () => {
  const response = await api.get("/main_admin/notice/all/");
  return response.data.all_notice;
};

// ✅ NOTICE - UPDATE
export const updateNotice = async (
  id: number,
  noticeData: { title: string; description: string }
) => {
  const response = await api.put(`/main_admin/notice/update/${id}/`, noticeData);
  return response.data.updated_notice;
};

// ✅ NOTICE - DELETE
export const deleteNotice = async (id: number) => {
  const response = await api.delete(`/main_admin/notice/delete/${id}/`);
  return response.data;
};

// ✅ CLASS SCHEDULING - ADD
export const scheduleClass = async (date: string, detail: string) => {
  try {
    const response = await api.post(`/main_admin/calendercalender/`, {
      date,
      present: true,
      detail,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to schedule class:", error?.response?.data || error);
    throw error?.response?.data || { message: "Unknown error" };
  }
};

// ✅ CLASS SCHEDULING - FETCH ALL
export const getScheduledClasses = async () => {
  try {
    const response = await api.get(`/main_admin/calendercalender/`);
    return response.data; // returns array of { id, date, present, detail }
  } catch (error) {
    console.error("❌ Failed to fetch scheduled classes", error);
    throw error;
  }
};

// ✅ CLASS SCHEDULING - UPDATE
export const updateScheduledClass = async (
  id: number,
  payload: { date: string; present: boolean; detail: string }
) => {
  const res = await api.put(`/main_admin/calendercalender/${id}/`, payload);
  return res.data;
};

export const getAttendanceDetails = async (id: number) => {
  try {
    const res = await api.get(`/main_admin/attendance/details/${id}/`, {
      headers: { Accept: "application/json" },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching attendance details:", error?.response?.data || error.message);
    throw new Error("Failed to fetch attendance details");
  }
};

export const fetchStudentById = async (id: string | number) => {
  try {
    const response = await api.get(`/student/student/student_api/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchStudentById error:", error.message, error);
    throw error;
  }
};

export const payStudentFees = async (studentId: number, amount: number, remarks: string) => {
  try {
    const payload = {
      amount,
      remarks,
      student_id: studentId,
    };

    const response = await api.post("/student/feehistoryapi/feeshistoryapi/pay-fees/", payload);
    console.log("✅ payStudentFees response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ payStudentFees error:", error.message, error);
    throw error;
  }
};


