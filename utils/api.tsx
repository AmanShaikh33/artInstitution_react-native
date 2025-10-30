import axios from "axios";

const BASE_URL = "https://kedarbhame.pythonanywhere.com";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


export const createStudentByTeacher = async (studentData: {
  name: string;
  email: string;
  password: string;
  j_date: string; // format: YYYY-MM-DD
  phone_no: number;
  total_fees: number;
}) => {
  try {
    const response = await api.post("/student/add/", studentData);
    return response.data.data;
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

export const fetchAllStudents = async () => {
  try {
    const response = await api.get("/student/all/");
    
    return response.data?.data ?? [];
  } catch (error: any) {
    console.error("❌ fetchAllStudents error:", error.message, error);
    return [];
  }
};

export const getStudentDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/student/details/${id}/`);
    return response.data.data; 
  } catch (error: any) {
    console.error("❌ Error fetching student details:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteStudent = async (id: string) => {
  try {
    const res = await api.delete(`/student/student/delete/${id}/`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to delete student:", err);
    throw err;
  }
};


  
export const addAttendance = async (studentId: number, date: string, present: boolean) => {
  try {
    const response = await api.post("/main_admin/attendance/add/", {
      date,        
      present,     
      student: studentId 
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error adding attendance:", error.response?.data || error.message);
    return null;
  }
};


export const fetchAllAttendance = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/main_admin/attendance/all/`);

 
    return response.data.data; 
  } catch (error: any) {
    console.error("❌ Error fetching attendance:", error.response?.data || error.message);
    throw error; 
  }
};


export const updateAttendance = async (attendanceId: number, payload: { date: string; present: boolean; student: number }) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/main_admin/attendance/update/${attendanceId}/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Attendance updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating attendance:", error.response?.data || error.message);
    return null;
  }
};



export const deleteAttendance = async (id: number) => {
  try {
    const response = await api.delete(`/main_admin/attendance/delete/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to delete attendance:", error);
    throw error.response?.data || { message: "Delete failed" };
  }
};


export const addNotice = async (noticeData: {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  status?: string;
  created_at?: string;
}) => {
  try {
    const response = await api.post("/main_admin/notice/notice/add/", noticeData);
    return response.data; 
  } catch (error: any) {
    console.error("Error adding notice:", error);
    throw error.response?.data || error.message;
  }
};

export const fetchAllNotices = async (page: number = 1) => {
  try {
    const response = await api.get(`/main_admin/notice/notice/all/?page=${page}`);
    return response.data.data; 
  } catch (error: any) {
    console.error("Error fetching notices:", error);
    throw error.response?.data || error.message;
  }
};

export const updateNotice = async (
  id: number,
  noticeData: {
    title: string;
    description: string;
    category?: string;
    priority?: string;
    status?: string;
    created_at?: string;
  }
) => {
  try {
    const response = await api.put(`/main_admin/notice/notice/update/${id}/`, noticeData);
    return response.data; 
  } catch (error: any) {
    console.error("Error updating notice:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteNotice = async (id: number) => {
  try {
    const response = await api.delete(`/main_admin/notice/notice/delete/${id}/`);
    return response.data; 
  } catch (error: any) {
    console.error("Error deleting notice:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ CLASS SCHEDULING - ADD
export const scheduleClass = async (date: string, detail: string) => {
  try {
    const response = await api.post(`/main_admin/calender/add/`, {
      date,
      present: true,
      detail,
    });
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Failed to schedule class:", error?.response?.data || error);
    throw error?.response?.data || { message: "Unknown error" };
  }
};

// ✅ CLASS SCHEDULING - FETCH ALL
export const getScheduledClasses = async () => {
  try {
    const response = await api.get(`/main_admin/calender/all/`);
    return response.data.data; // returns array of { id, date, present, detail }
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
  const res = await api.put(`/main_admin/calender/update/${id}/`, payload);
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
    const response = await api.get(`/student/student/details/${id}/`);
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

export const addHomework = async (
  title: string,
  description: string,
  created_at: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/main_admin/homework/add/`, {
      title,
      description,
      created_at,
    });

    return response.data; 
  } catch (error: any) {
    console.error("❌ Error adding homework:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getAllHomework = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/main_admin/homework/all/`);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error fetching homework:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteHomework = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/main_admin/homework/delete/${id}/`);
    return response.data; 
  } catch (error: any) {
    console.error("❌ Error deleting homework:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


