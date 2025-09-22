// Class Data Manager - Quản lý dữ liệu lớp học chung
// Sử dụng localStorage để chia sẻ dữ liệu giữa Teacher và Student

const CLASS_STORAGE_KEY = 'grading_ai_classes';

// Utility functions
const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getCurrentTimestamp = () => new Date().toISOString();

// Class Data Manager
export class ClassDataManager {
  
  // Lấy tất cả lớp học
  static getAllClasses() {
    try {
      const data = localStorage.getItem(CLASS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading classes:', error);
      return [];
    }
  }

  // Lưu tất cả lớp học
  static saveAllClasses(classes) {
    try {
      localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classes));
      return true;
    } catch (error) {
      console.error('Error saving classes:', error);
      return false;
    }
  }

  // Tạo lớp học mới (cho Teacher)
  static createClass(classData, teacherId) {
    const classes = this.getAllClasses();
    
    const newClass = {
      id: Date.now().toString(),
      code: generateClassCode(),
      name: classData.name,
      subject: classData.subject,
      description: classData.description || '',
      teacherId: teacherId,
      teacherName: classData.teacherName || 'Giáo viên',
      students: [],
      assignments: [],
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      isActive: true
    };

    classes.push(newClass);
    
    if (this.saveAllClasses(classes)) {
      return newClass;
    }
    return null;
  }

  // Tìm lớp học theo mã (cho Student)
  static findClassByCode(classCode) {
    const classes = this.getAllClasses();
    return classes.find(cls => 
      cls.code.toLowerCase() === classCode.toLowerCase() && 
      cls.isActive
    );
  }

  // Tham gia lớp học (cho Student)
  static joinClass(classCode, studentData) {
    const classes = this.getAllClasses();
    const classIndex = classes.findIndex(cls => 
      cls.code.toLowerCase() === classCode.toLowerCase() && 
      cls.isActive
    );

    if (classIndex === -1) {
      return { success: false, message: 'Không tìm thấy lớp học với mã này' };
    }

    const targetClass = classes[classIndex];
    
    // Kiểm tra xem học sinh đã tham gia chưa
    const isAlreadyJoined = targetClass.students.some(
      student => student.id === studentData.id
    );

    if (isAlreadyJoined) {
      return { success: false, message: 'Bạn đã tham gia lớp học này rồi' };
    }

    // Thêm học sinh vào lớp
    targetClass.students.push({
      id: studentData.id,
      name: studentData.name,
      email: studentData.email || '',
      joinedAt: getCurrentTimestamp()
    });

    targetClass.updatedAt = getCurrentTimestamp();
    classes[classIndex] = targetClass;

    if (this.saveAllClasses(classes)) {
      return { success: true, class: targetClass };
    }

    return { success: false, message: 'Lỗi khi tham gia lớp học' };
  }

  // Lấy lớp học của giáo viên
  static getTeacherClasses(teacherId) {
    const classes = this.getAllClasses();
    return classes.filter(cls => cls.teacherId === teacherId && cls.isActive);
  }

  // Lấy lớp học của học sinh
  static getStudentClasses(studentId) {
    const classes = this.getAllClasses();
    return classes.filter(cls => 
      cls.isActive && 
      cls.students.some(student => student.id === studentId)
    );
  }

  // Cập nhật thông tin lớp học
  static updateClass(classId, updates) {
    const classes = this.getAllClasses();
    const classIndex = classes.findIndex(cls => cls.id === classId);

    if (classIndex === -1) {
      return null;
    }

    classes[classIndex] = {
      ...classes[classIndex],
      ...updates,
      updatedAt: getCurrentTimestamp()
    };

    if (this.saveAllClasses(classes)) {
      return classes[classIndex];
    }
    return null;
  }

  // Xóa lớp học (đánh dấu inactive)
  static deleteClass(classId, teacherId) {
    const classes = this.getAllClasses();
    const classIndex = classes.findIndex(cls => 
      cls.id === classId && cls.teacherId === teacherId
    );

    if (classIndex === -1) {
      return false;
    }

    classes[classIndex].isActive = false;
    classes[classIndex].updatedAt = getCurrentTimestamp();

    return this.saveAllClasses(classes);
  }

  // Thêm bài tập vào lớp
  static addAssignment(classId, assignmentData) {
    const classes = this.getAllClasses();
    const classIndex = classes.findIndex(cls => cls.id === classId);

    if (classIndex === -1) {
      return null;
    }

    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      createdAt: getCurrentTimestamp(),
      submissions: []
    };

    classes[classIndex].assignments.push(newAssignment);
    classes[classIndex].updatedAt = getCurrentTimestamp();

    if (this.saveAllClasses(classes)) {
      return newAssignment;
    }
    return null;
  }

  // Debug function - Clear all data
  static clearAllData() {
    localStorage.removeItem(CLASS_STORAGE_KEY);
  }

  // Debug function - Get storage info
  static getStorageInfo() {
    const classes = this.getAllClasses();
    return {
      totalClasses: classes.length,
      activeClasses: classes.filter(cls => cls.isActive).length,
      totalStudents: classes.reduce((sum, cls) => sum + cls.students.length, 0),
      storageSize: localStorage.getItem(CLASS_STORAGE_KEY)?.length || 0
    };
  }
}

export default ClassDataManager;